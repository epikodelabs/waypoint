/*
The AOT temp root must be independent of any published entries path.

Use:
  const outputRoot = await createWaypointTempRoot('aot');

Generated entry files stay under:
  <outputRoot>/.waypoint-entries/

and disappear with:
  PreparedArtifactSources.dispose()
*/
