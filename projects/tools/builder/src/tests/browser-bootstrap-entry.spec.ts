import path from 'node:path';

import {
  createBrowserBootstrapSource,
} from '../compiler/browser-bootstrap-entry.js';

describe('Waypoint browser bootstrap entry', () => {
  it('loads the host runtime before the application entry', () => {
    const root = path.resolve('/workspace');
    const bootstrap = path.join(
      root,
      '.waypoint',
      'browser.mjs',
    );

    const source =
      createBrowserBootstrapSource(
        path.join(root, 'src', 'main.ts'),
        path.join(
          root,
          '.waypoint',
          'host-runtime.mjs',
        ),
        bootstrap,
      );

    const imports = source
      .split('\n')
      .filter(line =>
        line.startsWith('import '));

    expect(imports).toEqual([
      'import "./host-runtime.mjs";',
      'import "../src/main.ts";',
    ]);
  });
});
