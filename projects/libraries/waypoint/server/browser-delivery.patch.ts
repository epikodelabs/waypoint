/*
Remove from ServerNavigationResolverOptions:

  readonly hostModules?: ServerNavigationHostModules;

Remove:
  registerServerNavigationHostModules import
  all "hostModules required" validation
  registerServerNavigationHostModules(options.hostModules)

createServerNavigationResolver() becomes usable as:

  createServerNavigationResolver()

The runtime registry still exists internally because protected bundles use the
generated bridge modules. It is populated automatically by the builder-generated
host runtime entry before protected navigation can be resolved.
*/
