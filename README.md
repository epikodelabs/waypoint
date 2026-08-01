# Waypoint Workspace

This is an Angular routing workspace centered on the `@epikodelabs/waypoint` library.

The library is built around three ideas:

- `path` matches URLs
- `name` identifies primary routes in the app model
- `frame` owns route lifecycle hooks

This keeps routing, typed navigation, and route lifecycle in one definition instead of spreading them across Angular guard and resolver classes.

## Model

In Waypoint, a route is a navigation contract. A primary route can define:

- `name`
- `path`
- typed `paramsSchema`
- typed `querySchema`
- component or lazy component
- frame hooks:
  - `beforeEnter`
  - `beforeLeave`
  - `prepare`
  - `afterEnter`

Layouts compose shells and shared UI without forcing the app into a deep route tree.

Named outlets are supported for coordinated multi-outlet rendering. Secondary outlet entries are subordinate to the primary route for the same path.

## Example

```ts
const workspaceRoute = route(
  '/workspace/:projectId',
  frame(WorkspacePage, {
    prepare: [
      context => ({
        snapshot: inject(DemoSessionService)
          .buildWorkspaceSnapshot(Number(context.params['projectId'] ?? 0)),
      }),
    ],
  }),
  {
    name: 'workspace',
    paramsSchema: {
      projectId: s.number({ min: 1 }),
    },
    querySchema: {
      view: s.string('overview'),
      page: s.number({ default: 1, min: 1 }),
    },
  },
);
```

That definition answers three separate questions in one place:

- what URL is this: `path`
- what route is this in the app: `name`
- what must happen around navigation: `frame`

## Workspace

- `projects/libraries/waypoint` - the routing library
- `projects/apps/app1` - demo app that exercises layouts, frames, typed navigation, and named outlets

## Development

Build the library:

```bash
ng build waypoint --configuration development
```

Run the demo app:

```bash
ng serve app1
```

## Tests

The library specs run with the Testify Jasmine harness.

Run the suite:

```bash
npm test
```

Interactive browser mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```
