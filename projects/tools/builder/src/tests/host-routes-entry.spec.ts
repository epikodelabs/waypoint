import {
  createHostRoutesSource,
} from '../compiler/host-routes-entry.js';

describe('Waypoint host routes entry', () => {
  it('registers host module namespaces before exporting routes', () => {
    const source =
      createHostRoutesSource([
        '@angular/core',
      ]);

    expect(source).toContain(
      'import * as module',
    );
    expect(source).toContain(
      '"@epikodelabs/waypoint"',
    );
    expect(source).toContain(
      '"@angular/core"',
    );
    expect(source).toContain(
      '__WAYPOINT_SERVER_NAVIGATION_HOST_RUNTIME_V1__',
    );
    expect(source).toContain(
      'runtime.modules.set(specifier, module);',
    );
    expect(source).toContain(
      "routeSlot('application')",
    );

    expect(
      source.indexOf(
        'runtime.modules.set(specifier, module);',
      ),
    ).toBeLessThan(
      source.indexOf(
        'export const routes',
      ),
    );
  });
});
