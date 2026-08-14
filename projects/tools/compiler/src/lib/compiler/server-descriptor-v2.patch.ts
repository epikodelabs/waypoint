/*
Compiler publication shape for ServerRouteIndexDocument.artifacts:

Route artifact:
{
  kind: 'route',
  artifactKey,
  routeSetId,
  slotId,
  parentRouteSetId,
  dependencies,
  sharedDependencies,
  branchIds,
  branchCount,
  authorization,
  file,
  hash,
  bytes,
  imports
}

Shared artifact:
{
  kind: 'shared',
  artifactKey,
  dependencies,
  consumers,
  authorization,
  file,
  hash,
  bytes,
  imports
}

Do not synthesize routeSetId or branchIds for shared chunks.
*/
