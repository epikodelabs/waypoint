import type { AuthorizationDomain } from '../planning/authorization-domain.js';

export interface BundledRouteArtifactV2 {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly outputPath: string;
  readonly fileName: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs: readonly string[];
  readonly sharedDependencies: readonly string[];
}

export interface BundledSharedArtifactV2 {
  readonly kind: 'shared';
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
  readonly consumers: readonly string[];
  readonly outputPath: string;
  readonly fileName: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs: readonly string[];
}

export type BundledArtifactV2 = BundledRouteArtifactV2 | BundledSharedArtifactV2;
