using System.Text.Json;

namespace WaypointServer;

/// <summary>
/// Loads one immutable compiler publication. All shards are read before a new
/// snapshot becomes visible, preventing mixed index/shard generations.
/// </summary>
public sealed class WaypointSnapshotSource(IConfiguration configuration)
{
    private readonly SemaphoreSlim _gate = new(1, 1);
    private Snapshot? _current;
    private string? _revision;

    public string OutputRoot { get; } = Path.GetFullPath(
        configuration["WAYPOINT_OUTPUT_ROOT"]
        ?? Environment.GetEnvironmentVariable("WAYPOINT_OUTPUT_ROOT")
        ?? Path.Combine(AppContext.BaseDirectory, "waypoint"));

    public string IndexPath => Path.GetFullPath(
        configuration["WAYPOINT_SERVER_INDEX"]
        ?? Environment.GetEnvironmentVariable("WAYPOINT_SERVER_INDEX")
        ?? Path.Combine(OutputRoot, "server-index.json"));

    public async Task<Snapshot> LoadAsync(CancellationToken cancellationToken)
    {
        var revision = Revision();
        if (_current is not null && revision == _revision)
            return _current;

        await _gate.WaitAsync(cancellationToken);
        try
        {
            revision = Revision();
            if (_current is not null && revision == _revision)
                return _current;

            for (var attempt = 0; attempt < 3; attempt++)
            {
                var before = Revision();
                var index = await ReadJsonAsync<ServerIndex>(IndexPath, cancellationToken);
                var shards = new Dictionary<string, ServerShard>(StringComparer.Ordinal);

                foreach (var descriptor in index.Shards
                    .GroupBy(x => x.File, StringComparer.Ordinal)
                    .Select(x => x.First()))
                {
                    shards[descriptor.File] = await ReadJsonAsync<ServerShard>(
                        ResolveOutputPath(descriptor.File),
                        cancellationToken);
                }

                var after = Revision();
                if (before != after)
                    continue;

                var snapshot = new Snapshot(index, shards, after);
                _current = snapshot;
                _revision = after;
                return snapshot;
            }

            throw new InvalidOperationException(
                "Waypoint compiler output changed repeatedly while creating a snapshot.");
        }
        finally
        {
            _gate.Release();
        }
    }

    public string ResolveOutputPath(string relative)
    {
        var root = Path.GetFullPath(Path.GetDirectoryName(IndexPath)!);
        var absolute = Path.GetFullPath(Path.Combine(root, relative));
        var relativeBack = Path.GetRelativePath(root, absolute);

        if (relativeBack == ".." ||
            relativeBack.StartsWith($"..{Path.DirectorySeparatorChar}", StringComparison.Ordinal) ||
            Path.IsPathRooted(relativeBack))
            throw new InvalidOperationException(
                $"Compiler output path \"{relative}\" escapes \"{root}\".");

        return absolute;
    }

    private string Revision()
    {
        var info = new FileInfo(IndexPath);
        return $"{info.LastWriteTimeUtc.Ticks}:{info.Length}";
    }

    private static async Task<T> ReadJsonAsync<T>(
        string path,
        CancellationToken cancellationToken)
    {
        await using var stream = File.OpenRead(path);
        return (await JsonSerializer.DeserializeAsync<T>(
            stream,
            cancellationToken: cancellationToken))
            ?? throw new InvalidOperationException($"Invalid JSON: {path}");
    }

    public sealed record Snapshot(
        ServerIndex Index,
        IReadOnlyDictionary<string, ServerShard> Shards,
        string Revision);
}
