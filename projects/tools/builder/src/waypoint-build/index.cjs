const { createBuilder } = require('@angular-devkit/architect');
module.exports = createBuilder(async (options, context) => {
  const runtime = await import('./index-runtime.mjs');
  return runtime.execute(options, context);
});
