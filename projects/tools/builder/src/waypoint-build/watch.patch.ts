/*
Use createWaypointWatchSessionV2().

After each successful Angular host rebuild:

const generation =
  await session.nextGeneration();

if (generation.reused) {
  context.logger.info(
    `Waypoint generation ${generation.number}: navigation/protected graph unchanged; reused previous build.`,
  );
}

const published =
  await generation.publish();

yield published;

A host-only edit now produces:

  Angular incremental rebuild
  Waypoint fingerprint hit
  no analyze/AOT/protected rebundle
  no runtime metadata republish

A route/component/policy edit in Waypoint's tracked dependency graph produces:

  fingerprint miss
  analyze
  prepare/AOT
  validate
  publish new generation
*/
