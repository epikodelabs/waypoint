import assert from 'node:assert/strict';
import test from 'node:test';
import { buildNavigationIr } from '../lib/ir/build-navigation-ir.js';
import {
  NAVIGATION_IR_VERSION,
  NavigationIrEntryKind,
  readIrString,
} from '../lib/ir/navigation-ir.js';
import type { SemanticNavigationProgram } from '../lib/ir/model.js';

const source = { filePath: '/app/routes.ts', exportName: 'routes' } as const;

const program: SemanticNavigationProgram = {
  entry: source.filePath,
  routes: [{
    kind: 'layout',
    path: '/app',
    pageType: 'AppLayout',
    loadMode: 'eager',
    policy: { roles: ['member'] },
    source,
    entries: [
      { kind: 'slot', id: 'workspace', source },
      {
        kind: 'route',
        path: '/device/:deviceId',
        name: 'device',
        pageType: 'DevicePage',
        loadMode: 'lazy',
        policy: { roles: ['member'] },
        source,
      },
    ],
  }],
  routeSets: [{
    kind: 'routes-for',
    slotId: 'workspace',
    source: { filePath: '/features/workspace.routes.ts', exportName: 'workspaceRoutes' },
    entries: [{
      kind: 'route',
      path: '/dashboard',
      pageType: 'DashboardPage',
      loadMode: 'eager',
      source,
    }],
  }],
};

test('lowers semantic navigation into compact Navigation IR', () => {
  const ir = buildNavigationIr(program);

  assert.equal(ir.version, NAVIGATION_IR_VERSION);
  assert.equal(readIrString(ir, ir.entry), '/app/routes.ts');
  assert.equal(ir.rootEntryCount, 1);
  assert.equal(ir.routeSets.length, 1);
  assert.equal(ir.entries[ir.entryRefs[ir.rootFirstEntry]!]!.kind, NavigationIrEntryKind.Layout);
});

test('interns repeated policies and source identities', () => {
  const ir = buildNavigationIr(program);

  assert.equal(ir.policies.length, 1);
  assert.ok(ir.sources.length < ir.entries.length + 2);
});

test('stores child lists as ranges rather than nested arrays', () => {
  const ir = buildNavigationIr(program);
  const root = ir.entries[ir.entryRefs[ir.rootFirstEntry]!]!;

  assert.equal(root.kind, NavigationIrEntryKind.Layout);
  if (root.kind !== NavigationIrEntryKind.Layout) return;
  assert.equal(root.childCount, 2);
  assert.equal(ir.entryRefs[root.firstChild] !== undefined, true);
});
