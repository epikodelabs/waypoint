/*
Keep generated artifact entries inside the AOT temp root:

  const entriesRoot = path.join(outputRoot, '.waypoint-entries');

but stop deriving outputRoot from planned.entriesOutput.

Use:
  const outputRoot = await createWaypointTempRoot('aot');

PreparedArtifactSources.dispose() removes the entire outputRoot, including all
generated entry modules.
*/