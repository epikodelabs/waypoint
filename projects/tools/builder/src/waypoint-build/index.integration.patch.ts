/*
The Angular builder gets an important benefit from the split:

const pipeline = await prepareBuildPipeline(
  planned,
  artifactPlan,
);

try {
  // BuildSession resources remain alive here.
  const runtimeEntry = await emitHostRuntimeEntry(
    ...,
    pipeline.session.sources.hostRuntimeModules,
  );

  const hostResult = await runAngularHost(...);

  if (!hostResult.success) {
    await pipeline.publication.rollback();
    return hostResult;
  }

  const waypoint = await pipeline.publish();
  ...
} finally {
  await pipeline.dispose();
}

The host build needs BuildSession, but it does not need PublicationTransaction
internals.

This is the ownership split:
  BuildSession            -> temporary/compiler lifetime
  PublicationTransaction  -> deployment mutation lifetime
*/
