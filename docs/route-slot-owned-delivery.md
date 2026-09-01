# Slot-owned route-set delivery

`routeSlot()` may declare where its `routesFor()` contribution is authored:

```ts
routeSlot(
  'administration',
  () =>
    import('./admin.route')
      .then(module => module.administrationRoutes),
)
```

The loader is the authored ownership edge.

In a server-delivery build:

1. the compiler validates that the selected export is an exported
   `routesFor('administration', ...)` contribution;
2. hierarchical slot ownership still determines the dependency graph;
3. the parent protected artifact does **not** bundle the child route-set module;
4. the server independently authorizes and delivers the child artifact.

A loader-less slot remains valid:

```ts
routeSlot('application')
```

This is useful for runtime/server supplied root ownership points.

The dynamic import is therefore source-level ownership metadata in protected
server builds, while still leaving room for direct client-only loading semantics
later without changing the route language.