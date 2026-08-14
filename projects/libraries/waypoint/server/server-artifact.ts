export interface ServerArtifactAuthorization {
  readonly allowAnonymous: boolean;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
}

export interface ServerRouteArtifactRecord {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly sharedDependencies?: readonly string[];
  readonly branchIds: readonly string[];
  readonly authorization: ServerArtifactAuthorization;
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerSharedArtifactRecord {
  readonly kind: 'shared';
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly consumers: readonly string[];
  readonly authorization: ServerArtifactAuthorization;
  readonly file?: string;
  readonly hash?: string;
}

export type ServerArtifactRecord =
  | ServerRouteArtifactRecord
  | ServerSharedArtifactRecord;

export function serverArtifactDependencies(
  artifact: ServerArtifactRecord,
): readonly string[] {
  return artifact.kind === 'route'
    ? Object.freeze([
        ...artifact.dependencies,
        ...(artifact.sharedDependencies ?? []),
      ])
    : artifact.dependencies;
}
