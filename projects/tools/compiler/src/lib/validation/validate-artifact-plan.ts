import type {
  ArtifactBundleResult,
  FinalizedDeliveryDocuments,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';
import { diagnostic } from '../compiler/diagnostics.js';

export interface ArtifactValidationResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export function validateArtifactPlan(plan: RouteArtifactPlan): ArtifactValidationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const artifactKeys = new Set<string>();
  const routeSetIds = new Set(plan.manifest.routeSets.map(routeSet => routeSet.id));
  const entryPaths = new Set<string>();
  const shardPaths = new Set<string>();
  const shardPrefixes = new Set<string>();

  for (const artifact of plan.artifacts) {
    if (artifactKeys.has(artifact.artifactKey)) {
      diagnostics.push(diagnostic('WPT3200', 'error', `Duplicate artifact key "${artifact.artifactKey}".`));
    }
    artifactKeys.add(artifact.artifactKey);

    if (!routeSetIds.has(artifact.routeSetId)) {
      diagnostics.push(diagnostic('WPT3201', 'error', `Artifact "${artifact.artifactKey}" references missing route set "${artifact.routeSetId}".`));
    }

    if (entryPaths.has(artifact.entry.outputPath)) {
      diagnostics.push(diagnostic('WPT3202', 'error', `Multiple artifacts emit the browser entry "${artifact.entry.outputPath}".`));
    }
    entryPaths.add(artifact.entry.outputPath);
  }

  for (const artifact of plan.artifacts) {
    for (const dependency of artifact.dependencies) {
      if (!artifactKeys.has(dependency)) {
        diagnostics.push(diagnostic('WPT3203', 'error', `Artifact "${artifact.artifactKey}" depends on missing artifact "${dependency}".`));
      }
      if (dependency === artifact.artifactKey) {
        diagnostics.push(diagnostic('WPT3204', 'error', `Artifact "${artifact.artifactKey}" cannot depend on itself.`));
      }
    }
  }

  diagnostics.push(...validateDependencyCycles(plan));

  for (const shard of plan.serverShards) {
    if (shardPaths.has(shard.outputPath)) {
      diagnostics.push(diagnostic('WPT3205', 'error', `Multiple server shards emit "${shard.outputPath}".`));
    }
    shardPaths.add(shard.outputPath);

    if (shardPrefixes.has(shard.prefix)) {
      diagnostics.push(diagnostic('WPT3206', 'error', `Duplicate server shard prefix "${shard.prefix}".`));
    }
    shardPrefixes.add(shard.prefix);
  }

  return { diagnostics: Object.freeze(diagnostics) };
}

export function validateFinalizedDelivery(
  plan: RouteArtifactPlan,
  bundle: ArtifactBundleResult,
  delivery: FinalizedDeliveryDocuments,
): ArtifactValidationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const plannedKeys = new Set(plan.artifacts.map(artifact => artifact.artifactKey));
  const bundledKeys = new Set(bundle.artifacts.map(artifact => artifact.artifactKey));

  for (const key of plannedKeys) {
    if (!bundledKeys.has(key)) {
      diagnostics.push(diagnostic('WPT3210', 'error', `Final bundle result is missing artifact "${key}".`));
    }
  }
  for (const key of bundledKeys) {
    if (!plannedKeys.has(key)) {
      diagnostics.push(diagnostic('WPT3211', 'error', `Final bundle result contains unplanned artifact "${key}".`));
    }
  }

  const serverKeys = new Set(delivery.serverIndex.artifacts.map(artifact => artifact.artifactKey));
  const manifestKeys = new Set(delivery.manifest.artifacts.map(artifact => artifact.artifactKey));
  for (const key of plannedKeys) {
    if (!serverKeys.has(key) || !manifestKeys.has(key)) {
      diagnostics.push(diagnostic('WPT3212', 'error', `Delivery documents do not consistently describe artifact "${key}".`));
    }
  }

  return { diagnostics: Object.freeze(diagnostics) };
}

function validateDependencyCycles(plan: RouteArtifactPlan): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const byKey = new Map(plan.artifacts.map(artifact => [artifact.artifactKey, artifact] as const));
  const state = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];

  const visit = (key: string): void => {
    const current = state.get(key) ?? 0;
    if (current === 2) return;
    if (current === 1) {
      const start = stack.indexOf(key);
      const cycle = [...stack.slice(start), key];
      diagnostics.push(diagnostic('WPT3207', 'error', `Artifact dependency cycle detected: ${cycle.join(' -> ')}.`));
      return;
    }

    state.set(key, 1);
    stack.push(key);
    for (const dependency of byKey.get(key)?.dependencies ?? []) {
      if (byKey.has(dependency)) visit(dependency);
    }
    stack.pop();
    state.set(key, 2);
  };

  for (const key of byKey.keys()) visit(key);
  return diagnostics;
}