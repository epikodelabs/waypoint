using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace WaypointServer;

public sealed class WaypointRouter(WaypointSnapshotSource source)
{
    public string ResolveOutputPath(string relative) => source.ResolveOutputPath(relative);

    public async Task<ServerNavigationResolution?> ResolveAsync(
        string target,
        ServerPrincipal? principal,
        CancellationToken cancellationToken)
    {
        if (!TryInternalTarget(target, out var current))
            return null;

        var snapshot = await source.LoadAsync(cancellationToken);
        var ordered = new List<ServerArtifactRecord>();
        var seenArtifacts = new HashSet<string>(StringComparer.Ordinal);
        var visitedTargets = new HashSet<string>(StringComparer.Ordinal);
        string? requestedArtifactKey = null;

        for (var redirectCount = 0; ; redirectCount++)
        {
            if (!visitedTargets.Add(current))
                return null;

            var uri = new Uri("http://waypoint.local" + current);
            var match = FindBranch(snapshot, uri.AbsolutePath);
            if (match is null)
                return null;

            var (branch, parameters) = match.Value;
            if (string.IsNullOrWhiteSpace(branch.RouteSetId) ||
                !branch.Policies.All(policy => PolicyAllowed(policy, principal)))
                return null;

            var routeArtifacts = snapshot.Index.Artifacts
                .Where(x => x.Kind == "route" && x.RouteSetId == branch.RouteSetId)
                .ToArray();

            if (routeArtifacts.Length != 1)
                return null;

            var artifact = routeArtifacts[0];
            requestedArtifactKey ??= artifact.ArtifactKey;

            var chain = AuthorizedChain(snapshot, artifact.ArtifactKey, principal);
            if (chain is null)
                return null;

            foreach (var item in chain)
                if (seenArtifacts.Add(item.ArtifactKey))
                    ordered.Add(item);

            if (branch.Kind != "redirect" || string.IsNullOrWhiteSpace(branch.RedirectTo))
                return Resolution(requestedArtifactKey, ordered);

            if (redirectCount >= 16)
                throw new InvalidOperationException("Maximum server redirect count exceeded.");

            var redirected = Interpolate(branch.RedirectTo, parameters);
            if (Regex.IsMatch(redirected, @"^[A-Za-z][A-Za-z\d+.-]*:") ||
                redirected.StartsWith("//", StringComparison.Ordinal))
                return Resolution(requestedArtifactKey, ordered);

            if (!TryInternalTarget(redirected, out current))
                return null;
        }
    }

    public async Task<string?> ResolveLandingAsync(
        IEnumerable<string> targets,
        ServerPrincipal? principal,
        CancellationToken cancellationToken)
    {
        foreach (var target in targets)
            if (await ResolveAsync(target, principal, cancellationToken) is not null)
                return target;
        return null;
    }

    public async Task<ServerArtifactRecord?> ResolveModuleAsync(
        string artifactKey,
        string hash,
        ServerPrincipal? principal,
        CancellationToken cancellationToken)
    {
        var snapshot = await source.LoadAsync(cancellationToken);
        var chain = AuthorizedChain(snapshot, artifactKey, principal);
        var artifact = chain?.LastOrDefault(x => x.ArtifactKey == artifactKey);
        return artifact is not null &&
               !string.IsNullOrWhiteSpace(artifact.Hash) &&
               CryptographicOperations.FixedTimeEquals(
                   Encoding.UTF8.GetBytes(artifact.Hash),
                   Encoding.UTF8.GetBytes(hash))
            ? artifact
            : null;
    }

