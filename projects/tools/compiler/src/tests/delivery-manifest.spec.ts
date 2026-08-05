import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { finalizeDeliveryDocuments } from '../lib/planning/finalize-delivery.js';
import type { ArtifactBundleResult, RouteArtifactPlan } from '../lib/compiler/contracts.js';

const plan: RouteArtifactPlan = {
  version: 1,
  generatedAt: '2026-08-05T00:00:00.000Z',
  entry: '/app/routes.ts',
  artifacts: [],
  browserEntries: [],
  serverShards: [],
  serverIndex: {
    version: 1,
    artifactPlanVersion: 1,
    entry: '/app/routes.ts',
    generatedAt: '2026-08-05T00:00:00.000Z',
    shards: [],
    artifacts: [{
      artifactKey: 'workspace-set',
      routeSetId: 'workspace-set',
      slotId: 'workspace',
      dependencies: [],
      branchCount: 1,
    }],
    slots: [],
    routeSets: [],
  },
  manifest: {
    version: 1,
    artifactPlanVersion: 1,
    generatedAt: '2026-08-05T00:00:00.000Z',
    slots: [],
    routeSets: [],
    artifacts: [{
      artifactKey: 'workspace-set',
      routeSetId: 'workspace-set',
      slotId: 'workspace',
      dependencies: [],
      entryFile: 'entries/workspace.ts',
      bundleDirectory: 'artifacts',
      fileNameTemplate: 'workspace-set-[hash].js',
      branchIds: ['workspace-home'],
    }],
    routes: [],
  },
};

const bundleResult: ArtifactBundleResult = {
  artifacts: [{
    artifactKey: 'workspace-set',
    routeSetId: 'workspace-set',
    outputPath: '/dist/artifacts/workspace-set-ABC123.js',
    fileName: 'workspace-set-ABC123.js',
    hash: 'ABC123',
    bytes: 417,
    imports: ['@epikodelabs/waypoint'],
    inputs: ['../../app/workspace.routes.ts'],
  }],
  diagnostics: [],
  emitted: ['/dist/artifacts/workspace-set-ABC123.js'],
  replaced: [],
  removed: [],
};

test('finalizes server and browser delivery metadata from actual bundle outputs', () => {
  const result = finalizeDeliveryDocuments(
    plan,
    bundleResult,
    '/dist/server/index.json',
    '/dist/browser/manifest.json',
  );

  assert.equal(result.serverIndex.artifacts[0]?.file, '../artifacts/workspace-set-ABC123.js');
  assert.equal(result.serverIndex.artifacts[0]?.hash, 'ABC123');
  assert.equal(result.manifest.artifacts[0]?.file, '../artifacts/workspace-set-ABC123.js');
  assert.equal(result.manifest.artifacts[0]?.bytes, 417);
  assert.deepEqual(result.manifest.artifacts[0]?.imports, ['@epikodelabs/waypoint']);
  assert.deepEqual(result.manifest.artifacts[0]?.inputs, ['../../app/workspace.routes.ts']);
});

test('rejects an incomplete bundle result', () => {
  assert.throws(
    () => finalizeDeliveryDocuments(
      plan,
      { artifacts: [], diagnostics: [], emitted: [], replaced: [], removed: [] },
      path.join('/dist', 'server.json'),
      path.join('/dist', 'manifest.json'),
    ),
    /missing planned artifact "workspace-set"/,
  );
});
