import {
  createHostRoutesSource,
} from '../compiler/host-routes-entry.js';

describe('Waypoint inline host registration', () => {
  it('uses the same global registry key as protected artifact shims', () => {
    const source =
      createHostRoutesSource([]);

    expect(source).toContain(
      '__WAYPOINT_SERVER_NAVIGATION_HOST_RUNTIME_V1__',
    );
    expect(source).toContain(
      'globalThis as typeof globalThis & Record<string, any>',
    );
    expect(source).toContain(
      'new Map()',
    );
    expect(source).toContain(
      'runtime.modules.get(specifier)',
    );
    expect(source).toContain(
      'runtime.modules.set(specifier, module)',
    );
  });
});
