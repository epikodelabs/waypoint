import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertNoProtectedRouteModulesInHost,
} from '../compiler/host-isolation.js';

const protectedRoutes = [
  {
    artifactKey: 'src/app/routes/administration#administrationRoutes',
    sourceFile: 'C:/repo/src/app/routes/administration.routes.ts',
    exportName: 'administrationRoutes',
  },
] as const;

test('accepts a host bundle that contains only root slots', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-isolation-'));
  try {
    await fs.writeFile(path.join(root, 'main.js'), `routeSlot("public"); routeSlot("application");`, 'utf8');
    await assertNoProtectedRouteModulesInHost(root, protectedRoutes);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('rejects a protected route source that leaked into host output', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-isolation-'));
  try {
    await fs.writeFile(
      path.join(root, 'main.js'),
      `//# sourceURL=C:/repo/src/app/routes/administration.routes.ts`,
      'utf8',
    );
    await assert.rejects(
      () => assertNoProtectedRouteModulesInHost(root, protectedRoutes),
      /administration.*leaked into public host output/i,
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('also scans source maps because they are public artifacts', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-isolation-'));
  try {
    await fs.writeFile(path.join(root, 'main.js'), `console.log("host");`, 'utf8');
    await fs.writeFile(path.join(root, 'main.js.map'), JSON.stringify({
      version: 3,
      sources: ['C:/repo/src/app/routes/administration.routes.ts'],
    }), 'utf8');
    await assert.rejects(
      () => assertNoProtectedRouteModulesInHost(root, protectedRoutes),
      /administration.*leaked into public host output/i,
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
