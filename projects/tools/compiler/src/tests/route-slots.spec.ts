import assert from 'node:assert/strict';
import test from 'node:test';
import { buildNavigationIr } from '../lib/ir/build-navigation-ir.js';
import { expandNavigation } from '../lib/ir/expand-navigation.js';
import { validateNavigation } from '../lib/validation/validate-navigation.js';
import type { SemanticNavigationProgram } from '../lib/index.js';

const source = { filePath: '/app/routes.ts', exportName: 'routes' } as const;

test('compiles routesFor entries relative to the retained slot context', () => {
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

  const expanded = expandNavigation(buildNavigationIr(graph));
  assert.deepEqual(expanded.diagnostics, []);
  assert.equal(expanded.model.slots[0]?.parentPath, '/app');
  assert.equal(expanded.model.branches[0]?.path, '/app/dashboard');
  assert.equal(expanded.model.branches[0]?.slotId, 'workspace');
  assert.equal(expanded.model.routeSets[0]?.branchIds[0], 'dashboard');
});

test('reports routesFor declarations targeting unknown slots', () => {
  const graph: SemanticNavigationProgram = {
    entry: source.filePath,
    routes: [],
    routeSets: [{
      kind: 'routes-for',
      slotId: 'missing',
      source: { filePath: '/features/missing.routes.ts', exportName: 'missingRoutes' },
      entries: [],
    }],
  };
  const expanded = expandNavigation(buildNavigationIr(graph));
  assert.equal(expanded.diagnostics[0]?.code, 'WPT2002');
});

test('validates duplicate inherited path parameter names', () => {
  const graph: SemanticNavigationProgram = {
    entry: source.filePath,
    routes: [{
      kind: 'layout',
      path: '/devices/:id',
      pageType: 'DeviceLayout',
      loadMode: 'eager',
      source,
      entries: [{ kind: 'slot', id: 'boards', source }],
    }],
    routeSets: [{
      kind: 'routes-for',
      slotId: 'boards',
      source: { filePath: '/features/boards.routes.ts', exportName: 'boardRoutes' },
      entries: [{
        kind: 'route',
        path: '/boards/:id',
        pageType: 'BoardPage',
        loadMode: 'eager',
        source,
      }],
    }],
  };
  const expanded = expandNavigation(buildNavigationIr(graph));
  const validated = validateNavigation(expanded.model);
  assert.ok(validated.diagnostics.some(item => item.code === 'WPT2211'));
});