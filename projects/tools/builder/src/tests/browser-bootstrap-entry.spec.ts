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

    expect(source).toContain(
      'import "./host-runtime.mjs";',
    );
    expect(source).toContain(
      'await import("../src/main.ts");',
    );

    expect(
      source.indexOf(
        'import "./host-runtime.mjs";',
      ),
    ).toBeLessThan(
      source.indexOf(
        'await import("../src/main.ts");',
      ),
    );
  });
});
