export const WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY =
  '__WAYPOINT_SERVER_NAVIGATION_HOST_RUNTIME_V1__' as const;

export type ServerNavigationHostModule =
  Readonly<Record<string, unknown>>;

export type ServerNavigationHostModules =
  Readonly<
    Record<
      string,
      ServerNavigationHostModule
    >
  >;

export interface ServerNavigationHostRuntimeState {
  readonly version: 1;
  readonly modules:
    Map<
      string,
      ServerNavigationHostModule
    >;
}

type RuntimeGlobal =
  typeof globalThis & {
    [WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY]?:
      ServerNavigationHostRuntimeState;
  };

export function readServerNavigationHostRuntime():
  ServerNavigationHostRuntimeState | undefined {
  return (
    globalThis as RuntimeGlobal
  )[
    WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
  ];
}

/**
 * Registers module namespaces shared by independently delivered artifacts.
 *
 * A plain global property is intentional. Protected route artifacts are built
 * independently from the host application and may be evaluated by a different
 * bundler/runtime wrapper in development. Both sides therefore rendezvous on
 * one explicit browser-global property instead of module-local state.
 */
export function registerServerNavigationHostModules(
  modules: ServerNavigationHostModules,
): void {
  const global =
    globalThis as RuntimeGlobal;

  let state =
    global[
      WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
    ];

  if (!state) {
    state = {
      version: 1,
      modules:
        new Map<
          string,
          ServerNavigationHostModule
        >(),
    };

    global[
      WAYPOINT_SERVER_HOST_RUNTIME_GLOBAL_KEY
    ] = state;
  }

  for (
    const [specifier, module]
    of Object.entries(modules)
  ) {
    const normalized =
      specifier.trim();

    if (!normalized) {
      throw new Error(
        'Server navigation host module specifier must not be empty.',
      );
    }

    if (
      !module
      || typeof module !== 'object'
    ) {
      throw new Error(
        `Server navigation host module ${JSON.stringify(
          normalized,
        )} must be an object namespace.`,
      );
    }

    const existing =
      state.modules.get(
        normalized,
      );

    if (
      existing
      && existing !== module
    ) {
      throw new Error(
        `Server navigation host module ${JSON.stringify(
          normalized,
        )} was registered with a different module identity.`,
      );
    }

    state.modules.set(
      normalized,
      module,
    );
  }
}