import type {
  BundledArtifact,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';
import {
  canContainAuthorizationDomain,
  type AuthorizationDomain,
} from '../planning/authorization-domain.js';

export interface AuthorizationAwarePlan extends RouteArtifactPlan {
  readonly authorization: readonly {
    readonly artifactKey: string;
    readonly domain: AuthorizationDomain;
  }[];
}

/**
 * Validates that dependency/hoisting direction never moves code into a domain
 * visible to principals who were not authorized for the code's owning domain.
 */
export function validateAuthorizationIsolation(
  plan: AuthorizationAwarePlan,
  bundles: readonly BundledArtifact[],
): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const domains = new Map(
    plan.authorization.map(item => [item.artifactKey, item.domain]),
  );
  const bundleByKey = new Map(bundles.map(bundle => [bundle.artifactKey, bundle]));

  for (const artifact of plan.artifacts) {
    const consumerDomain = domains.get(artifact.artifactKey);
    if (!consumerDomain) {
      diagnostics.push(missingDomain(artifact.artifactKey));
      continue;
    }

    for (const dependencyKey of artifact.dependencies) {
      const dependencyDomain = domains.get(dependencyKey);
      if (!dependencyDomain) {
        diagnostics.push(missingDomain(dependencyKey));
        continue;
      }

      // Dependency code may be shared with the consumer only when the
      // consumer's authorization domain is at least as restrictive.
      if (!canContainAuthorizationDomain(consumerDomain, dependencyDomain)) {
        diagnostics.push({
          code: 'WPT4202',
          level: 'error',
          message:
            `Artifact "${artifact.artifactKey}" cannot consume or contain code from ` +
            `"${dependencyKey}" because their authorization domains are incompatible.`,
        });
      }
    }

    if (!bundleByKey.has(artifact.artifactKey)) {
      diagnostics.push({
        code: 'WPT4203',
        level: 'error',
        message: `No physical bundle was emitted for protected artifact "${artifact.artifactKey}".`,
      });
    }
  }

  return Object.freeze(diagnostics);
}

function missingDomain(artifactKey: string): RouteCompilerDiagnostic {
  return {
    code: 'WPT4201',
    level: 'error',
    message: `Protected artifact "${artifactKey}" has no authorization domain.`,
  };
}
