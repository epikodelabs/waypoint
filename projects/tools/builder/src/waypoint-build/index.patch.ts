/*
Replace ad-hoc waypoint option reads with:

const waypoint = resolveWaypointOptions(
  projectRoot,
  options.waypoint,
);

const analysis = await analyze({
  entry: path.resolve(
    workspaceRoot,
    waypoint.entry,
  ),
  serverOutput: layout.serverRoot,
  artifactsOutput: layout.protectedRoot,
  buildManifestOutput:
    waypoint.buildManifest
      ? layout.buildManifest
      : undefined,
  routesExport: waypoint.routesExport,
  profile: waypoint.profile,
});

This makes the entire `waypoint` object optional.
*/
