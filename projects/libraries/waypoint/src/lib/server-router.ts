import {
  createServerNavigationResolution,
  ServerArtifactResolutionError,
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
  readonly kind?: 'route' | 'redirect';
  readonly redirectTo?: string;
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
  /** Maximum number of internal server-resolved redirect hops. Defaults to 16. */
  readonly maxRedirects?: number;
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
  resolveLanding(
    targets: readonly (string | URL)[],
    principal?: ServerPrincipal,
  ): Promise<string | null>;
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
    return (await findBranchMatch(snapshot, pathname))?.branch;
  }

  async function resolve(
    target: string | URL,
    principal?: ServerPrincipal,
  ): Promise<ServerNavigationResolution | null> {
    const pathname = pathnameOf(target);
    if (pathname === null) return null;

    const snapshot = await loadSnapshot(options);
    const resolution = await resolveNavigationChain(
      snapshot,
      target,
      principal,
      options.maxRedirects ?? 16,
    );
    if (!resolution) return null;

    return createServerNavigationResolution(
      resolution.artifactKey,
      resolution.artifacts,
      candidate => options.moduleUrlFor(candidate),
    );
  }

  async function resolveNavigationChain(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    target: string | URL,
    principal: ServerPrincipal | undefined,
    maxRedirects: number,
  ): Promise<{ readonly artifactKey: string; readonly artifacts: readonly TArtifact[] } | null> {
    const ordered: TArtifact[] = [];
    const seenArtifacts = new Set<string>();
    const visitedTargets = new Set<string>();
    let current = relativeTargetOf(target);
    let requestedArtifactKey: string | undefined;

    for (let redirectCount = 0; ; redirectCount++) {
      const pathname = pathnameOf(current);
      if (pathname === null || visitedTargets.has(current)) return null;
      visitedTargets.add(current);

      const matched = await findBranchMatch(snapshot, pathname);
      if (!matched) return null;
      const { branch, params } = matched;

      if (
        !branch.routeSetId
        || !branch.policies.every(policy => isServerPolicyAllowed(policy, principal))
      ) {
        return null;
      }

      const artifacts = snapshot.index.artifacts.filter(
        candidate => candidate.routeSetId === branch.routeSetId,
      );
      if (artifacts.length === 0) return null;
      if (artifacts.length > 1) {
        throw new ServerArtifactResolutionError(
          'invalid',
          `Route set "${branch.routeSetId}" maps to multiple server artifacts.`,
        );
      }

      const artifact = artifacts[0]!;
      requestedArtifactKey ??= artifact.artifactKey;
      const chain = await authorizedChain(snapshot, artifact.artifactKey, principal);
      if (!chain) return null;
      for (const item of chain) {
        if (seenArtifacts.has(item.artifactKey)) continue;
        seenArtifacts.add(item.artifactKey);
        ordered.push(item);
      }

      if (branch.kind !== 'redirect' || !branch.redirectTo) {
        return {
          artifactKey: requestedArtifactKey!,
          artifacts: Object.freeze([...ordered]),
        };
      }

      if (redirectCount >= maxRedirects) {
        throw new ServerArtifactResolutionError(
          'invalid',
          `Maximum server redirect count of ${maxRedirects} exceeded.`,
        );
      }

      const redirected = interpolateServerRedirect(branch.redirectTo, params);
      if (isExternalTarget(redirected)) {
        return {
          artifactKey: requestedArtifactKey!,
          artifacts: Object.freeze([...ordered]),
        };
      }
      current = redirected;
    }
  }

  async function resolveLanding(
    targets: readonly (string | URL)[],
    principal?: ServerPrincipal,
  ): Promise<string | null> {
    for (const target of targets) {
      const resolution = await resolve(target, principal);
      if (!resolution) continue;

      const pathname = pathnameOf(target);
      if (pathname === null) continue;
      return typeof target === 'string'
        ? relativeTargetOf(target)
        : `${target.pathname}${target.search}${target.hash}`;
    }

    return null;
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

  async function findBranchMatch(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    pathname: string,
  ): Promise<{ readonly branch: TBranch; readonly params: Readonly<Record<string, string>> } | undefined> {
    const candidates = [...snapshot.index.shards]
      .filter(shard => isPathPrefix(shard.prefix, pathname))
      .sort((left, right) => right.prefix.length - left.prefix.length);

    for (const descriptor of candidates) {
      const shard = await snapshot.loadShard(descriptor.file);
      for (const branch of shard.branches) {
        const params = matchRoutePattern(branch.path, pathname);
        if (params) return { branch, params };
      }
    }

    return undefined;
  }

  return Object.freeze({
    match,
    resolve,
    resolveLanding,
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
  return matchRoutePattern(pattern, pathname) !== null;
}

export function matchRoutePattern(
  pattern: string,
  pathname: string,
): Readonly<Record<string, string>> | null {
  const expected = routeSegments(pattern);
  const actual = routeSegments(pathname);
  if (expected.length !== actual.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < expected.length; index++) {
    const part = expected[index]!;
    const value = actual[index]!;
    if (part.startsWith(':')) {
      params[part.slice(1)] = value;
      continue;
    }
    if (part !== value) return null;
  }
  return Object.freeze(params);
}

export function isPathPrefix(prefix: string, pathname: string): boolean {
  const normalizedPrefix = normalizePath(prefix);
  const normalizedPathname = normalizePath(pathname);

  return normalizedPrefix === '/'
    || normalizedPathname === normalizedPrefix
    || normalizedPathname.startsWith(`${normalizedPrefix}/`);
}


function relativeTargetOf(target: string | URL): string {
  const url = target instanceof URL ? target : new URL(target, 'http://waypoint.local');
  return `${url.pathname}${url.search}${url.hash}`;
}

function interpolateServerRedirect(
  redirectTo: string,
  params: Readonly<Record<string, string>>,
): string {
  return redirectTo.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, key: string) => {
    const value = params[key];
    if (value === undefined) {
      throw new ServerArtifactResolutionError(
        'invalid',
        `Missing route parameter "${key}" for redirect "${redirectTo}".`,
      );
    }
    return value;
  });
}

function isExternalTarget(target: string): boolean {
  return /^[A-Za-z][A-Za-z\d+.-]*:/.test(target) || target.startsWith('//');
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