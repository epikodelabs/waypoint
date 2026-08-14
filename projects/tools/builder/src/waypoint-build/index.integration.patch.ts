/*
After plan() and host-only app.routes.ts generation, but BEFORE scheduling Angular:

const prepared = await prepareProtectedBuild(
  plannedCompilerOptions,
  planned.plan,
  layout.metadataRoot,
);

try {
  const replacements = ...host-route replacement...;

  const overrides = withWaypointRuntimePolyfill(
    {
      ...baseOptions,
      fileReplacements: replacements,
    },
    prepared.hostRuntimeEntry,
  );

  const scheduled = await context.scheduleTarget(target, overrides);
  ...
} finally {
  await prepared.dispose();
}

The important property is ordering:

  plan
    -> AOT protected source preparation
    -> discover identity-sensitive package imports
    -> generate host runtime registrar
    -> Angular host build (registrar injected automatically)
    -> protected bundling

Application code never imports or registers host module namespaces.
*/
