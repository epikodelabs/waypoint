/*
The Angular builder should now use exactly the same transaction.

const sources = await prepareArtifactSources(
  compilerOutputs,
  artifactPlan,
);

const transaction = await createBuildTransaction(
  compilerOutputs,
  artifactPlan,
  sources,
);

try {
  // Before publish(), use transaction.sources for host integration.
  const hostRuntime = await emitHostRuntimeEntry(
    ...,
    transaction.sources.hostRuntimeModules,
  );

  const hostEntry = await emitHostEntry(...);

  const angular = await scheduleAngularHost({
    hostEntry,
    hostRuntime,
  });

  if (!angular.success) {
    await transaction.rollback();
    return angular;
  }

  const result = await transaction.publish();
  report(result.diagnostics);

  return result.success
    ? { success: true }
    : { success: false, error: 'Waypoint publication failed.' };
} finally {
  await transaction.dispose();
}

Now the builder never calls monolithic compile().

Ownership is explicit:

builder
  owns WaypointBuildTransaction
    owns PreparedArtifactSources
    owns snapshots
    owns publication lifetime
*/
