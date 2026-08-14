// Inside planRouteArtifacts(), immediately before artifacts.push(...):
//
// const authorization = deriveRouteSetAuthorization(routeSet, model);
// diagnostics.push(...authorization.diagnostics);
//
// Then add:
//
// authorization: authorization.domain,
//
// to PlannedRouteArtifact.
//
// Propagate the same field into:
//   - serverArtifacts
//   - manifest.artifacts
//
// From this point onward authorization is part of Artifact Plan v2 and
// bundlers/publishers must not re-read ExpandedNavigationModel policies.
