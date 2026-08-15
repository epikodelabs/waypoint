import {
  compileArtifactSources,
} from './compile-artifact-sources.js';
import {
  discoverHostRuntimeModules,
} from './discover-host-runtime-modules.js';
import type {
  PlannedRouteArtifact,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
} from '../compiler/contracts.js';
import type {
  PreparedArtifactSources,
} from '../compiler/prepared-artifact-sources.js';

/**
 * Single protected-source preparation phase.
 *
 * Angular AOT runs exactly once. The resulting generation is then reused for:
 *   - host runtime identity discovery;
 *   - route entry creation;
 *   - authorization-domain bundling.
 */
export async function prepareArtifactSources(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<PreparedArtifactSources> {
  const compiled = await compileArtifactSources(planned, plan);

  try {
    const hostRuntimeModules =
      await discoverHostRuntimeModules(compiled.outputRoot);

    return Object.freeze({
      outputRoot: compiled.outputRoot,
      hostRuntimeModules,
      entryFor: (artifact: PlannedRouteArtifact) => compiled.entryFor(artifact),
      dispose: () => compiled.dispose(),
    });
  } catch (error) {
    await compiled.dispose();
    throw error;
  }
}
