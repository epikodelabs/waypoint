import type { AuthorizationDomain } from './authorization-domain.js';

export interface PlannedSharedArtifact {
  readonly kind: 'shared';
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
  readonly consumers: readonly string[];
  readonly dependencies: readonly string[];
  readonly moduleIds: readonly string[];
  readonly bundle: {
    readonly format: 'esm';
    readonly platform: 'browser';
    readonly fileNameTemplate: string;
  };
}

export function createSharedArtifact(input: {
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
  readonly consumers: readonly string[];
  readonly dependencies?: readonly string[];
  readonly moduleIds: readonly string[];
}): PlannedSharedArtifact {
  return Object.freeze({
    kind: 'shared',
    artifactKey: input.artifactKey,
    authorization: input.authorization,
    consumers: Object.freeze([...input.consumers].sort()),
    dependencies: Object.freeze([...(input.dependencies ?? [])].sort()),
    moduleIds: Object.freeze([...input.moduleIds].sort()),
    bundle: Object.freeze({
      format: 'esm',
      platform: 'browser',
      fileNameTemplate: '[name]-[hash].js',
    }),
  });
}
