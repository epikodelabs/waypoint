import assert from 'node:assert/strict';
import test from 'node:test';
import type { ExpandedNavigationModel } from '../lib/ir/model.js';
import { validateExpandedNavigation } from '../lib/validation/validate-expanded-navigation.js';

const source = { filePath: '/routes.ts' } as const;
const empty = Object.freeze([]);

function model(branches: ExpandedNavigationModel['branches']): ExpandedNavigationModel {
  return { branches, slots: empty, routeSets: empty };
}

test('uses shared NAV diagnostic codes for composed route conflicts', () => {
  const diagnostics = validateExpandedNavigation(model([
    { id: 'a', kind: 'route', path: '/users/:id', staticPrefix: '/users', layouts: empty, outlets: empty, policies: empty, source },
    { id: 'b', kind: 'route', path: '/users/:userId', staticPrefix: '/users', layouts: empty, outlets: empty, policies: empty, source },
  ])).diagnostics;
  assert.ok(diagnostics.some(item => item.code === 'NAV1302'));
});

test('rejects paramsSchema keys absent from the composed path', () => {
  const diagnostics = validateExpandedNavigation(model([
    {
      id: 'device', kind: 'route', path: '/device/:id', staticPrefix: '/device',
      paramsSchema: { deviceId: { kind: 'number' } },
      layouts: empty, outlets: empty, policies: empty, source,
    },
  ])).diagnostics;
  assert.ok(diagnostics.some(item => item.code === 'NAV1200'));
});
