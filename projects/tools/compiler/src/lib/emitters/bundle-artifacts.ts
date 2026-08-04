import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

export interface BundleArtifactsResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export async function bundleArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<BundleArtifactsResult> {
  return {
    diagnostics: [diagnostic(
      'WPT4000',
      'info',
      `Artifact Plan v${plan.version} contains ${plan.artifacts.length} isolated browser artifact(s) for ${planned.artifactsOutput}; bundling is the next phase.`,
    )],
    emitted: [],
  };
}
