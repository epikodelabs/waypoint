/*
Replace the v1 one-artifact loop with authorization-domain builds:

  const groups = groupArtifactsByAuthorization(plan.artifacts);
  for (const group of groups) {
    const entries = await Promise.all(group.artifacts.map(async artifact => ({
      artifact,
      entryPoint: await compiledSources.entryFor(artifact),
    })));

    const built = await bundleArtifactDomain(
      group.authorization,
      entries,
      planned.artifactsOutput,
      hostExports,
    );

    const linkedRoutes = linkPhysicalSharedArtifacts(
      built.routeArtifacts,
      built.sharedArtifacts,
    );

    // Add linkedRoutes + built.sharedArtifacts to ArtifactBundleResult.
    // Add every built.outputFile to the existing atomic staging publication.
  }

Delete buildArtifact(); the one-build-per-route implementation is obsolete.

Security invariant: only identical authorization domains share one esbuild graph.
Cross-domain sharing is therefore impossible regardless of esbuild optimization.
*/
