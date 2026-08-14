import path from 'node:path';

import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
} from './contracts.js';
import { compileArtifactSources } from '../emitters/compile-artifact-sources.js';
import { discoverHostRuntimeModules } from '../emitters/discover-host-runtime-modules.js';
import { emitHostRuntimeEntry } from '../emitters/emit-host-runtime-entry.js';

export interface PreparedProtectedBuild {
  readonly hostRuntimeEntry: string;
  readonly hostRuntimeModules: readonly string[];
  dispose(): Promise<void>;
}

/**
 * Performs the AOT source-preparation stage early enough for the Angular
 * builder to generate and inject the host runtime registrar before host build.
 */
export async function prepareProtectedBuild(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  metadataRoot: string,
): Promise<PreparedProtectedBuild> {
  const compiled = await compileArtifactSources(planned, plan);

  try {
    const modules = await discoverHostRuntimeModules(compiled.outputRoot);
    const runtime = await emitHostRuntimeEntry(
      path.join(metadataRoot, 'host', 'waypoint-runtime.ts'),
      modules,
    );

    return Object.freeze({
      hostRuntimeEntry: runtime.outputPath,
      hostRuntimeModules: runtime.modules,
      dispose: () => compiled.dispose(),
    });
  } catch (error) {
    await compiled.dispose();
    throw error;
  }
}
