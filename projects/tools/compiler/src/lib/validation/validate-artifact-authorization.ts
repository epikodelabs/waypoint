import type {
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';
import { canContainAuthorizationDomain } from '../planning/authorization-domain.js';

export function validateArtifactAuthorization(
  plan: RouteArtifactPlan,
): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const artifacts = new Map(plan.artifacts.map(artifact => [artifact.artifactKey, artifact]));

  for (const artifact of plan.artifacts) {
    for (const dependencyKey of artifact.dependencies) {
      const dependency = artifacts.get(dependencyKey);
      if (!dependency) continue;

      if (!canContainAuthorizationDomain(
        artifact.authorization,
        dependency.authorization,
      )) {
        diagnostics.push({
          code: 'WPT3202',
          level: 'error',
          message:
            `Artifact "${artifact.artifactKey}" cannot depend on "${dependencyKey}": ` +
            `the dependency would cross authorization audiences.`,
        });
      }
    }
  }

  return Object.freeze(diagnostics);
}
