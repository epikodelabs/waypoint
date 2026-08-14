/*
Change bundleArtifacts() to consume already-prepared AOT sources.

BEFORE:

export async function bundleArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<ArtifactBundleResult> {
  ...
  let compiledSources: Awaited<ReturnType<typeof compileArtifactSources>> | undefined;

  try {
    compiledSources = await compileArtifactSources(planned, plan);
    ...
  } finally {
    await compiledSources?.dispose();
  }
}

AFTER:

export async function bundleArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  preparedSources: PreparedArtifactSources,
): Promise<ArtifactBundleResult> {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const prepared: PreparedBundle[] = [];

  try {
    const hostExports = await collectHostModuleExports(
      preparedSources.outputRoot,
      createHostModulePredicate(),
    );

    // authorization-domain grouping from the previous phase
    const groups = groupArtifactsByAuthorization(
      plan.artifacts.filter(isRouteArtifact),
    );

    for (const group of groups) {
      const entries = await Promise.all(
        group.artifacts.map(async artifact => ({
          artifact,
          entryPoint: await preparedSources.entryFor(artifact),
        })),
      );

      ...
    }
  } catch (error) {
    ...
  }

  // DO NOT dispose preparedSources here.
  // Ownership belongs to the caller/build transaction.
}

Delete the direct compileArtifactSources import from bundle-artifacts.ts.

This makes bundling a pure consumer of one prepared AOT generation.
*/
