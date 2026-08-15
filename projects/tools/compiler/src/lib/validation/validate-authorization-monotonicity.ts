import type {
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

import {
  canContainAuthorizationDomain,
} from '../planning/authorization-domain.js';

/**
 * Enforces monotonic authorization along hierarchical routesFor() ownership.
 *
 * A child artifact may:
 *   - keep the same audience;
 *   - narrow the audience.
 *
 * It may not broaden the audience relative to its owning parent artifact.
 */
export function validateAuthorizationMonotonicity(
  plan: RouteArtifactPlan,
): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const artifacts = new Map(
    plan.artifacts
      .filter(artifact => artifact.kind === 'route')
      .map(artifact => [artifact.routeSetId, artifact] as const),
  );

  for (const artifact of artifacts.values()) {
    if (!artifact.parentRouteSetId) {
      continue;
    }

    const parent = artifacts.get(
      artifact.parentRouteSetId,
    );

    if (!parent) {
      diagnostics.push({
        code: 'WPT3210',
        level: 'error',
        message:
          `Route artifact "${artifact.artifactKey}" references missing parent route set ` +
          `"${artifact.parentRouteSetId}".`,
      });

      continue;
    }

    /*
     * canContainAuthorizationDomain(child, parent)
     *
     * means: every principal allowed to receive the child is also valid for
     * the parent's code audience. In other words, child <= parent by audience.
     */
    if (
      !canContainAuthorizationDomain(
        artifact.authorization,
        parent.authorization,
      )
    ) {
      diagnostics.push({
        code: 'WPT3211',
        level: 'error',
        message:
          `Authorization becomes weaker from route set "${parent.routeSetId}" ` +
          `to nested route set "${artifact.routeSetId}". Nested ownership may ` +
          `preserve or narrow authorization, but must not broaden it.`,
      });
    }
  }

  return Object.freeze(diagnostics);
}
