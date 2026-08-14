import type { PlannedSharedArtifact } from './shared-artifact.js';

export interface ShareableRouteArtifact {
  readonly artifactKey: string;
  readonly sharedDependencies: readonly string[];
}

export function linkSharedArtifacts<T extends ShareableRouteArtifact>(
  routeArtifacts: readonly T[],
  sharedArtifacts: readonly PlannedSharedArtifact[],
): readonly T[] {
  const byConsumer = new Map<string, string[]>();

  for (const shared of sharedArtifacts) {
    for (const consumer of shared.consumers) {
      const dependencies = byConsumer.get(consumer) ?? [];
      dependencies.push(shared.artifactKey);
      byConsumer.set(consumer, dependencies);
    }
  }

  return Object.freeze(routeArtifacts.map(artifact => Object.freeze({
    ...artifact,
    sharedDependencies: Object.freeze([
      ...artifact.sharedDependencies,
      ...(byConsumer.get(artifact.artifactKey) ?? []),
    ].sort()),
  })));
}
