import {
  readServerNavigationHostRuntime,
  registerServerNavigationHostModules,
  WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY,
} from './server-host-runtime';

describe(
  'server navigation host runtime',
  () => {
    afterEach(() => {
      delete (
        globalThis as any
      )[
        WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
      ];
    });

    it(
      'publishes namespaces on the explicit global bridge',
      () => {
        const waypoint =
          Object.freeze({
            token: {},
          });

        registerServerNavigationHostModules({
          '@epikodelabs/waypoint':
            waypoint,
        });

        expect(
          readServerNavigationHostRuntime()
            ?.modules.get(
              '@epikodelabs/waypoint',
            ),
        ).toBe(waypoint);

        expect(
          (
            globalThis as any
          )[
            WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
          ]?.modules?.get(
            '@epikodelabs/waypoint',
          ),
        ).toBe(waypoint);
      },
    );

    it(
      'accepts repeated registration of the same identity',
      () => {
        const module =
          Object.freeze({
            token: {},
          });

        expect(() => {
          registerServerNavigationHostModules({
            '@test/runtime':
              module,
          });

          registerServerNavigationHostModules({
            '@test/runtime':
              module,
          });
        }).not.toThrow();
      },
    );

    it(
      'rejects conflicting identities',
      () => {
        registerServerNavigationHostModules({
          '@test/runtime':
            Object.freeze({
              value: 1,
            }),
        });

        expect(() =>
          registerServerNavigationHostModules({
            '@test/runtime':
              Object.freeze({
                value: 2,
              }),
          }),
        ).toThrowError(
          /different module identity/i,
        );
      },
    );
  },
);