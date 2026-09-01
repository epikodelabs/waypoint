import {
  createHostRuntimeSource,
} from '../compiler/host-runtime-entry.js';

describe('generated host runtime entry', () => {
  it('registers the exact discovered host module namespaces', () => {
    const source = createHostRuntimeSource([
      '@angular/platform-browser',
      '@angular/core',
      '@angular/core',
    ]);

    expect(source).toContain(
      `import * as module0 from "@angular/core";`,
    );
    expect(source).toContain(
      `import * as module1 from "@angular/platform-browser";`,
    );
    expect(source).toContain(
      `import * as module2 from "@epikodelabs/waypoint";`,
    );
    expect(source.match(/@angular\/core/g)?.length).toBe(2);
    expect(source).toContain(
      '__WAYPOINT_SERVER_NAVIGATION_HOST_RUNTIME_V1__',
    );
    expect(source).toContain(
      'runtime.modules.set(specifier, module);',
    );
  });
});
