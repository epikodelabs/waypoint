import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAngularDeclarationIsolation,
} from '../analysis/validate-angular-declaration-isolation.js';

function auth(
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
  allowAnonymous = false,
) {
  return {
    allowAnonymous,
    roles,
    permissions,
  } as any;
}

test('allows declaration module with a single authorization owner', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/workspace.page.mjs',
        declarations: ['WorkspacePage'],
        consumers: [
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
        ],
      },
    ]);

  assert.deepEqual(
    diagnostics,
    [],
  );
});

test('allows containment-chain sharing', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/shell.mjs',
        declarations: ['AppShell'],
        consumers: [
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
          {
            artifactKey: 'administration',
            authorization: auth(
              ['user', 'admin'],
            ),
          },
        ],
      },
    ]);

  assert.deepEqual(
    diagnostics,
    [],
  );
});

test('rejects declaration module across incomparable authorization domains', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/demo-pages.mjs',
        declarations: [
          'IntroPage',
          'WorkspacePage',
          'SettingsPage',
        ],
        consumers: [
          {
            artifactKey: 'public',
            authorization: auth([], [], true),
          },
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
        ],
      },
    ]);

  assert.equal(
    diagnostics[0]?.code,
    'WPT3220',
  );
});

test('rejects admin/finance incomparable sharing', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/admin-finance-pages.mjs',
        declarations: [
          'AdminPage',
          'FinancePage',
        ],
        consumers: [
          {
            artifactKey: 'admin',
            authorization: auth(['admin']),
          },
          {
            artifactKey: 'finance',
            authorization: auth(['finance']),
          },
        ],
      },
    ]);

  assert.equal(
    diagnostics.length,
    1,
  );
});
