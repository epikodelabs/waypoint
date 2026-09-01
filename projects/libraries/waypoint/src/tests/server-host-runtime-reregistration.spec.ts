import {
  registerServerNavigationHostModules,
  readServerNavigationHostRuntime,
  WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY,
} from '../lib/server-host-runtime';

describe('server navigation host bridge timing', () => {
  afterEach(() => {
    delete (globalThis as any)[
      WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
    ];
  });

  it('can safely restore the same host namespace after the bridge global is reset', () => {
    const waypoint = Object.freeze({
      marker: {},
    });

    const modules = {
      '@epikodelabs/waypoint': waypoint,
    } as const;

    registerServerNavigationHostModules(modules);

    expect(
      readServerNavigationHostRuntime()
        ?.modules
        .get('@epikodelabs/waypoint'),
    ).toBe(waypoint);

    delete (globalThis as any)[
      WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
    ];

    registerServerNavigationHostModules(modules);

    expect(
      readServerNavigationHostRuntime()
        ?.modules
        .get('@epikodelabs/waypoint'),
    ).toBe(waypoint);
  });
});
