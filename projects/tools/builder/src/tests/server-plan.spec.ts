import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createServerRoutePlan,
} from '../compiler/server-plan.js';

test('derives nested route-set dependencies and inherited layout paths', () => {
  const application = {
    kind: 'route-contribution',
    slotId: 'application',
    id: 'application-core',
    entries: [
      {
        kind: 'layout',
        path: '/app',
        entries: [
          {
            kind: 'route',
            path: '/workspace/:projectId',
            name: 'workspace',
          },
          {
            kind: 'route-slot',
            id: 'administration',
          },
        ],
      },
    ],
  };

  const administration = {
    kind: 'route-contribution',
    slotId: 'administration',
    id: 'administration-core',
    entries: [
      {
        kind: 'route',
        path: '/admin',
        name: 'admin',
        policy: {
          roles: ['admin'],
          permissions: ['admin:read'],
        },
      },
    ],
  };

  const plan = createServerRoutePlan({
    rootRoutes: [
      {
        kind: 'route-slot',
        id: 'application',
      },
    ],
    contributions: [
      {
        definition: application,
        sourceFile: '/client/application.routes.ts',
        exportName: 'applicationRoutes',
      },
      {
        definition: administration,
        sourceFile: '/client/administration.routes.ts',
        exportName: 'administrationRoutes',
      },
    ],
  });

  assert.equal(
    plan.branches.find(
      branch => branch.name === 'workspace',
    )?.path,
    '/app/workspace/:projectId',
  );

  assert.equal(
    plan.branches.find(
      branch => branch.name === 'admin',
    )?.path,
    '/app/admin',
  );

  assert.deepEqual(
    plan.artifacts.find(
      artifact =>
        artifact.artifactKey
          === 'administration-core',
    )?.dependencies,
    ['application-core'],
  );
});

test('does not emit named outlet routes as separate server destinations', () => {
  const contribution = {
    kind: 'route-contribution',
    slotId: 'application',
    id: 'application-core',
    entries: [
      {
        kind: 'route',
        path: '/workspace/:id',
        name: 'workspace',
      },
      {
        kind: 'route',
        path: '/workspace/:id',
        outlet: 'sidebar',
      },
    ],
  };

  const plan = createServerRoutePlan({
    rootRoutes: [
      {
        kind: 'route-slot',
        id: 'application',
      },
    ],
    contributions: [
      {
        definition: contribution,
        sourceFile: '/client/application.routes.ts',
        exportName: 'applicationRoutes',
      },
    ],
  });

  assert.equal(
    plan.branches.length,
    1,
  );
});