    public async Task<ServerNavigationConfiguration> ResolveConfigurationAsync(
        ServerPrincipal? principal,
        CancellationToken cancellationToken)
    {
        var snapshot = await source.LoadAsync(cancellationToken);
        var ordered = new List<ServerArtifactRecord>();
        var seen = new HashSet<string>(StringComparer.Ordinal);

        foreach (var artifact in snapshot.Index.Artifacts)
        {
            var chain = AuthorizedChain(snapshot, artifact.ArtifactKey, principal);
            if (chain is null) continue;
            foreach (var item in chain)
                if (seen.Add(item.ArtifactKey))
                    ordered.Add(item);
        }

        var deliveries = ordered.Select(artifact =>
            new ServerConfigurationArtifactDelivery(
                artifact.ArtifactKey,
                ModuleUrl(artifact),
                artifact.Hash!,
                artifact.Kind,
                EffectiveIdentity(snapshot, artifact.ArtifactKey))).ToArray();

        return new ServerNavigationConfiguration(snapshot.Revision, deliveries);
    }

    private ServerNavigationResolution Resolution(
        string artifactKey,
        IReadOnlyList<ServerArtifactRecord> artifacts) =>
        new(
            artifactKey,
            artifacts.Select(x => new ServerArtifactDelivery(
                x.ArtifactKey,
                ModuleUrl(x),
                x.Hash!)).ToArray());

    private static string ModuleUrl(ServerArtifactRecord artifact) =>
        $"/api/navigation/modules/{Uri.EscapeDataString(artifact.ArtifactKey)}/{Uri.EscapeDataString(artifact.Hash ?? "")}";

    private static IReadOnlyList<ServerArtifactRecord>? AuthorizedChain(
        WaypointSnapshotSource.Snapshot snapshot,
        string artifactKey,
        ServerPrincipal? principal)
    {
        var byKey = snapshot.Index.Artifacts.ToDictionary(x => x.ArtifactKey, StringComparer.Ordinal);
        var ordered = new List<ServerArtifactRecord>();
        var visiting = new HashSet<string>(StringComparer.Ordinal);
        var visited = new HashSet<string>(StringComparer.Ordinal);

        bool Visit(string key)
        {
            if (visited.Contains(key)) return true;
            if (!byKey.TryGetValue(key, out var artifact) || !visiting.Add(key))
                return false;

            foreach (var dependency in Dependencies(artifact))
                if (!Visit(dependency))
                    return false;

            visiting.Remove(key);

            if (!ArtifactAllowed(snapshot, artifact, principal))
                return false;

            visited.Add(key);
            ordered.Add(artifact);
            return true;
        }

        return Visit(artifactKey) ? ordered : null;
    }

    private static bool ArtifactAllowed(
        WaypointSnapshotSource.Snapshot snapshot,
        ServerArtifactRecord artifact,
        ServerPrincipal? principal)
    {
        if (!AuthorizationAllowed(artifact.Authorization, principal))
            return false;

        if (artifact.Kind != "route")
            return true;

        var required = artifact.BranchIds.ToHashSet(StringComparer.Ordinal);
        if (required.Count == 0) return true;

        var branches = snapshot.Shards.Values
            .SelectMany(x => x.Branches)
            .Where(x => required.Contains(x.Id))
            .ToDictionary(x => x.Id, StringComparer.Ordinal);

        return required.All(id =>
            branches.TryGetValue(id, out var branch) &&
            branch.Policies.All(policy => PolicyAllowed(policy, principal)));
    }

    private static IEnumerable<string> Dependencies(ServerArtifactRecord artifact) =>
        artifact.Kind == "route"
            ? artifact.Dependencies.Concat(artifact.SharedDependencies)
            : artifact.Dependencies;

    private static bool AuthorizationAllowed(
        ServerArtifactAuthorization authorization,
        ServerPrincipal? principal)
    {
        if (principal is null)
            return authorization.AllowAnonymous;

        return authorization.Roles.All(principal.Roles.Contains) &&
               authorization.Permissions.All(principal.Permissions.Contains);
    }

    private static bool PolicyAllowed(ServerRoutePolicy policy, ServerPrincipal? principal)
    {
        if (principal is null)
            return policy.AllowAnonymous == true;

        return policy.Roles.All(principal.Roles.Contains) &&
               policy.Permissions.All(principal.Permissions.Contains);
    }

