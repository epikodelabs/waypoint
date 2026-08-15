import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

test('generated artifact entries die with their build session', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-entry-'));
  const entry = path.join(root, '.waypoint-entries', 'route-set-admin.mjs');

  await fs.mkdir(path.dirname(entry), { recursive: true });
  await fs.writeFile(entry, 'export {};');
  assert.equal(await fs.readFile(entry, 'utf8'), 'export {};');

  await fs.rm(root, { recursive: true, force: true });
  await assert.rejects(fs.access(entry));
});
