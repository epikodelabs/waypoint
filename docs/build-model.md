# Waypoint build model

A normal Angular application keeps an explicit route-module convention:

```text
src/app/app.routes.ts
```

The file itself may be only an aggregation module:

```ts
export { publicRoutes } from './routes/public.routes';
export { applicationRoutes } from './routes/application.routes';
export { administrationRoutes } from './routes/administration.routes';
```

`app.config.ts` remains ordinary application code:

```ts
...provideRouter(routes, {
  resolveRoutes: createServerNavigationResolver(),
})
```

Waypoint-specific build behavior begins at the builder boundary.

The builder:

1. analyzes `app.routes.ts`;
2. prepares protected AOT sources;
3. generates host-only navigation/runtime inputs;
4. delegates the host build to Angular;
5. bundles protected code by authorization domain;
6. validates physical isolation;
7. publishes server delivery metadata atomically.

There is deliberately no automatic search for a route filename. Convention is
more predictable than filesystem heuristics, and `waypoint.entry` remains the
escape hatch for non-standard layouts.
