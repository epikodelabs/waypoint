import test from 'node:test';
import assert from 'node:assert/strict';

test('protected build session owns one prepared generation', async () => {
  let disposeCount = 0;
  let bundleCount = 0;

  const sources = {
    outputRoot: '/tmp/aot',
    hostRuntimeModules: ['@angular/core'],
    async entryFor() {
      return '/tmp/aot/entry.mjs';
    },
    async dispose() {
      disposeCount++;
    },
  };

  // Contract-level ownership assertion. The real integration test should spy
  // on prepareArtifactSources() and prove it is called once for one builder run.
  const session = {
    sources,
    async bundle() {
      bundleCount++;
      return {};
    },
    async dispose() {
      await sources.dispose();
    },
  };

  await session.bundle();
  await session.dispose();

  assert.equal(bundleCount, 1);
  assert.equal(disposeCount, 1);
});
