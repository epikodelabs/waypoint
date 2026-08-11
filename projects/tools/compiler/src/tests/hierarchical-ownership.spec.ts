import assert from 'node:assert/strict';
import test from 'node:test';
import { buildNavigationIr } from '../lib/ir/build-navigation-ir.js';
import { expandNavigation } from '../lib/ir/expand-navigation.js';
import type { SemanticNavigationProgram } from '../lib/ir/model.js';
import { validateNavigationIr } from '../lib/validation/validate-navigation-ir.js';

const rootSource = { filePath: '/app/routes.ts', exportName: 'routes' } as const;

function routeSetSource(name: string) {
  return {
    filePath: `/features/${name}.routes.ts`,
    exportName: `${name}Routes`,
  } as const;
}

test('expands nested routesFor ownership through layouts and retained slots', () => {
  const program: SemanticNavigationProgram = {
    entry: rootSource.filePath,
    routes: [{
      kind: 'layout',
      path: '/app',
      pageType: 'AppLayout',
      loadMode: 'eager',
      source: rootSource,
      entries: [{ kind: 'slot', id: 'administration', source: rootSource }],
    }],
    routeSets: [{
      kind: 'routes-for',
      slotId: 'administration',
      source: routeSetSource('administration'),
      entries: [{
        kind: 'layout',
        path: '/users',
        pageType: 'UsersLayout',
        loadMode: 'eager',
        source: routeSetSource('administration'),
        entries: [
          {
            kind: 'route',
            path: '/list',
            name: 'userList',
            pageType: 'UsersPage',
            loadMode: 'eager',
            source: routeSetSource('administration'),
          },
          {
            kind: 'slot',
            id: 'administration.users.extensions',
            source: routeSetSource('administration'),
          },
        ],
      }],
    }, {
      kind: 'routes-for',
      slotId: 'administration.users.extensions',
      source: routeSetSource('userExtensions'),
      entries: [{
        kind: 'route',
        path: '/imports',
        name: 'userImports',
        pageType: 'UserImportsPage',
        loadMode: 'lazy',
        source: routeSetSource('userExtensions'),
      }],
    }],
  };

  const ir = buildNavigationIr(program);
  assert.deepEqual(validateNavigationIr(ir).diagnostics, []);

  const expanded = expandNavigation(ir);
  assert.deepEqual(expanded.diagnostics, []);
  assert.deepEqual(
    expanded.model.branches.map(branch => branch.path),
    ['/app/users/imports', '/app/users/list'],
  );

  const nestedSlot = expanded.model.slots.find(
    slot => slot.id === 'administration.users.extensions',
  );
  const parentSet = expanded.model.routeSets.find(
    routeSet => routeSet.slotId === 'administration',
  );
  const nestedSet = expanded.model.routeSets.find(
    routeSet => routeSet.slotId === 'administration.users.extensions',
  );

  assert.equal(nestedSlot?.parentPath, '/app/users');
  assert.equal(nestedSlot?.parentSlotId, 'administration');
  assert.equal(nestedSlot?.declaredByRouteSetId, parentSet?.id);
  assert.equal(nestedSet?.parentRouteSetId, parentSet?.id);
  assert.equal(
    expanded.model.branches.find(branch => branch.name === 'userImports')?.slotId,
    'administration.users.extensions',
  );
});

test('rejects cyclic hierarchical ownership', () => {
  const program: SemanticNavigationProgram = {
    entry: rootSource.filePath,
    routes: [],
    routeSets: [{
      kind: 'routes-for',
      slotId: 'a',
      source: routeSetSource('a'),
      entries: [{ kind: 'slot', id: 'b', source: routeSetSource('a') }],
    }, {
      kind: 'routes-for',
      slotId: 'b',
      source: routeSetSource('b'),
      entries: [{ kind: 'slot', id: 'a', source: routeSetSource('b') }],
    }],
  };

  const diagnostics = validateNavigationIr(buildNavigationIr(program)).diagnostics;
  assert.ok(diagnostics.some(item => item.code === 'NAV1510'));
});