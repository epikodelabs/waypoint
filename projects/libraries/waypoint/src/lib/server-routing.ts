import {
  WAYPOINT_SERVER_DELIVERY_VERSION,
  type ServerArtifactDelivery,
  type ServerNavigationResolution,
} from './server-delivery';

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
export interface ServerArtifactRecord {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly branchIds: readonly string[];
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerArtifactIndex {
  readonly artifacts: readonly ServerArtifactRecord[];
}

export class ServerArtifactResolutionError extends Error {
  constructor(
    public readonly code: 'missing' | 'unavailable' | 'cycle',
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
  const byKey = new Map(
    index.artifacts.map(artifact => [artifact.artifactKey, artifact] as const),
  );
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
    for (const dependency of artifact.dependencies) visit(dependency);
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
  return new Set(artifacts.flatMap(artifact => artifact.branchIds));
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
  return artifact.branchIds.length > 0
    && artifact.branchIds.every(branchId => {
      const branch = branches.get(branchId);
      return !!branch
        && branch.routeSetId === artifact.routeSetId
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
 * Converts an already-authorized dependency chain to the public wire contract.
 * No route, slot, policy, branch, source-file, or dependency metadata crosses
 * this boundary.
 */
export function createServerNavigationResolution(
  artifactKey: string,
  artifacts: readonly ServerArtifactRecord[],
  moduleUrlFor: (artifact: ServerArtifactRecord) => string,
): ServerNavigationResolution {
  if (artifacts.length === 0 || artifacts.at(-1)?.artifactKey !== artifactKey) {
    throw new ServerArtifactResolutionError(
      'missing',
      `Artifact chain does not terminate at target "${artifactKey}".`,
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
      artifactKey: artifact.artifactKey,
      moduleUrl,
      hash: artifact.hash,
    });
  });

  return Object.freeze({
    version: WAYPOINT_SERVER_DELIVERY_VERSION,
    artifactKey,
    artifacts: Object.freeze(delivery),
  });
}
