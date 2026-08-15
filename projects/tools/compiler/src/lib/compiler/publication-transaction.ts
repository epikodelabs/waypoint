import type {
  ArtifactBundleResult,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
} from './contracts.js';
import {
  emitServerArtifacts,
} from '../emitters/emit-server-artifacts.js';

export interface RuntimePublicationResult {
  readonly success: boolean;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

/**
 * Runtime publication owns only deployment state:
 *   - server index
 *   - server shards
 *   - protected artifacts are already atomically published by bundling
 *
 * Build/debug manifest publication is intentionally outside this transaction.
 */
export async function publishRuntimeDelivery(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  serverIndex: ServerRouteIndexDocument,
): Promise<RuntimePublicationResult> {
  const result = await emitServerArtifacts(
    planned,
    plan,
    {
      serverIndex,
      manifest: plan.manifest, // remove once emitter is split physically
    },
  );

  return Object.freeze({
    success: !result.diagnostics.some(item => item.level === 'error'),
    diagnostics: result.diagnostics,
    emitted: result.emitted,
  });
}
