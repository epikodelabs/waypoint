// Apply to PlannedRouteArtifact in contracts.ts:
//
// import type { AuthorizationDomain } from '../planning/authorization-domain.js';
//
// export interface PlannedRouteArtifact {
//   ...
//   readonly authorization: AuthorizationDomain;
// }
//
// Also add `authorization: AuthorizationDomain` to the corresponding
// RouteArtifactManifestDocument artifact descriptor and ServerArtifactDescriptor.
// Bump ARTIFACT_PLAN_VERSION from 1 to 2.
