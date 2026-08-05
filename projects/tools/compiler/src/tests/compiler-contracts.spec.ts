import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ARTIFACT_PLAN_VERSION,
  COMPILER_CONTRACT_VERSION,
  ROUTE_ARTIFACT_MANIFEST_VERSION,
  SERVER_ROUTE_INDEX_VERSION,
  SERVER_ROUTE_SHARD_VERSION,
} from '../lib/compiler/contracts.js';

test('compiler delivery contracts are explicitly versioned', () => {
  assert.equal(COMPILER_CONTRACT_VERSION, 1);
  assert.equal(ARTIFACT_PLAN_VERSION, 1);
  assert.equal(SERVER_ROUTE_INDEX_VERSION, 1);
  assert.equal(SERVER_ROUTE_SHARD_VERSION, 1);
  assert.equal(ROUTE_ARTIFACT_MANIFEST_VERSION, 1);
});
