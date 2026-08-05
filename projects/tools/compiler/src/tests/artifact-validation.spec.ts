import assert from 'node:assert/strict';
import test from 'node:test';
import { validateArtifactPlan } from '../lib/validation/validate-artifact-plan.js';
import type { RouteArtifactPlan } from '../lib/compiler/contracts.js';

function plan(): RouteArtifactPlan {
  return {
    version: 1,
    generatedAt: '2026-08-05T00:00:00.000Z',
    entry: '/app/routes.ts',
    artifacts: [{
      artifactKey: 'child', routeSetId: 'child', slotId: 'child-slot', dependencies: ['missing'],
      source: { file: '/app/child.ts', exportName: 'childRoutes' },
      entry: { outputPath: '/out/child.ts', importPath: '../app/child', contents: '' },
      bundle: { outputDirectory: '/out/artifacts', fileNameTemplate: 'child-[hash].js', format: 'esm', platform: 'browser', isolated: true },
      branchIds: [],
    }],
    browserEntries: [], serverShards: [],
    serverIndex: { version: 1, artifactPlanVersion: 1, entry: '/app/routes.ts', generatedAt: '2026-08-05T00:00:00.000Z', shards: [], artifacts: [], slots: [], routeSets: [] },
    manifest: { version: 1, artifactPlanVersion: 1, generatedAt: '2026-08-05T00:00:00.000Z', slots: [], routeSets: [], artifacts: [], routes: [] },
  };
}

test('artifact plan validation rejects missing route sets and dependencies', () => {
  const diagnostics = validateArtifactPlan(plan()).diagnostics;
  assert.ok(diagnostics.some(item => item.code === 'WPT3201'));
  assert.ok(diagnostics.some(item => item.code === 'WPT3203'));
});
