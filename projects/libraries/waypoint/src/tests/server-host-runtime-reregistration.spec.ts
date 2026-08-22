import {
  ensureServerNavigationHostModules,
} from '../server/browser-delivery';
import {
  WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY,
} from '../server/server-host-runtime';

describe('server navigation host bridge timing', () => {
  it('can safely restore the same host namespace after the bridge global is reset', () => {
    const waypoint =
      Object.freeze({
        marker: {},
      });

    const modules = {
      '@epikodelabs/waypoint':
        waypoint,
    } as const;

    const key = Symbol.for(
      WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY,
    );

    ensureServerNavigationHostModules(
      modules,
    );

    expect(
      (globalThis as any)[key]
        ?.modules
        ?.get(
          '@epikodelabs/waypoint',
        ),
    ).toBe(waypoint);

    delete (globalThis as any)[key];

    ensureServerNavigationHostModules(
      modules,
    );

    expect(
      (globalThis as any)[key]
        ?.modules
        ?.get(
          '@epikodelabs/waypoint',
        ),
    ).toBe(waypoint);
  });
});
