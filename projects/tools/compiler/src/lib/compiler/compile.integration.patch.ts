/*
After plan validation:

const sources = await prepareArtifactSources(
  planned,
  artifactPlan,
);

const transaction = await createBuildTransaction(
  planned,
  artifactPlan,
  sources,
);

try {
  const result = await transaction.publish();

  diagnostics.push(...result.diagnostics);
  emitted.push(...result.emitted);
  bundles = result.bundles;
  delivery = result.delivery;

  if (!result.success) {
    return finish(false);
  }
} finally {
  await transaction.dispose();
}

Delete from compile.ts:
- direct snapshotDirectory ownership
- emitBrowserEntries call
- direct bundleArtifacts call
- finalizeDeliveryDocuments call
- validateFinalizedDelivery call
- emitServerArtifacts call
- restoreSnapshots/discardSnapshots helpers

compile() remains responsible for:
resolve -> evaluate -> IR -> validate -> expand -> plan -> validate plan

The transaction owns everything after that.
*/
