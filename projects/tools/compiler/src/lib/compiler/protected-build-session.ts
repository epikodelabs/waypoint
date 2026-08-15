import type {
  ArtifactBundleResult,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
} from './contracts.js';
import type {
  PreparedArtifactSources,
} from './prepared-artifact-sources.js';
import {
  prepareArtifactSources,
} from '../emitters/prepare-artifact-sources.js';
import {
  bundleArtifacts,
} from '../emitters/bundle-artifacts.js';

export interface ProtectedBuildSession {
  readonly planned: PlannedCompilerOutputs;
  readonly plan: RouteArtifactPlan;
  readonly sources: PreparedArtifactSources;
  bundle(): Promise<ArtifactBundleResult>;
  dispose(): Promise<void>;
}

/**
 * Long-lived build transaction used by the Angular builder.
 *
 * The session owns exactly one AOT generation and keeps it alive while the
 * builder creates the host runtime registrar and runs the Angular host build.
 */
export async function createProtectedBuildSession(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<ProtectedBuildSession> {
  const sources = await prepareArtifactSources(planned, plan);
  let disposed = false;

  return Object.freeze({
    planned,
    plan,
    sources,

    bundle(): Promise<ArtifactBundleResult> {
      if (disposed) {
        throw new Error('Waypoint protected build session is already disposed.');
      }
      return bundleArtifacts(planned, plan);
    },

    async dispose(): Promise<void> {
      if (disposed) return;
      disposed = true;
      await sources.dispose();
    },
  });
}
