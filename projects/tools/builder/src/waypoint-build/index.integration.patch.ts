/*
Builder now starts with the same compiler analysis:

const analysis = await analyze({
  entry,
  serverOutput: layout.serverRoot,
  artifactsOutput: layout.protectedRoot,
  buildManifestOutput: layout.buildManifest,
  routesExport: options.routesExport,
  profile: options.profile,
});

report(analysis.diagnostics, context);

if (!analysis.success || !analysis.plan) {
  return {
    success: false,
    error: 'Waypoint analysis failed.',
  };
}

const pipeline = await prepareBuildPipeline(
  analysis.planned,
  analysis.plan,
);

try {
  // builder-specific host phase
  const hostRuntime = await emitHostRuntimeEntry(
    ...,
    pipeline.session.sources.hostRuntimeModules,
  );

  const hostEntry = planHostEntry(
    analysis.plan,
    ...,
  );

  const angular = await runAngularHost(...);

  if (!angular.success) {
    await pipeline.publication.rollback();
    return angular;
  }

  const published = await pipeline.publish();
  ...
} finally {
  await pipeline.dispose();
}

Builder and CLI/compiler now share the same:
  analyze()
  prepareBuildPipeline()

Their only difference is that the builder inserts the Angular host build between
preparation and publication.
*/
