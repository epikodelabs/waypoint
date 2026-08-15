import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

import {
  discoverNavigationExports,
  selectNavigationExport,
} from '../lib/resolution/discover-navigation-export.js';

function source(text: string) {
  return ts.createSourceFile(
    'app.routes.ts',
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

test('discovers a single exported array navigation root', () => {
  const file = source(`
    export const navigation = [
      routeSlot('public'),
      routeSlot('application'),
    ] as const satisfies NavigationTree;
  `);

  assert.equal(
    selectNavigationExport(file),
    'navigation',
  );
});

test('discovers a single routesFor root', () => {
  const file = source(`
    export const application =
      routesFor('application', 'core', []);
  `);

  assert.equal(
    selectNavigationExport(file),
    'application',
  );
});

test('requires an override when multiple roots are plausible', () => {
  const file = source(`
    export const first = [];
    export const second = [];
  `);

  assert.throws(
    () => selectNavigationExport(file),
    /multiple exported/i,
  );

  assert.equal(
    selectNavigationExport(file, 'second'),
    'second',
  );
});

test('does not mistake unrelated exported primitives for navigation roots', () => {
  const file = source(`
    export const version = 1;
    export const name = 'demo';
    export const navigation = [];
  `);

  assert.deepEqual(
    discoverNavigationExports(file).map(candidate => candidate.name),
    ['navigation'],
  );
});
