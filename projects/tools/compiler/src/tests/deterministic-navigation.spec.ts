import assert from 'node:assert/strict';
import test from 'node:test';
import { expandNavigation } from '../lib/ir/expand-navigation.js';
import type { SemanticNavigationProgram } from '../lib/index.js';

const graph: SemanticNavigationProgram = {
  entry: '/app/routes.ts',
  routes: [{ kind: 'slot', id: 'root', source: { filePath: '/app/routes.ts' } }],
  routeSets: [{
    kind: 'routes-for',
    slotId: 'root',
    source: { filePath: '/features/root.routes.ts', exportName: 'rootRoutes' },
    entries: [{
      kind: 'route',
      path: '/home',
      pageType: 'HomePage',
      loadMode: 'eager',
      source: { filePath: '/features/root.routes.ts' },
    }],
  }],
};

test('derives stable route-set and anonymous branch identities', () => {
  const first = expandNavigation(graph).model;
  const second = expandNavigation(graph).model;
  assert.equal(first.routeSets[0]?.id, second.routeSets[0]?.id);
  assert.equal(first.branches[0]?.id, second.branches[0]?.id);
});