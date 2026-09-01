import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WaypointWatchCache,
} from '../watch/watch-cache.js';

test('watch cache reuses only exact dependency fingerprint', () => {
  const cache =
    new WaypointWatchCache();

  const value = {
    fingerprint: 'A',
    analysis: {} as any,
    build: {} as any,
  };

  cache.replace(value);

  assert.equal(
    cache.get('A'),
    value,
  );

  assert.equal(
    cache.get('B'),
    undefined,
  );
});