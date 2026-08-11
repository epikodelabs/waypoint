import type {
  ServerRoutableBranch,
  ServerRouterIndex,
  ServerRouterShard,
  ServerRouterSnapshot,
} from './server-router';
import type { ServerArtifactRecord } from './server-routing';

export interface ServerRouterSnapshotSource<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  loadSnapshot(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
  refresh(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
  invalidate(): void;
}

export interface ServerRouterSnapshotSourceOptions<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  loadIndex(): Promise<ServerRouterIndex<TArtifact>>;
  loadShard(file: string): Promise<ServerRouterShard<TBranch>>;
  /** Cheap publication identity (for example index mtime + size). */
  revision?(): Promise<string | number>;
}

/**
 * Creates an immutable, atomically refreshed view of compiler routing output.
 *
 * A snapshot eagerly loads every shard referenced by its index before becoming
 * visible. A failed refresh therefore leaves the previous successful snapshot
 * active instead of exposing a mixed index/shard generation. Concurrent first
 * loads and refreshes share one publication attempt.
 */
export function createServerRouterSnapshotSource<
  TArtifact extends ServerArtifactRecord,
  TBranch extends ServerRoutableBranch,
>(
  options: ServerRouterSnapshotSourceOptions<TArtifact, TBranch>,
): ServerRouterSnapshotSource<TArtifact, TBranch> {
  let current: ServerRouterSnapshot<TArtifact, TBranch> | undefined;
  let currentRevision: string | number | undefined;
  let epoch = 0;
  let pending: Promise<ServerRouterSnapshot<TArtifact, TBranch>> | undefined;

  async function build(): Promise<{
    readonly snapshot: ServerRouterSnapshot<TArtifact, TBranch>;
    readonly revision?: string | number;
  }> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const before = options.revision
        ? await options.revision()
        : undefined;
      const index = await options.loadIndex();
      const descriptors = uniqueShardFiles(index);
      const loaded = await Promise.all(
        descriptors.map(async file => [file, await options.loadShard(file)] as const),
      );
      const after = options.revision
        ? await options.revision()
        : undefined;

      if (before !== undefined && after !== before) continue;

      const shards = new Map(loaded);
      return {
        revision: after ?? before,
        snapshot: Object.freeze({
          index,
          async loadShard(file: string) {
            const shard = shards.get(file);
            if (!shard) {
              throw new Error(`Server routing snapshot does not contain shard "${file}".`);
            }
            return shard;
          },
        }),
      };
    }

    throw new Error('Server routing output changed repeatedly while creating a snapshot.');
  }

  function publish(): Promise<ServerRouterSnapshot<TArtifact, TBranch>> {
    if (pending) return pending;

    const publicationEpoch = epoch;
    const attempt = build().then(result => {
      if (epoch === publicationEpoch) {
        current = result.snapshot;
        currentRevision = result.revision;
      }
      return result.snapshot;
    });
    pending = attempt;

    void attempt.finally(() => {
      if (pending === attempt) pending = undefined;
    }).catch(() => undefined);

    return attempt;
  }

  return Object.freeze({
    async loadSnapshot() {
      if (!current) return publish();
      if (!options.revision) return current;

      const revision = await options.revision();
      return revision === currentRevision ? current : publish();
    },
    refresh() {
      return publish();
    },
    invalidate() {
      epoch++;
      current = undefined;
      currentRevision = undefined;
      // A build that started before invalidation may still finish for its original
      // caller, but subsequent callers must not join that stale publication.
      pending = undefined;
    },
  });
}

function uniqueShardFiles<TArtifact extends ServerArtifactRecord>(
  index: ServerRouterIndex<TArtifact>,
): readonly string[] {
  return [...new Set(index.shards.map(descriptor => descriptor.file))];
}
