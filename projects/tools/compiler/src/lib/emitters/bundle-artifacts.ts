import { diagnostic } from '../compiler/diagnostics.js';
import type { PlannedCompilerOutputs, RouteCompilerDiagnostic } from '../compiler/contracts.js';
export interface BundleArtifactsResult { readonly diagnostics: readonly RouteCompilerDiagnostic[]; }
export async function bundleArtifacts(_planned: PlannedCompilerOutputs): Promise<BundleArtifactsResult> {
  return { diagnostics: [diagnostic('WPT4000', 'info', 'Artifact bundling is intentionally deferred until the ownership graph contract is stable.')] };
}