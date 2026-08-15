import test from 'node:test';
import assert from 'node:assert/strict';

test('prepared build exposes host integration without leaking ownership internals', () => {
  const build = {
    analysis: {},
    host: {
      routesEntry: '/tmp/host/app.routes.ts',
      runtimeEntry: '/tmp/host/waypoint-runtime.ts',
    },
    publish() {},
    rollback() {},
    dispose() {},
  };

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      build,
      'session',
    ),
    false,
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      build,
      'publication',
    ),
    false,
  );

  assert.equal(
    build.host.routesEntry,
    '/tmp/host/app.routes.ts',
  );
});
