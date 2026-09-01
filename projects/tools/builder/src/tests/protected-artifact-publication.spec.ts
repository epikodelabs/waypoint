import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  publishServerRouteOutput,
} from '../compiler/server-output.js';

test('publishes file and hash for every route artifact', async () => {
  const root =
    await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        'waypoint-server-output-',
      ),
    );

  try {
    const serverRoot =
      path.join(
        root,
        '.waypoint',
        'server',
      );

    const artifactFile =
      path.join(
        root,
        'protected',
        'public-core-abc.js',
      );

    await fs.mkdir(
      path.dirname(artifactFile),
      { recursive: true },
    );

    await fs.writeFile(
      artifactFile,
      'export default {};',
      'utf8',
    );

    await publishServerRouteOutput(
      {
        branches: [{
          id: 'public-core:1',
          kind: 'route',
          path: '/',
          staticPrefix: '/',
          policies: [],
          routeSetId: 'public-core',
        }],
        artifacts: [{
          kind: 'route',
          artifactKey: 'public-core',
          routeSetId: 'public-core',
          dependencies: [],
          branchIds: ['public-core:1'],
          sourceFile: '/app/public.routes.ts',
          exportName: 'publicRoutes',
        }],
      },
      serverRoot,
      [{
        artifactKey: 'public-core',
        routeSetId: 'public-core',
        outputPath: artifactFile,
        fileName: 'public-core-abc.js',
        hash: 'abc',
        bytes: 18,
        imports: [],
        inputs: [],
      }],
    );

    const index =
      JSON.parse(
        await fs.readFile(
          path.join(
            serverRoot,
            'server-index.json',
          ),
          'utf8',
        ),
      );

    assert.equal(
      index.artifacts[0].hash,
      'abc',
    );

    assert.equal(
      index.artifacts[0].file,
      '../../protected/public-core-abc.js',
    );
  } finally {
    await fs.rm(
      root,
      { recursive: true, force: true },
    );
  }
});