    private static (ServerRouteBranch Branch, Dictionary<string, string> Params)? FindBranch(
        WaypointSnapshotSource.Snapshot snapshot,
        string pathname)
    {
        var normalized = NormalizePath(pathname);
        var descriptors = snapshot.Index.Shards
            .Where(x => PrefixMatches(x.Prefix, normalized))
            .OrderByDescending(x => RouteSegments(x.Prefix).Length);

        foreach (var descriptor in descriptors)
        {
            if (!snapshot.Shards.TryGetValue(descriptor.File, out var shard))
                continue;

            foreach (var branch in shard.Branches)
            {
                var parameters = MatchPattern(branch.Path, normalized);
                if (parameters is not null)
                    return (branch, parameters);
            }
        }

        return null;
    }

    private static Dictionary<string, string>? MatchPattern(string pattern, string pathname)
    {
        var expected = RouteSegments(pattern);
        var actual = RouteSegments(pathname);
        if (expected.Length != actual.Length) return null;

        var parameters = new Dictionary<string, string>(StringComparer.Ordinal);
        for (var i = 0; i < expected.Length; i++)
        {
            if (expected[i].StartsWith(':'))
            {
                var name = expected[i][1..];
                if (name.Length == 0) return null;
                parameters[name] = Uri.UnescapeDataString(actual[i]);
            }
            else if (!string.Equals(expected[i], actual[i], StringComparison.Ordinal))
            {
                return null;
            }
        }
        return parameters;
    }

    private static string Interpolate(string redirectTo, IReadOnlyDictionary<string, string> parameters) =>
        Regex.Replace(redirectTo, @":([A-Za-z_][A-Za-z0-9_]*)", match =>
        {
            var name = match.Groups[1].Value;
            if (!parameters.TryGetValue(name, out var value))
                throw new InvalidOperationException($"Missing redirect parameter \"{name}\".");
            return Uri.EscapeDataString(value);
        });

    private static bool PrefixMatches(string prefix, string pathname)
    {
        var p = RouteSegments(prefix);
        var x = RouteSegments(pathname);
        if (p.Length > x.Length) return false;
        for (var i = 0; i < p.Length; i++)
            if (!string.Equals(p[i], x[i], StringComparison.Ordinal))
                return false;
        return true;
    }

    private static string[] RouteSegments(string value) =>
        NormalizePath(value).Split('/', StringSplitOptions.RemoveEmptyEntries);

    private static string NormalizePath(string value)
    {
        var path = value.Split(['?', '#'], 2)[0].Trim();
        return "/" + string.Join("/", path.Split('/', StringSplitOptions.RemoveEmptyEntries));
    }

    private static bool TryInternalTarget(string target, out string relative)
    {
        relative = "";
        if (string.IsNullOrWhiteSpace(target) || target.StartsWith("//", StringComparison.Ordinal))
            return false;

        if (!Uri.TryCreate(new Uri("http://waypoint.local"), target, out var uri) ||
            uri.Scheme != "http" ||
            uri.Host != "waypoint.local")
            return false;

        relative = uri.PathAndQuery + uri.Fragment;
        return true;
    }

    private static string EffectiveIdentity(
        WaypointSnapshotSource.Snapshot snapshot,
        string artifactKey)
    {
        var byKey = snapshot.Index.Artifacts.ToDictionary(x => x.ArtifactKey, StringComparer.Ordinal);
        var memo = new Dictionary<string, string>(StringComparer.Ordinal);

        string Visit(string key)
        {
            if (memo.TryGetValue(key, out var cached)) return cached;
            var artifact = byKey[key];
            var input = string.Join("\n",
                new[] { artifact.ArtifactKey, artifact.Hash ?? "" }
                    .Concat(Dependencies(artifact).Select(Visit)));
            var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(input))).ToLowerInvariant();
            return memo[key] = hash;
        }

        return Visit(artifactKey);
    }
}