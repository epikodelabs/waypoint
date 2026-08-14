// Artifact Plan v2 should use a discriminated artifact union:
//
// export type PlannedArtifact = PlannedRouteArtifact | PlannedSharedArtifact;
//
// export interface PlannedRouteArtifact {
//   readonly kind: 'route';
//   ...
//   readonly authorization: AuthorizationDomain;
//   readonly sharedDependencies: readonly string[];
// }
//
// export interface RouteArtifactPlan {
//   readonly version: 2;
//   readonly artifacts: readonly PlannedArtifact[];
//   ...
// }
//
// Route artifacts keep their routeSetId/browserEntry/server descriptor fields.
// Shared artifacts deliberately do not pretend to be route sets.
