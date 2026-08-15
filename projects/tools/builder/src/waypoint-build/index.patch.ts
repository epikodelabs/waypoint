/*
Branch on Angular's ordinary `watch` option.

Pseudo-shape:

const delegated = await context.scheduleBuilder(
  '@angular/build:application',
  delegatedOptions,
  { target: context.target },
);

if (angularOptions['watch'] === true) {
  return runWaypointWatch({
    delegatedRun: delegated,
    context,
    analysisOptions: {
      entry,
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput:
        waypoint.buildManifest === false
          ? undefined
          : layout.buildManifest,
      profile: waypoint.profile,
    },
    metadataRoot: layout.metadataRoot,
    reportDiagnostics,
  });
}

try {
  const angularResult = await delegated.result;
  ...
} finally {
  await delegated.stop();
}

IMPORTANT:
For a real Architect watch builder, execute() should return an Observable or
AsyncIterable-compatible builder stream rather than collapsing the watch stream
to `delegated.result`.
*/
