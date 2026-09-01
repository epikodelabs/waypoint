import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertNoRouteArtifactKeysInHost,
} from '../compiler/host-isolation.js';

test('accepts a host bundle that contains only root slots', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-isolation-'));
  try {
    await fs.writeFile(path.join(root, 'main.js'), `routeSlot("public"); routeSlot("application");`, 'utf8');
    await assertNoRouteArtifactKeysInHost(root, ['public-core', 'application-core', 'administration-core']);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('rejects a routesFor contribution that leaked into main.js', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-isolation-'));
  try {
    await fs.writeFile(path.join(root, 'main.js'), `routesFor("administration", "administration-core", []);`, 'utf8');
    await assert.rejects(
      () => assertNoRouteArtifactKeysInHost(root, ['application-core', 'administration-core']),
      /administration-core.*leaked into public host output/i,
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
      sourcesContent: [`routesFor("application", "application-core", []);`],
    }), 'utf8');
    await assert.rejects(
      () => assertNoRouteArtifactKeysInHost(root, ['application-core']),
      /application-core.*leaked into public host output/i,
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});