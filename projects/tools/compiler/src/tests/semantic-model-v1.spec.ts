import assert from 'node:assert/strict';
import test from 'node:test';
import {
  NAVIGATION_SEMANTIC_MODEL_VERSION,
  type SemanticNavigationProgram,
  type SemanticRouteSlot,
  type SemanticRoutesFor,
} from '../lib/ir/model.js';

const source = {
  filePath: '/app/routes.ts',
  exportName: 'routes',
} as const;

test('freezes semantic model version 1', () => {
  assert.equal(NAVIGATION_SEMANTIC_MODEL_VERSION, 1);
});

test('keeps route slots and routesFor ownership as distinct semantic entities', () => {
  const slot: SemanticRouteSlot = {
    kind: 'slot',
    id: 'workspace',
    source,
  };
  const owned: SemanticRoutesFor = {
    kind: 'routes-for',
    id: 'workspace-core',
    slotId: 'workspace',
    source: { ...source, exportName: 'workspaceRoutes' },
    entries: [],
  };
  const program: SemanticNavigationProgram = {
    entry: source.filePath,
    routes: [slot],
    routeSets: [owned],
  };
  assert.equal(program.routes[0]?.kind, 'slot');
  assert.equal(program.routeSets[0]?.kind, 'routes-for');
});