/*
In createServerNavigationResolution(), include the artifact kind in the wire
descriptor:

return Object.freeze({
  kind: artifact.kind,
  artifactKey: artifact.artifactKey,
  moduleUrl,
  hash: artifact.hash,
});

This is the only new server->browser metadata exposed. Authorization, policies,
route-set ownership, consumers and dependency graphs remain server-private.
*/
