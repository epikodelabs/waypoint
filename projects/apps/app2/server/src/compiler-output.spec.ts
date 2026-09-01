import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

describe('App2 compiler output workspace discovery', () => {
  it('documents the Vite dev-server cwd invariant', async () => {
    const root =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          'waypoint-workspace-',
        ),
      );

    try {
      await fs.writeFile(
        path.join(root, 'angular.json'),
        '{}',
      );
      await fs.writeFile(
        path.join(root, 'package.json'),
        '{}',
      );

      const viteRoot =
        path.join(
          root,
          '.angular',
          'vite-root',
        );

      await fs.mkdir(
        viteRoot,
        { recursive: true },
      );

      // Regression invariant:
      // workspace-relative compiler output must resolve against `root`,
      // not against `.angular/vite-root`.
      expect(
        path.resolve(
          root,
          'dist/waypoint-generated/server',
        ),
      ).not.toBe(
        path.resolve(
          viteRoot,
          'dist/waypoint-generated/server',
        ),
      );
    } finally {
      await fs.rm(
        root,
        {
          recursive: true,
          force: true,
        },
      );
    }
  });
});