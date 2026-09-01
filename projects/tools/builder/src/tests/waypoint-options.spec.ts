import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveWaypointOptions,
} from '../waypoint-build/options.js';

test('Waypoint build configuration is optional', () => {
  const resolved = resolveWaypointOptions(
    'projects/apps/app2/client',
    undefined,
  );

  assert.equal(
    resolved.entry,
    'projects/apps/app2/client/src/app/app.routes.ts',
  );
  assert.equal(
    resolved.routesExport,
    'routes',
  );
  assert.equal(
    resolved.profile,
    false,
  );
  assert.equal(
    resolved.buildManifest,
    true,
  );
});

test('explicit Waypoint options override only named defaults', () => {
  const resolved = resolveWaypointOptions(
    'projects/apps/app2/client',
    {
      entry: 'src/navigation.ts',
      profile: true,
    },
  );

  assert.equal(
    resolved.entry,
    'projects/apps/app2/client/src/navigation.ts',
  );
  assert.equal(
    resolved.routesExport,
    'routes',
  );
  assert.equal(
    resolved.profile,
    true,
  );
});