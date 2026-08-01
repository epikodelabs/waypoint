# @epikodelabs/waypoint

`@epikodelabs/waypoint` is a typed Angular routing library for flat route definitions, layout composition, and frame-based lifecycle hooks.

It is designed to keep route identity, URL shape, rendering, and lifecycle together.

## Core ideas

### Path

`path` is the URL contract. It is used for matching and link generation.

### Name

`name` is the app-level identity for a primary route. It exists so application code can address a route symbolically instead of coupling everything to literal URLs.

Typical uses:

- `router.navigate({ name: 'settings' })`
- `router.navigateTo.settings(...)`
- `router.hrefTo.settings(...)`
- `[routerLink]="{ name: 'settings' }"`

### Frame

A `frame` wraps a component together with route lifecycle hooks:

- `beforeEnter`
- `beforeLeave`
- `prepare`
- `afterEnter`

This replaces the need to scatter route behavior across Angular guard and resolver classes.

## Route model

Primary routes define navigation behavior. Secondary outlet entries exist only to render additional content for the same matched primary route.

That means:

- primary routes may have `name`
- secondary outlet routes should stay subordinate to the primary route
- layouts compose UI shells, not navigation state machines

## Example

```ts
import { inject } from '@angular/core';
import { frame, layout, route, s, type StreamixRoutes } from '@epikodelabs/waypoint';

const projectRoute = route(
  '/projects/:projectId',
  frame(ProjectPage, {
    beforeEnter: [
      () => inject(SessionService).authenticated()
        ? true
        : { redirectTo: '/auth/login', replace: true },
    ],
    prepare: [
      context => ({
        project: inject(ProjectStore).load(
          Number(context.params['projectId'] ?? 0),
        ),
      }),
    ],
    afterEnter: [
      route => inject(AnalyticsService).trackProjectVisit(route.path),
    ],
  }),
  {
    name: 'project',
    paramsSchema: {
      projectId: s.number({ min: 1 }),
    },
    querySchema: {
      tab: s.string('overview'),
    },
  },
);

export const routes = [
  layout('/app', AppShellComponent, [
    projectRoute,
    route('/projects/:projectId', ProjectSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
] as const satisfies StreamixRoutes;
```

## Why this shape

Waypoint tries to keep the model simple:

- URL matching by `path`
- app-level addressing by `name`
- lifecycle by `frame`
- shell composition by `layout`

That gives you one route definition instead of separate route config, resolver classes, guard classes, and ad hoc data-loading conventions.

## Testing

This workspace uses the Testify Jasmine harness for library specs:

```bash
npm test
```

## Demo app

See `projects/apps/app1/src/app/app.routes.ts` for the current reference setup using:

- primary routes with typed params and query schemas
- frame-based `prepare` and guards
- lazy routes
- a shell layout
- a coordinated `sidebar` outlet
