/*
compile() can now use the same façade:

const analysis = await analyze(options);

if (!analysis.success || !analysis.plan) {
  return resultFromAnalysis(analysis);
}

const build = await prepareBuild(
  analysis,
  {
    metadataRoot: defaultMetadataRoot(
      analysis.planned,
    ),
  },
);

try {
  // CLI/compiler has no Angular host phase.
  const result = await build.publish();
  ...
} finally {
  await build.dispose();
}

For CLI mode, build.host may simply remain unused.

That means compile() and the Angular builder now share:

  analyze()
  prepareBuild()

instead of sharing implementation details.
*/
