import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

import {
  collectNavigationModuleProgram,
} from '../lib/resolution/navigation-module.js';

test('collects navigation exports through re-export graph', async () => {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), 'waypoint-nav-module-'),
  );

  try {
    const entry = path.join(root, 'app.routes.ts');
    const publicFile = path.join(root, 'public.routes.ts');
    const adminFile = path.join(root, 'admin.routes.ts');

    await fs.writeFile(
      publicFile,
      `export const publicRoutes = routesFor('public', 'public-core', []);`,
    );

    await fs.writeFile(
      adminFile,
      `export const adminRoutes = routesFor('admin', 'admin-core', []);`,
    );

    await fs.writeFile(
      entry,
      [
        `export { publicRoutes } from './public.routes';`,
        `export { adminRoutes } from './admin.routes';`,
      ].join('\n'),
    );

    const program = ts.createProgram(
      [entry, publicFile, adminFile],
      {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    );

    const result = collectNavigationModuleProgram(
      program,
      entry,
    );

    assert.deepEqual(
      result.contributions.map(item => item.exportName),
      ['adminRoutes', 'publicRoutes'],
    );

    assert.deepEqual(
      result.trees,
      [],
    );
  } finally {
    await fs.rm(root, {
      recursive: true,
      force: true,
    });
  }
});
