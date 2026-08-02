import type {
  PlannedCompilerOutputs,
  RouteCompilerDiagnostic,
} from './types.js';

export interface BundleArtifactsResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export async function bundleArtifacts(
  _planned: PlannedCompilerOutputs,
): Promise<BundleArtifactsResult> {
  return {
    diagnostics: [
      {
        level: 'info',
        message:
          'Artifact bundling is scaffolded but not implemented yet.',
      },
    ],
  };
}
