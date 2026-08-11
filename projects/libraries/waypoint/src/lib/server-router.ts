import {
  createServerNavigationResolution,
  isServerArtifactChainAuthorized,
  isServerPolicyAllowed,
  requiredServerBranchIds,
  resolveServerArtifactChain,
  type ServerArtifactRecord,
  type ServerPrincipal,
  type ServerRouteBranch,
} from './server-routing';
import type { ServerNavigationResolution } from './server-delivery';

export interface ServerRoutableBranch extends ServerRouteBranch {
  readonly path: string;
}

export interface ServerRouteShardDescriptor {
  readonly prefix: string;
  readonly file: string;
}

export interface ServerRouterIndex<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> {
  readonly shards: readonly ServerRouteShardDescriptor[];
  readonly artifacts: readonly TArtifact[];
}

export interface ServerRouterShard<
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  readonly branches: readonly TBranch[];
}

export interface ServerRouterSnapshot<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  readonly index: ServerRouterIndex<TArtifact>;
  loadShard(file: string): Promise<ServerRouterShard<TBranch>>;
}

export interface ServerRouterSource<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  /** Preferred source contract: one immutable compiler-output generation. */
  loadSnapshot?(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
  /** Legacy loaders remain supported for custom sources. */
  loadIndex?(): Promise<ServerRouterIndex<TArtifact>>;
  loadShard?(file: string): Promise<ServerRouterShard<TBranch>>;
}

export interface ServerRouterOptions<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> extends ServerRouterSource<TArtifact, TBranch> {
  moduleUrlFor(artifact: TArtifact): string;
}

export interface ServerRouter<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  match(target: string | URL): Promise<TBranch | undefined>;
  resolve(
    target: string | URL,
    principal?: ServerPrincipal,
  ): Promise<ServerNavigationResolution | null>;
  resolveArtifact(
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null>;
  resolveModule(
    artifactKey: string,
    hash: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null>;
}

/**
 * Creates the framework-neutral server half of Waypoint routing.
 *
 * The router owns URL matching, shard selection, route-set lookup, dependency
 * resolution, authorization, and construction of the public delivery plan.
 * HTTP frameworks are adapters around this API rather than participants in the
 * routing model.
 */
export function createServerRouter<
  TArtifact extends ServerArtifactRecord,
  TBranch extends ServerRoutableBranch,
>(
  options: ServerRouterOptions<TArtifact, TBranch>,
): ServerRouter<TArtifact, TBranch> {
  async function match(target: string | URL): Promise<TBranch | undefined> {
    const pathname = pathnameOf(target);
    if (pathname === null) return undefined;

    const snapshot = await loadSnapshot(options);
    return findBranch(snapshot, pathname);
  }

  async function resolve(
    target: string | URL,
    principal?: ServerPrincipal,
  ): Promise<ServerNavigationResolution | null> {
    const pathname = pathnameOf(target);
    if (pathname === null) return null;

    const snapshot = await loadSnapshot(options);
    const index = snapshot.index;
    const branch = await findBranch(snapshot, pathname);

    if (
      !branch?.routeSetId
      || !branch.policies.every(policy => isServerPolicyAllowed(policy, principal))
    ) {
      return null;
    }

    const artifact = index.artifacts.find(
      candidate => candidate.routeSetId === branch.routeSetId,
    );
    if (!artifact) return null;

    const chain = await authorizedChain(snapshot, artifact.artifactKey, principal);
    if (!chain) return null;

    return createServerNavigationResolution(
      artifact.artifactKey,
      chain,
      candidate => options.moduleUrlFor(candidate),
    );
  }

  async function resolveArtifact(
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null> {
    const snapshot = await loadSnapshot(options);
    const chain = await authorizedChain(snapshot, artifactKey, principal);
    return chain?.at(-1) ?? null;
  }

  async function resolveModule(
    artifactKey: string,
    hash: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null> {
    if (!artifactKey.trim() || !hash.trim()) return null;

    const artifact = await resolveArtifact(artifactKey, principal);
    return artifact?.hash === hash ? artifact : null;
  }

  async function authorizedChain(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<readonly TArtifact[] | null> {
    const chain = resolveServerArtifactChain(snapshot.index, artifactKey);
    const branches = await loadBranches(
      snapshot,
      requiredServerBranchIds(chain),
    );

    return isServerArtifactChainAuthorized(chain, branches, principal)
      ? chain
      : null;
  }

  async function loadBranches(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    branchIds: ReadonlySet<string>,
  ): Promise<ReadonlyMap<string, TBranch>> {
    const remaining = new Set(branchIds);
    const result = new Map<string, TBranch>();
    if (remaining.size === 0) return result;

    for (const descriptor of snapshot.index.shards) {
      const shard = await snapshot.loadShard(descriptor.file);

      for (const branch of shard.branches) {
        if (!remaining.has(branch.id)) continue;
        result.set(branch.id, branch);
        remaining.delete(branch.id);
      }

      if (remaining.size === 0) break;
    }

    return result;
  }

  async function findBranch(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    pathname: string,
  ): Promise<TBranch | undefined> {
    const candidates = [...snapshot.index.shards]
      .filter(shard => isPathPrefix(shard.prefix, pathname))
      .sort((left, right) => right.prefix.length - left.prefix.length);

    for (const descriptor of candidates) {
      const shard = await snapshot.loadShard(descriptor.file);
      const branch = shard.branches.find(candidate =>
        matchesRoutePattern(candidate.path, pathname));
      if (branch) return branch;
    }

    return undefined;
  }

  return Object.freeze({
    match,
    resolve,
    resolveArtifact,
    resolveModule,
  });
}

async function loadSnapshot<
  TArtifact extends ServerArtifactRecord,
  TBranch extends ServerRoutableBranch,
>(
  source: ServerRouterSource<TArtifact, TBranch>,
): Promise<ServerRouterSnapshot<TArtifact, TBranch>> {
  if (source.loadSnapshot) return source.loadSnapshot();
  if (!source.loadIndex || !source.loadShard) {
    throw new Error(
      'Server router source must provide loadSnapshot() or both loadIndex() and loadShard().',
    );
  }

  const index = await source.loadIndex();
  return Object.freeze({
    index,
    loadShard: (file: string) => source.loadShard!(file),
  });
}

export function matchesRoutePattern(pattern: string, pathname: string): boolean {
  const expected = routeSegments(pattern);
  const actual = routeSegments(pathname);

  return expected.length === actual.length
    && expected.every(
      (part, index) => part.startsWith(':') || part === actual[index],
    );
}

export function isPathPrefix(prefix: string, pathname: string): boolean {
  const normalizedPrefix = normalizePath(prefix);
  const normalizedPathname = normalizePath(pathname);

  return normalizedPrefix === '/'
    || normalizedPathname === normalizedPrefix
    || normalizedPathname.startsWith(`${normalizedPrefix}/`);
}

function pathnameOf(target: string | URL): string | null {
  if (target instanceof URL) return normalizePath(target.pathname);
  if (typeof target !== 'string' || !target.trim()) return null;

  try {
    const url = new URL(target, 'http://waypoint.local');
    if (url.origin !== 'http://waypoint.local') return null;
    return normalizePath(url.pathname);
  } catch {
    return null;
  }
}

function routeSegments(value: string): readonly string[] {
  return normalizePath(value).split('/').filter(Boolean);
}

function normalizePath(value: string): string {
  const path = value.split(/[?#]/, 1)[0]?.trim() || '/';
  const normalized = `/${path.split('/').filter(Boolean).join('/')}`;
  return normalized || '/';
}