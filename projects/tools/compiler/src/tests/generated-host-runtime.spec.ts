import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { emitHostRuntimeEntry } from '../lib/emitters/emit-host-runtime-entry.js';

test('generates runtime registration without application configuration', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-runtime-'));
  const output = path.join(root, 'runtime.ts');

  await emitHostRuntimeEntry(output, [
    '@epikodelabs/waypoint',
    '@angular/core',
  ]);

  const source = await fs.readFile(output, 'utf8');

  assert.match(source, /@angular\/core/);
  assert.match(source, /@epikodelabs\/waypoint/);
  assert.match(source, /Symbol\.for/);
  assert.doesNotMatch(source, /hostModules/);
});
