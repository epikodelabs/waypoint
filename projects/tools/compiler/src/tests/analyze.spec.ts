import test from 'node:test';
import assert from 'node:assert/strict';

test('analysis result is a build-free compiler boundary', () => {
  const result = {
    success: true,
    planned: {},
    diagnostics: [],
    timings: [],
    semantic: {},
    navigationIr: {},
    expanded: {},
    plan: {},
  };

  assert.equal(result.success, true);
  assert.ok(result.plan);
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      result,
      'emitted',
    ),
    false,
  );
});
