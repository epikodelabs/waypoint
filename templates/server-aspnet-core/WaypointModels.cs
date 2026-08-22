using System.Text.Json.Serialization;

namespace WaypointServer;

public sealed record ServerPrincipal(
    string Subject,
    IReadOnlySet<string> Roles,
    IReadOnlySet<string> Permissions);

public sealed record ServerRoutePolicy
{
    [JsonPropertyName("allowAnonymous")]
    public bool? AllowAnonymous { get; init; }

    [JsonPropertyName("roles")]
    public string[] Roles { get; init; } = [];

    [JsonPropertyName("permissions")]
    public string[] Permissions { get; init; } = [];
}

public sealed record ServerArtifactAuthorization
{
    [JsonPropertyName("allowAnonymous")]
    public bool AllowAnonymous { get; init; }

    [JsonPropertyName("roles")]
    public string[] Roles { get; init; } = [];

    [JsonPropertyName("permissions")]
    public string[] Permissions { get; init; } = [];
}

public sealed record ServerArtifactRecord
{
    [JsonPropertyName("kind")]
    public required string Kind { get; init; }

    [JsonPropertyName("artifactKey")]
    public required string ArtifactKey { get; init; }

    [JsonPropertyName("routeSetId")]
    public string? RouteSetId { get; init; }

    [JsonPropertyName("dependencies")]
    public string[] Dependencies { get; init; } = [];

    [JsonPropertyName("sharedDependencies")]
    public string[] SharedDependencies { get; init; } = [];

    [JsonPropertyName("branchIds")]
    public string[] BranchIds { get; init; } = [];

    [JsonPropertyName("authorization")]
    public required ServerArtifactAuthorization Authorization { get; init; }

    [JsonPropertyName("file")]
    public string? File { get; init; }

    [JsonPropertyName("hash")]
    public string? Hash { get; init; }
}

public sealed record ServerShardDescriptor
{
    [JsonPropertyName("prefix")]
    public required string Prefix { get; init; }

    [JsonPropertyName("file")]
    public required string File { get; init; }
}

public sealed record ServerIndex
{
    [JsonPropertyName("shards")]
    public ServerShardDescriptor[] Shards { get; init; } = [];

    [JsonPropertyName("artifacts")]
    public ServerArtifactRecord[] Artifacts { get; init; } = [];
}

public sealed record ServerRouteBranch
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("kind")]
    public string Kind { get; init; } = "route";

    [JsonPropertyName("path")]
    public required string Path { get; init; }

    [JsonPropertyName("staticPrefix")]
    public string StaticPrefix { get; init; } = "/";

    [JsonPropertyName("routeSetId")]
    public string? RouteSetId { get; init; }

    [JsonPropertyName("redirectTo")]
    public string? RedirectTo { get; init; }

    [JsonPropertyName("policies")]
    public ServerRoutePolicy[] Policies { get; init; } = [];
}

public sealed record ServerShard
{
    [JsonPropertyName("branches")]
    public ServerRouteBranch[] Branches { get; init; } = [];
}

public sealed record ServerArtifactDelivery(
    [property: JsonPropertyName("artifactKey")] string ArtifactKey,
    [property: JsonPropertyName("moduleUrl")] string ModuleUrl,
    [property: JsonPropertyName("hash")] string Hash);

public sealed record ServerNavigationResolution(
    [property: JsonPropertyName("artifactKey")] string ArtifactKey,
    [property: JsonPropertyName("artifacts")] IReadOnlyList<ServerArtifactDelivery> Artifacts);

public sealed record ServerConfigurationArtifactDelivery(
    [property: JsonPropertyName("artifactKey")] string ArtifactKey,
    [property: JsonPropertyName("moduleUrl")] string ModuleUrl,
    [property: JsonPropertyName("hash")] string Hash,
    [property: JsonPropertyName("kind")] string Kind,
    [property: JsonPropertyName("identity")] string Identity);

public sealed record ServerNavigationConfiguration(
    [property: JsonPropertyName("revision")] string Revision,
    [property: JsonPropertyName("artifacts")] IReadOnlyList<ServerConfigurationArtifactDelivery> Artifacts)
{
    [JsonPropertyName("landing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Landing { get; init; }
}
