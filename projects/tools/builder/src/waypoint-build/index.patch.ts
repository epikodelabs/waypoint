/*
After protected bundle generation, before runtime publication:

const usages =
  await collectAngularDeclarationModuleUsages(
    analysis.plan,
    bundleResult,
  );

const declarationDiagnostics =
  validateAngularDeclarationIsolation(
    usages,
  );

reportDiagnostics(
  declarationDiagnostics,
  context,
);

if (
  declarationDiagnostics.some(
    diagnostic =>
      diagnostic.level === 'error',
  )
) {
  await build.rollback();

  return {
    success: false,
    error:
      'Angular declaration isolation validation failed.',
  };
}

This must happen before publication.
*/
