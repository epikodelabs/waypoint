import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

test('Waypoint schema preserves Angular application options', async () => {
  const schema = JSON.parse(
    await fs.readFile(
      path.resolve(
        'projects/tools/builder/src/waypoint-build/schema.json',
      ),
      'utf8',
    ),
  );

  assert.ok(schema.properties?.browser);
  assert.ok(schema.properties?.outputPath);
  assert.ok(schema.properties?.tsConfig);
  assert.ok(schema.properties?.polyfills);
  assert.ok(schema.properties?.fileReplacements);
  assert.ok(schema.properties?.waypoint);
});

test('Waypoint options are isolated under one namespace', async () => {
  const schema = JSON.parse(
    await fs.readFile(
      path.resolve(
        'projects/tools/builder/src/waypoint-build/schema.json',
      ),
      'utf8',
    ),
  );

  const waypoint = schema.properties?.waypoint;

  assert.equal(
    waypoint.additionalProperties,
    false,
  );

  assert.deepEqual(
    Object.keys(waypoint.properties).sort(),
    [
      'buildManifest',
      'entry',
      'profile',
      'routesExport',
    ],
  );
});