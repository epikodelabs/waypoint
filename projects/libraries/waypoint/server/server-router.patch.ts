/*
Apply to server-router.ts.

In resolveNavigationChain(), route lookup currently does:

  const artifacts = snapshot.index.artifacts.filter(
    candidate => candidate.routeSetId === branch.routeSetId,
  );

Change it to:

  const artifacts = snapshot.index.artifacts.filter(
    candidate =>
      candidate.kind === 'route'
      && candidate.routeSetId === branch.routeSetId,
  );

Everything after that can remain unchanged.

authorizedChain() already:
  - resolves the complete dependency chain,
  - loads branch provenance for that chain,
  - authorizes every artifact.

Because shared artifacts contribute no branch IDs and authorize from their own
authorization domain, the existing flow becomes valid for both artifact kinds.

resolveModule() also remains unchanged: direct shared-chunk requests still call
resolveArtifact(), so a principal cannot bypass authorization by guessing a
shared artifact key/hash.
*/
