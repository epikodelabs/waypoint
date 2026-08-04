import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRouteGraph } from '../graph-builder.js';
import type { ParsedRouteGraph } from '../types.js';

const graph: ParsedRouteGraph = {
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
  const first = buildRouteGraph(graph).model;
  const second = buildRouteGraph(graph).model;
  assert.equal(first.routeSets[0]?.id, second.routeSets[0]?.id);
  assert.equal(first.branches[0]?.id, second.branches[0]?.id);
});
