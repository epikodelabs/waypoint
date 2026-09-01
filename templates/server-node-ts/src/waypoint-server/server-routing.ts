import {
  type ServerArtifactDelivery,
  type ServerNavigationResolution,
} from './server-delivery';
import {
  serverArtifactDependencies,
  type ServerArtifactRecord as DeliveryServerArtifactRecord,
} from './server-artifact';
import {
  isServerDeliveryArtifactAuthorized,
} from './server-artifact-authorization';

export interface ServerRoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface ServerPrincipal {
  readonly subject: string;
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}

/** Minimal server-side branch provenance needed to authorize artifact code. */
export interface ServerRouteBranch {
  readonly id: string;
  readonly routeSetId?: string;
  readonly policies: readonly ServerRoutePolicy[];
}

/** Minimal compiler artifact metadata needed by the server routing contract. */
/**
 * Backward-compatible routing artifact shape. New compiler output uses the
 * discriminated records from `server-artifact.ts`; legacy tests/sources may
 * omit `kind` and authorization metadata and are treated as route artifacts.
 */
export interface ServerArtifactRecord {
  readonly kind?: 'route' | 'shared';
  readonly artifactKey: string;
  readonly routeSetId?: string;
  readonly dependencies: readonly string[];
  readonly sharedDependencies?: readonly string[];
  readonly branchIds?: readonly string[];
  readonly consumers?: readonly string[];
  readonly authorization?: Readonly<{
    readonly allowAnonymous: boolean;
    readonly roles: readonly string[];
    readonly permissions: readonly string[];
  }>;
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerArtifactIndex {
  readonly artifacts: readonly ServerArtifactRecord[];
}

export class ServerArtifactResolutionError extends Error {
  constructor(
    public readonly code: 'missing' | 'unavailable' | 'cycle' | 'invalid',
    message: string,
  ) {
    super(message);
    this.name = 'ServerArtifactResolutionError';
  }
}

/** Resolves an artifact and all transitive dependencies in dependency-first order. */
export function resolveServerArtifactChain<T extends ServerArtifactRecord>(
  index: { readonly artifacts: readonly T[] },
  artifactKey: string,
): readonly T[] {
  const byKey = new Map<string, T>();
  for (const artifact of index.artifacts) {
    if (byKey.has(artifact.artifactKey)) {
      throw new ServerArtifactResolutionError(
        'invalid',
        `Duplicate artifact key "${artifact.artifactKey}" in the server index.`,
      );
    }
    byKey.set(artifact.artifactKey, artifact);
  }
  const ordered: T[] = [];
  const completed = new Set<string>();
  const active = new Set<string>();

  const visit = (key: string): void => {
    if (completed.has(key)) return;
    if (active.has(key)) {
      throw new ServerArtifactResolutionError(
        'cycle',
        `Artifact dependency cycle includes "${key}".`,
      );
    }

    const artifact = byKey.get(key);
    if (!artifact) {
      throw new ServerArtifactResolutionError(
        'missing',
        `Artifact "${key}" is missing from the server index.`,
      );
    }
    if (!artifact.file || !artifact.hash) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${key}" has not been published.`,
      );
    }

    active.add(key);
    for (const dependency of artifactDependencies(artifact)) visit(dependency);
    active.delete(key);
    completed.add(key);
    ordered.push(artifact);
  };

  visit(artifactKey);
  return Object.freeze(ordered);
}

export function requiredServerBranchIds(
  artifacts: readonly ServerArtifactRecord[],
): ReadonlySet<string> {
  return new Set(artifacts.flatMap(artifact =>
    artifact.kind === 'shared' ? [] : (artifact.branchIds ?? [])));
}

export function isServerPolicyAllowed(
  policy: ServerRoutePolicy,
  principal?: ServerPrincipal,
): boolean {
  if (policy.allowAnonymous) return true;
  if (!principal) return false;

  const roles = policy.roles ?? [];
  return (roles.length === 0 || roles.some(role => principal.roles.has(role)))
    && (policy.permissions ?? [])
      .every(permission => principal.permissions.has(permission));
}

/**
 * An artifact is an atomic code-delivery boundary. It is authorized only when
 * every branch whose code it contains belongs to the artifact's route set and
 * every inherited policy on every contained branch is allowed.
 */
export function isServerArtifactAuthorized(
  artifact: ServerArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  if (artifact.authorization && (artifact.kind === 'route' || artifact.kind === 'shared')) {
    return isServerDeliveryArtifactAuthorized(
      artifact as DeliveryServerArtifactRecord,
      branches,
      principal,
    );
  }

  const branchIds = artifact.branchIds ?? [];
  const routeSetId = artifact.routeSetId;
  return branchIds.length > 0
    && !!routeSetId
    && branchIds.every(branchId => {
      const branch = branches.get(branchId);
      return !!branch
        && branch.routeSetId === routeSetId
        && branch.policies.every(policy =>
          isServerPolicyAllowed(policy, principal));
    });
}

export function isServerArtifactChainAuthorized(
  artifacts: readonly ServerArtifactRecord[],
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  return artifacts.every(artifact =>
    isServerArtifactAuthorized(artifact, branches, principal));
}

/**
 * Effective executable identity of one artifact.
 *
 * The browser does not receive dependency metadata. The server therefore folds
 * the dependency-first content-hash chain into one opaque identity.
 */
export function serverArtifactEffectiveIdentity<
  T extends ServerArtifactRecord,
>(
  index: { readonly artifacts: readonly T[] },
  artifactKey: string,
): string {
  const chain =
    resolveServerArtifactChain(
      index,
      artifactKey,
    );

  const hashes =
    chain.map(artifact => {
      if (!artifact.hash) {
        throw new ServerArtifactResolutionError(
          'unavailable',
          `Artifact "${artifact.artifactKey}" has not been published.`,
        );
      }

      return artifact.hash;
    });

  return `v1:${hashes.join('.')}`;
}

function artifactDependencies(artifact: ServerArtifactRecord): readonly string[] {
  if (artifact.kind === 'route' || artifact.kind === 'shared') {
    return serverArtifactDependencies(artifact as DeliveryServerArtifactRecord);
  }
  return artifact.dependencies;
}

/**
 * Converts an already-authorized dependency chain to the public wire contract.
 * No route, slot, policy, branch, source-file, or dependency metadata crosses
 * this boundary.
 */
export function createServerNavigationResolution<T extends ServerArtifactRecord>(
  artifactKey: string,
  artifacts: readonly T[],
  moduleUrlFor: (artifact: T) => string,
): ServerNavigationResolution {
  if (artifacts.length === 0 || !artifacts.some(item => item.artifactKey === artifactKey)) {
    throw new ServerArtifactResolutionError(
      'missing',
      `Artifact delivery plan does not contain requested artifact "${artifactKey}".`,
    );
  }

  const delivery: ServerArtifactDelivery[] = artifacts.map(artifact => {
    if (!artifact.file || !artifact.hash) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${artifact.artifactKey}" has not been published.`,
      );
    }

    const moduleUrl = moduleUrlFor(artifact);
    if (!moduleUrl.trim()) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${artifact.artifactKey}" has no delivery URL.`,
      );
    }

    return Object.freeze({
      ...(artifact.kind ? { kind: artifact.kind } : {}),
      artifactKey: artifact.artifactKey,
      moduleUrl,
      hash: artifact.hash,
    });
  });

  return Object.freeze({
    artifactKey,
    artifacts: Object.freeze(delivery),
  });
}