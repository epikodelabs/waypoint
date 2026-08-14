/*
The compiler pipeline should own exactly one PreparedArtifactSources generation.

Pseudo-structure around the existing emit/bundle/finalize stages:

let preparedSources: PreparedArtifactSources | undefined;

try {
  ...

  preparedSources = await prepareArtifactSources(planned, artifactPlan);

  // Existing emit-browser-entries/server planning can remain where appropriate.

  const bundleResult = await bundleArtifacts(
    planned,
    artifactPlan,
    preparedSources,
  );

  ...
} finally {
  await preparedSources?.dispose();
}

For the standalone compiler CLI/API this gives one AOT invocation.

For the Angular builder, expose a lower-level transaction API described below so
the same PreparedArtifactSources can survive across the host Angular build.
*/
