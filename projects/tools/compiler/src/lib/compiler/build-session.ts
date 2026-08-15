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

export interface BuildSession {
  readonly planned: PlannedCompilerOutputs;
  readonly plan: RouteArtifactPlan;
  readonly sources: PreparedArtifactSources;

  bundle(): Promise<ArtifactBundleResult>;
  dispose(): Promise<void>;
}

/**
 * Owns temporary/compiler resources only.
 *
 * It does not snapshot, publish, commit, or roll back deployment output.
 */
export async function createBuildSession(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<BuildSession> {
  const sources = await prepareArtifactSources(planned, plan);
  let disposed = false;
  let bundled: Promise<ArtifactBundleResult> | undefined;

  return Object.freeze({
    planned,
    plan,
    sources,

    bundle(): Promise<ArtifactBundleResult> {
      if (disposed) {
        throw new Error('Waypoint build session is already disposed.');
      }

      bundled ??= bundleArtifacts(
        planned,
        plan,
        sources,
      );

      return bundled;
    },

    async dispose(): Promise<void> {
      if (disposed) return;
      disposed = true;
      await sources.dispose();
    },
  });
}
