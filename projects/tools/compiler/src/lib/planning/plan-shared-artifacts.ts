import type { AuthorizationDomain } from './authorization-domain.js';
import { decideSharedChunk, type DependencyUsage } from '../bundler/shared-chunk-policy.js';
import { createSharedArtifact, type PlannedSharedArtifact } from './shared-artifact.js';

export interface SharedArtifactPlanResult {
  readonly artifacts: readonly PlannedSharedArtifact[];
  readonly duplicatedModules: readonly string[];
}

/**
 * Converts module-consumer analysis into explicit delivery artifacts.
 * Modules that cannot be shared safely are left for per-route-artifact bundling.
 */
export function planSharedArtifacts(
  usages: readonly DependencyUsage[],
): SharedArtifactPlanResult {
  const groups = new Map<string, {
    authorization: AuthorizationDomain;
    consumers: Set<string>;
    moduleIds: Set<string>;
  }>();
  const duplicatedModules = new Set<string>();

  for (const usage of usages) {
    const decision = decideSharedChunk(usage);
    if (decision.mode === 'duplicate' || !decision.sharedKey || !decision.authorization) {
      duplicatedModules.add(usage.moduleId);
      continue;
    }

    let group = groups.get(decision.sharedKey);
    if (!group) {
      group = {
        authorization: decision.authorization,
        consumers: new Set(),
        moduleIds: new Set(),
      };
      groups.set(decision.sharedKey, group);
    }
    group.moduleIds.add(usage.moduleId);
    for (const consumer of usage.consumers) group.consumers.add(consumer.artifactKey);
  }

  const artifacts = [...groups.entries()]
    .map(([artifactKey, group]) => createSharedArtifact({
      artifactKey,
      authorization: group.authorization,
      consumers: [...group.consumers],
      moduleIds: [...group.moduleIds],
    }))
    .sort((a, b) => a.artifactKey.localeCompare(b.artifactKey));

  return Object.freeze({
    artifacts: Object.freeze(artifacts),
    duplicatedModules: Object.freeze([...duplicatedModules].sort()),
  });
}
