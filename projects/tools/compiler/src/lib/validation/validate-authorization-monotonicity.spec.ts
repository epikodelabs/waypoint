import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAuthorizationMonotonicity,
} from './validate-authorization-monotonicity.js';

function auth(
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
  allowAnonymous = false,
) {
  return {
    allowAnonymous,
    roles,
    permissions,
  };
}

function routeArtifact(
  routeSetId: string,
  authorization: ReturnType<typeof auth>,
  parentRouteSetId?: string,
) {
  return {
    kind: 'route',
    artifactKey: routeSetId,
    routeSetId,
    slotId: routeSetId,
    parentRouteSetId,
    authorization,
    dependencies: [],
    branchIds: [],
  };
}

test('allows authorization to stay equal', () => {
  const plan = {
    artifacts: [
      routeArtifact(
        'application',
        auth(['user']),
      ),
      routeArtifact(
        'settings',
        auth(['user']),
        'application',
      ),
    ],
  } as any;

  assert.deepEqual(
    validateAuthorizationMonotonicity(plan),
    [],
  );
});

test('allows nested authorization to become stricter', () => {
  const plan = {
    artifacts: [
      routeArtifact(
        'application',
        auth(['user']),
      ),
      routeArtifact(
        'administration',
        auth(['user', 'admin']),
        'application',
      ),
      routeArtifact(
        'security',
        auth(
          ['user', 'admin'],
          ['security:manage'],
        ),
        'administration',
      ),
    ],
  } as any;

  assert.deepEqual(
    validateAuthorizationMonotonicity(plan),
    [],
  );
});

test('rejects a child that broadens authorization', () => {
  const plan = {
    artifacts: [
      routeArtifact(
        'administration',
        auth(['user', 'admin']),
      ),
      routeArtifact(
        'application',
        auth(['user']),
        'administration',
      ),
    ],
  } as any;

  const diagnostics =
    validateAuthorizationMonotonicity(plan);

  assert.equal(
    diagnostics.some(
      item => item.code === 'WPT3211',
    ),
    true,
  );
});

test('rejects protected-to-anonymous weakening', () => {
  const plan = {
    artifacts: [
      routeArtifact(
        'application',
        auth(['user']),
      ),
      routeArtifact(
        'public-child',
        auth([], [], true),
        'application',
      ),
    ],
  } as any;

  const diagnostics =
    validateAuthorizationMonotonicity(plan);

  assert.equal(
    diagnostics.some(
      item => item.code === 'WPT3211',
    ),
    true,
  );
});

test('does not invent ordering between unrelated role domains', () => {
  const plan = {
    artifacts: [
      routeArtifact(
        'administration',
        auth(['admin']),
      ),
      routeArtifact(
        'finance',
        auth(['finance']),
        'administration',
      ),
    ],
  } as any;

  const diagnostics =
    validateAuthorizationMonotonicity(plan);

  assert.equal(
    diagnostics.some(
      item => item.code === 'WPT3211',
    ),
    true,
  );
});
