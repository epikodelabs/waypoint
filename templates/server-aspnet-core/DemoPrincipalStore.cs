namespace WaypointServer;

public sealed class DemoPrincipalStore
{
    public const string PrincipalItemKey = "waypoint.principal";

    private readonly IReadOnlyDictionary<string, DemoPrincipalProfile> _profiles =
        new Dictionary<string, DemoPrincipalProfile>(StringComparer.Ordinal)
        {
            ["nora"] = new(
                "nora",
                new ServerPrincipal(
                    "nora",
                    new HashSet<string>(["user"], StringComparer.Ordinal),
                    new HashSet<string>(
                        ["project:read", "draft:write", "reports:read"],
                        StringComparer.Ordinal)),
                ["/app/settings?section=access", "/"]),
            ["lev"] = new(
                "lev",
                new ServerPrincipal(
                    "lev",
                    new HashSet<string>(["admin"], StringComparer.Ordinal),
                    new HashSet<string>(
                        ["project:read", "settings:write", "draft:write", "reports:read", "admin:read"],
                        StringComparer.Ordinal)),
                ["/app/admin", "/app/settings?section=access", "/"])
        };

    public DemoPrincipalProfile? Profile(string? identity) =>
        identity is not null && _profiles.TryGetValue(identity.Trim(), out var profile)
            ? profile
            : null;

    public ServerPrincipal? Read(HttpRequest request)
    {
        string? token = null;

        var authorization = request.Headers.Authorization.ToString();
        if (authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            token = authorization["Bearer ".Length..].Trim();

        if (string.IsNullOrWhiteSpace(token))
            request.Cookies.TryGetValue("identity", out token);

        return Profile(token)?.Principal;
    }
}

public sealed record DemoPrincipalProfile(
    string Id,
    ServerPrincipal Principal,
    IReadOnlyList<string> LandingTargets);
