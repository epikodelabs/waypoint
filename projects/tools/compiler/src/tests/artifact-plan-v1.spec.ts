import assert from 'node:assert/strict';
import test from 'node:test';
import { ARTIFACT_PLAN_VERSION } from '../lib/compiler/contracts.js';
import { planRouteArtifacts } from '../lib/planning/plan-artifacts.js';
import type { PlannedCompilerOutputs } from '../lib/compiler/contracts.js';
import type { ExpandedNavigationModel } from '../lib/ir/model.js';

const planned: PlannedCompilerOutputs = {
  cwd: '/',
  artifactTsConfig: '/app/tsconfig.json',
  entry: '/app/routes.ts',
  serverOutput: '/dist/server.json',
  entriesOutput: '/dist/entries',
  manifestOutput: '/dist/manifest.json',
  artifactsOutput: '/dist/artifacts',
  dryRun: true,
  routesExport: 'routes',
};

const source = (filePath: string, exportName: string) => ({ filePath, exportName });

test('plans hierarchical route-set artifacts in dependency order', () => {
  const model: ExpandedNavigationModel = {
    slots: [{
      id: 'administration',
      parentPath: '/app',
      layoutDepth: 1,
      source: source('/app/routes.ts', 'routes'),
    }, {
      id: 'administration.users',
      parentPath: '/app/users',
      layoutDepth: 2,
      source: source('/features/admin.routes.ts', 'administrationRoutes'),
      parentSlotId: 'administration',
      declaredByRouteSetId: 'admin-set',
    }],
    routeSets: [{
      id: 'child-set',
      slotId: 'administration.users',
      source: source('/features/users.routes.ts', 'userRoutes'),
      branchIds: ['users-import'],
      parentRouteSetId: 'admin-set',
    }, {
      id: 'admin-set',
      slotId: 'administration',
      source: source('/features/admin.routes.ts', 'administrationRoutes'),
      branchIds: ['admin-home'],
    }],
    branches: [{
      id: 'admin-home',
      kind: 'route',
      path: '/app/home',
      staticPrefix: '/app/home',
      layouts: [],
      outlets: [],
      policies: [],
      slotId: 'administration',
      routeSetId: 'admin-set',
    }, {
      id: 'users-import',
      kind: 'route',
      path: '/app/users/import',
      staticPrefix: '/app/users/import',
      layouts: [],
      outlets: [],
      policies: [],
      slotId: 'administration.users',
      routeSetId: 'child-set',
    }],
  };

  const result = planRouteArtifacts(planned, model, '2026-08-04T00:00:00.000Z');
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.plan.version, ARTIFACT_PLAN_VERSION);
  assert.deepEqual(result.plan.artifacts.map(item => item.routeSetId), ['admin-set', 'child-set']);
  assert.deepEqual(result.plan.artifacts[0]?.dependencies, []);
  assert.deepEqual(result.plan.artifacts[1]?.dependencies, ['admin-set']);
  assert.equal(result.plan.artifacts[0]?.bundle.isolated, true);
  assert.equal(result.plan.serverIndex.artifactPlanVersion, 1);
  assert.deepEqual(result.plan.serverIndex.artifacts[0]?.branchIds, ['admin-home']);
  assert.deepEqual(result.plan.serverIndex.artifacts[1]?.branchIds, ['users-import']);
  assert.equal(result.plan.manifest.artifactPlanVersion, 1);
  assert.deepEqual(result.plan.manifest.artifacts[1]?.dependencies, ['admin-set']);
});

test('uses a deterministic default artifacts directory', () => {
  assert.equal(planned.artifactsOutput, '/dist/artifacts');
});