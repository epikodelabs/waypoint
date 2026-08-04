import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { planRouteArtifacts } from '../lib/planning/plan-artifacts.js';
import { expandNavigation } from '../lib/ir/expand-navigation.js';
import type { SemanticNavigationProgram, PlannedCompilerOutputs } from '../lib/index.js';

const source = { filePath: '/app/routes.ts', exportName: 'routes' } as const;

const graph: SemanticNavigationProgram = {
  entry: source.filePath,
  routes: [{
    kind: 'layout',
    path: '/app',
    pageType: 'AppLayout',
    loadMode: 'eager',
    source,
    entries: [{ kind: 'slot', id: 'workspace', source }],
  }],
  routeSets: [{
    kind: 'routes-for',
    slotId: 'workspace',
    source: { filePath: '/features/workspace.routes.ts', exportName: 'workspaceRoutes' },
    entries: [{
      kind: 'route',
      path: '/dashboard',
      name: 'dashboard',
      pageType: 'DashboardPage',
      loadMode: 'eager',
      source,
    }],
  }],
};

test('keeps AST concerns out of expansion and artifact planning', () => {
  const model = expandNavigation(graph).model;
  const planned: PlannedCompilerOutputs = {
    entry: '/app/routes.ts',
    serverOutput: '/dist/server.json',
    entriesOutput: '/dist/entries',
    manifestOutput: '/dist/manifest.json',
    dryRun: true,
    routesExport: 'routes',
  };
  const result = planRouteArtifacts(planned, model, '2026-08-04T00:00:00.000Z');

  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.plan.serverIndex.generatedAt, '2026-08-04T00:00:00.000Z');
  assert.equal(result.plan.browserEntries.length, 1);
  assert.equal(
    path.basename(result.plan.browserEntries[0]!.outputPath).startsWith('route-set-workspace'),
    true,
  );
  assert.equal(result.plan.manifest.routes[0]?.path, '/app/dashboard');
});