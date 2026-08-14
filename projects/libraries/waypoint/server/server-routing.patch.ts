/*
Apply to server-routing.ts.

1. Replace the current route-only ServerArtifactRecord with:

  export type {
    ServerArtifactRecord,
    ServerRouteArtifactRecord,
    ServerSharedArtifactRecord,
    ServerArtifactAuthorization,
  } from './server-artifact';

2. In resolveServerArtifactChain(), replace:

  for (const dependency of artifact.dependencies) visit(dependency);

with:

  for (const dependency of serverArtifactDependencies(artifact)) {
    visit(dependency);
  }

This automatically inserts route sharedDependencies into dependency-first
delivery order.

3. Replace requiredServerBranchIds():

  return new Set(
    artifacts.flatMap(artifact =>
      artifact.kind === 'route' ? artifact.branchIds : [],
    ),
  );

4. Replace isServerArtifactAuthorized() with:

  return isServerDeliveryArtifactAuthorized(artifact, branches, principal);

Shared artifacts no longer need fake routeSetId/branchIds. Route artifacts retain
the stronger branch-provenance check in addition to their normalized domain.

5. isServerArtifactChainAuthorized() remains unchanged: it already authorizes
every item in the dependency chain.
*/
