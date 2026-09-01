/*
Final public ServerNavigationResolverOptions:

export interface ServerNavigationResolverOptions {
  readonly endpoint?: string;
  readonly fetch?: ServerNavigationFetch;
  readonly importModule?: ServerNavigationModuleImporter;
  readonly artifactRefreshRetries?: number;
}

Remove:
  hostModules
  ServerNavigationHostModules import
  registerServerNavigationHostModules(...)
  hostModules presence checks

The generated build-time runtime registrar now populates the internal bridge.
*/