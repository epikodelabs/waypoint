/*
After Artifact Plan validation:

const pipeline = await prepareBuildPipeline(
  planned,
  artifactPlan,
);

try {
  const result = await pipeline.publish();
  diagnostics.push(...result.diagnostics);
  emitted.push(...result.emitted);

  if (!result.success) {
    return finish(false);
  }
} finally {
  await pipeline.dispose();
}

compile() no longer owns:
- PreparedArtifactSources directly
- output snapshots
- publication commit/rollback
- build-manifest emission

Its job is orchestration only.
*/
