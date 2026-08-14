export const WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY =
  '@epikodelabs/waypoint/server-navigation-host-runtime/v1' as const;

export type ServerNavigationHostModule = Readonly<Record<string, unknown>>;
export type ServerNavigationHostModules = Readonly<
  Record<string, ServerNavigationHostModule>
>;

interface ServerNavigationHostRuntimeState {
  readonly version: 1;
  readonly modules: Map<string, ServerNavigationHostModule>;
}

type RuntimeGlobal = typeof globalThis & {
  [key: symbol]: ServerNavigationHostRuntimeState | undefined;
};

/**
 * Registers package module namespaces that independently delivered artifacts
 * must share with the already-running application.
 *
 * Angular packages and Waypoint itself are identity-sensitive: bundling a
 * second copy into an artifact can create different DI tokens, directives, or
 * framework runtime state. Re-registering the same module namespace is safe;
 * registering a different namespace for the same specifier is rejected.
 */
export function registerServerNavigationHostModules(
  modules: ServerNavigationHostModules,
): void {
  const global = globalThis as RuntimeGlobal;
  const key = Symbol.for(WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY);
  let state = global[key];

  if (!state) {
    state = Object.freeze({
      version: 1 as const,
      modules: new Map<string, ServerNavigationHostModule>(),
    });
    global[key] = state;
  }

  for (const [specifier, module] of Object.entries(modules)) {
    const normalized = specifier.trim();
    if (!normalized) {
      throw new Error('Server navigation host module specifier must not be empty.');
    }
    if (!module || typeof module !== 'object') {
      throw new Error(`Server navigation host module ${JSON.stringify(normalized)} must be an object namespace.`);
    }

    const existing = state.modules.get(normalized);
    if (existing && existing !== module) {
      throw new Error(
        `Server navigation host module ${JSON.stringify(normalized)} was registered with a different module identity.`,
      );
    }
    state.modules.set(normalized, module);
  }
}
