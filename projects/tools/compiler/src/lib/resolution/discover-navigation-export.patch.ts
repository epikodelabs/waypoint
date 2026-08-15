/*
Navigation-root discovery should now allow an aggregation-only entry module.

If app.routes.ts contains no exported NavigationTree root but does re-export one
or more routesFor() contributions, this is no longer an error.

Selection becomes:

1. explicit routesExport -> use authored tree;
2. exactly one NavigationTree candidate -> use it;
3. no NavigationTree candidate, but contribution exports exist -> use an empty
   root tree and let addImplicitRootSlots() synthesize context-free roots;
4. multiple NavigationTree candidates -> ambiguity diagnostic.

An empty authored root tree is valid:

  const root: NavigationTree = [];

It does NOT imply that explicit empty slots can be inferred. An empty extension
point still requires routeSlot('id').
*/
