import assert from 'node:assert/strict';
import test from 'node:test';
import { buildNavigationIr } from '../lib/ir/build-navigation-ir.js';
import type { SemanticNavigationProgram } from '../lib/ir/model.js';
import { validateNavigationIr } from '../lib/validation/validate-navigation-ir.js';

const source = { filePath: '/app/routes.ts', exportName: 'routes' } as const;

function validate(program: SemanticNavigationProgram) {
  return validateNavigationIr(buildNavigationIr(program)).diagnostics;
}

test('rejects routesFor targeting an unknown slot before expansion', () => {
  const diagnostics = validate({
    entry: source.filePath,
    routes: [],
    routeSets: [{
      kind: 'routes-for',
      id: 'workspace-core',
      slotId: 'workspace',
      source: { filePath: '/workspace.routes.ts', exportName: 'workspaceRoutes' },
      entries: [],
    }],
  });
  assert.ok(diagnostics.some(item => item.code === 'NAV1501'));
});

test('rejects multiple routesFor owners for one slot', () => {
  const diagnostics = validate({
    entry: source.filePath,
    routes: [{ kind: 'slot', id: 'workspace', source }],
    routeSets: [
      { kind: 'routes-for', id: 'a-core', slotId: 'workspace', source: { filePath: '/a.ts', exportName: 'a' }, entries: [] },
      { kind: 'routes-for', id: 'b-core', slotId: 'workspace', source: { filePath: '/b.ts', exportName: 'b' }, entries: [] },
    ],
  });
  assert.ok(diagnostics.some(item => item.code === 'NAV1502'));
});

test('rejects optional path schemas and inconsistent number constraints in IR', () => {
  const diagnostics = validate({
    entry: source.filePath,
    routes: [{
      kind: 'route',
      path: '/device/:id',
      pageType: 'DevicePage',
      loadMode: 'eager',
      source,
      paramsSchema: {
        id: { kind: 'optional', inner: { kind: 'number', min: 10, max: 1, default: 5 } },
      },
    }],
    routeSets: [],
  });
  assert.ok(diagnostics.some(item => item.code === 'NAV1201'));
  assert.ok(diagnostics.some(item => item.code === 'NAV1202'));
  assert.ok(diagnostics.some(item => item.code === 'NAV1203'));
});