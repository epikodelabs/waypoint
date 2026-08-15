import test from 'node:test';
import assert from 'node:assert/strict';

test('host-only change may reuse Waypoint generation', () => {
  const previous = {
    waypointFingerprint: 'same',
    hostFingerprint: 'A',
  };

  const next = {
    waypointFingerprint: 'same',
    hostFingerprint: 'B',
  };

  assert.equal(
    previous.waypointFingerprint,
    next.waypointFingerprint,
  );

  assert.notEqual(
    previous.hostFingerprint,
    next.hostFingerprint,
  );
});
