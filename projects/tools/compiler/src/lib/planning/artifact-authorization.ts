import type { RouteArtifactPlan } from '../compiler/contracts.js';
import {
  normalizeAuthorizationDomain,
  type AuthorizationDomain,
} from './authorization-domain.js';

export interface ArtifactAuthorization {
  readonly artifactKey: string;
  readonly domain: AuthorizationDomain;
}

/**
 * Derives authorization from the route-set policy already resolved by the
 * semantic/IR pipeline. This function should be called while constructing the
 * Artifact Plan so downstream bundlers never need Navigation IR.
 */
export function deriveArtifactAuthorization(
  artifactKey: string,
  policy: {
    readonly allowAnonymous?: boolean;
    readonly roles?: readonly string[];
    readonly permissions?: readonly string[];
  } | undefined,
): ArtifactAuthorization {
  return Object.freeze({
    artifactKey,
    domain: normalizeAuthorizationDomain(policy),
  });
}

/**
 * Transitional accessor until `authorization` is added directly to the
 * PlannedRouteArtifact contract.
 */
export function authorizationFor(
  plan: RouteArtifactPlan & {
    readonly authorization?: readonly ArtifactAuthorization[];
  },
  artifactKey: string,
): AuthorizationDomain | undefined {
  return plan.authorization?.find(item => item.artifactKey === artifactKey)?.domain;
}
