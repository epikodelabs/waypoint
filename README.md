# @epikodelabs/waypoint

**Privacy-first routing for Angular.**

Waypoint lets the server decide not only whether a route can be activated, but whether the browser should receive that route and its code at all.

```bash
npm install @epikodelabs/waypoint
```

---

## Why Waypoint?

Traditional client-side routers usually ship the application's route graph to the browser and use guards to decide whether navigation may continue.

That answers:

> Can this client activate this route?

Waypoint can move the decision earlier:

> Should this client receive this route at all?

For many applications, those are very different questions.

Consider an application with:

```text
/app
/app/projects
/app/reports
/app/admin
/app/internal-tools
```

A client-side guard can prevent a user from entering `/app/admin`.

But the browser may still know that `/app/admin` exists, and protected application code may still be represented somewhere in the client build.

Waypoint is designed for applications where route visibility and route-code delivery can be controlled by the server.

```text
Authored navigation
        │
        ▼
Waypoint compiler
        │
        ├── server navigation metadata
        │
        └── independently deliverable browser artifacts
                         │
                         ▼
                     Server
                         │
                  authorize request
                         │
                         ▼
                allowed artifacts only
                         │
                         ▼
                      Browser
```

The browser does not need the complete protected navigation model up front.

This is **not server-side rendering**.

Angular can still render entirely in the browser, use SSR, or use another rendering strategy. Waypoint's server-side model concerns **route visibility, authorization, and artifact delivery**.

---

## Route authoring stays simple

Waypoint does not make ordinary routing look like infrastructure.

```ts
import {
  frame,
  layout,
  route,
  s,
} from '@epikodelabs/waypoint';

export const routes = [
  layout('/app', AppShellComponent, [
    route(
      '/projects/:projectId',
      frame(ProjectPage, {
        prepare: [
          context => ({
            project: inject(ProjectStore)
              .load(context.params.projectId),
          }),
        ],
      }),
      {
        paramsSchema: {
          projectId: s.number(),
        },
      },
    ),
  ]),
];
```

A destination can keep its URL, rendering, typed parameters, lifecycle, providers, policy, and identity together.

No resolver class for loading data.

No guard class just to express navigation lifecycle.

No second representation of the same route merely because the server needs to understand it.

---

## One navigation model

Waypoint starts with authored TypeScript navigation.

The compiler derives the representations required by the browser and server.

```text
TypeScript
    │
    ▼
Semantic navigation model
    │
    ▼
Navigation IR
    │
    ├── validation
    ├── artifact planning
    ├── server metadata
    └── isolated browser artifacts
```

Application navigation remains the authored source of truth.

The compiler does the splitting.

---

## Layouts

Layouts compose application structure without forcing routing behavior into components.

```ts
const routes = [
  layout('/app', AppShellComponent, [
    route('/projects', ProjectsPage),
    route('/settings', SettingsPage),
  ]),
];
```

Layouts can contribute inherited navigation context such as rendering, providers, policy, and lifecycle.

They can be nested when the application structure requires it.

---

## Navigation lifecycle

Waypoint uses functions for navigation lifecycle.

```ts
route(
  '/projects/:projectId',
  frame(ProjectPage, {
    beforeEnter: [
      context => {
        // before activation
      },
    ],

    prepare: [
      async context => ({
        project: await loadProject(context.params.projectId),
      }),
    ],

    afterEnter: [
      context => {
        // committed
      },
    ],

    beforeLeave: [
      context => {
        // leaving the destination
      },
    ],
  }),
);
```

The core lifecycle is:

```text
beforeLeave
beforeEnter
prepare
commit
afterEnter
```

Lifecycle belongs to the destination being navigated, rather than being scattered across unrelated guard and resolver classes.

---

## Typed URLs

Parameters and query state can be described with schemas.

```ts
route('/projects/:projectId', ProjectPage, {
  paramsSchema: {
    projectId: s.number(),
  },

  searchSchema: {
    page: s.number(),
    archived: s.boolean(),
  },
});
```

Navigation code receives parsed values rather than repeatedly converting URL strings throughout the application.

---

## Route ownership

Large applications should not require one enormous route file.

Waypoint provides explicit ownership boundaries with `routeSlot()` and `routesFor()`.

The application can declare where independently owned navigation belongs:

```ts
export const routes = [
  layout('/app', AppShellComponent, [
    route('/projects', ProjectsPage),

    routeSlot('administration'),
  ]),
];
```

Another feature can own that navigation:

```ts
export const administrationRoutes = routesFor(
  'administration',
  [
    route('/users', UsersPage, {
      policy: {
        roles: ['admin'],
      },
    }),

    route('/audit', AuditPage, {
      policy: {
        permissions: ['audit.read'],
      },
    }),
  ],
);
```

`routeSlot()` and `routesFor()` describe **navigation ownership**.

They are not rendering outlets.

This distinction lets the compiler preserve ownership while deriving independently deliverable artifacts and server authorization metadata.

---

## Server-controlled navigation

This is where Waypoint differs most from a conventional Angular router.

Protected route sets can be compiled into independently deliverable browser artifacts.

The server retains the information needed to resolve and authorize them:

```text
path
policy
ownership
artifact identity
dependencies
redirect relationships
```

The browser does not need that complete protected catalog.

When navigation reaches a destination that is not currently installed, the browser can ask the server to resolve it.

```text
Browser
   │
   │  /app/admin
   ▼
Server router
   │
   ├── match
   ├── authorize
   ├── resolve redirects
   ├── authorize dependencies
   └── build delivery plan
   │
   ▼
Authorized artifacts
   │
   ▼
Browser
   │
   ├── load
   ├── validate
   ├── install
   └── revalidate
```

Unknown and unauthorized protected destinations can therefore remain indistinguishable at the browser/server boundary.

---

## Server router

Waypoint provides a framework-neutral server router.

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});

const serverRouter = createServerRouter({
  loadSnapshot: source.loadSnapshot,

  moduleUrlFor: artifact =>
    `/api/navigation/modules/${artifact.artifactKey}/${artifact.hash}`,
});
```

Resolve navigation for the current principal:

```ts
const resolution = await serverRouter.resolve(
  requestedPath,
  principal,
);
```

The server router owns:

- path matching
- shard selection
- route-set resolution
- authorization
- internal redirect resolution
- dependency ordering
- complete-chain authorization
- browser delivery planning

Authorization applies to the complete required artifact chain before the delivery plan is returned.

---

## Express integration

Waypoint also provides an Express adapter.

```ts
const navigation = createExpressServerRouterHandlers({
  router: serverRouter,

  principalFrom: request =>
    request.principal,

  artifactPathFor: artifact =>
    resolveOutputPath(artifact.file),
});

app.get(
  '/api/navigation/resolve',
  navigation.resolve,
);

app.get(
  '/api/navigation/modules/:artifactKey/:hash',
  navigation.module,
);
```

Express itself is not a runtime dependency of the Waypoint package.

The adapter targets only the request/response surface it needs, leaving authentication middleware, Express version, filesystem layout, and application composition to the host.

---

## Browser delivery

The browser counterpart is `createServerNavigationResolver()`.

```ts
import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

const resolveRoutes =
  waypoint.createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });

provideRouter(routes, {
  resolveRoutes,
});
```

The resolver:

1. asks the server to resolve the destination;
2. validates the returned delivery plan;
3. loads authorized artifacts in dependency order;
4. validates their `routesFor()` contributions;
5. installs the navigation atomically;
6. continues navigation against the resulting configuration.

Artifacts are content-addressed by artifact identity and hash.

Shared runtime modules such as Angular and Waypoint itself remain owned by the host application so independently delivered artifacts do not create duplicate framework runtimes or identity-sensitive DI tokens.

---

## Runtime configuration

Navigation delivered by the server becomes runtime configuration.

Waypoint keeps configuration replacement and navigation revalidation separate.

```ts
const changed = router.replaceConfiguration({
  routes,
  transitions,
});

if (changed) {
  await router.revalidate();
}
```

`replaceConfiguration()` changes the active navigation model atomically.

`revalidate()` explicitly rematches the current URL.

This is useful when:

- permissions change;
- licensing changes;
- server-delivered navigation changes;
- tenant state changes;
- feature availability changes.

Configuration updates therefore do not need to cause an implicit navigation at an arbitrary point in application state.

---

## Revocation

Delivered routes are active navigation configuration, not permanent membership in the application.

When authorization changes:

```ts
await router.revalidate();
```

Waypoint can discard server-delivered route contributions, preserve authored navigation, resolve the current destination again, and install the newly authorized configuration atomically.

There is an important distinction:

```text
artifact delivery
    → whether code may enter the browser

route revocation
    → whether delivered code participates
      in navigation now
```

JavaScript already downloaded by a browser cannot meaningfully be "undownloaded."

Waypoint does not pretend otherwise.

Instead, it controls delivery before code enters the browser and controls whether previously delivered route contributions remain part of the active navigation model.

---

## Principal and tenant changes

Changing permissions for the same principal and replacing the principal are different security boundaries.

For permission changes:

```text
same principal
    ↓
authorization changed
    ↓
revoke + revalidate
```

For a new user or tenant, the recommended boundary is stronger:

```text
server session switch
        ↓
resolve authorized landing destination
        ↓
full document navigation
        ↓
fresh JavaScript realm
```

This avoids treating a completely different authorization identity as merely another incremental route update.

---

## Atomic publication

Compiler output can be exposed to the server through immutable routing snapshots.

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});
```

A snapshot represents one routing generation.

Waypoint loads the required compiler metadata before publishing that generation. If refresh fails, the previous valid snapshot remains active.

That prevents navigation from observing a partially published compiler output.

---

## Navigation results

Waypoint distinguishes ordinary routing outcomes from execution failures.

```ts
const navigated = await router.navigate(...);
```

The promise resolves `true` when navigation commits.

It resolves `false` for expected non-commit outcomes such as:

- blocked navigation
- not found
- cancelled or superseded navigation
- ignored same-URL navigation

It rejects when navigation itself fails, including failures during:

- route loading
- parsing
- preparation
- rendering or commit
- external dispatch
- server delivery

Server-resolution failures remain failures rather than being silently converted into "not found." An unavailable authorization service should not accidentally become an authorization decision.

---

## Highlights

- Privacy-first server-controlled route delivery
- Independently deliverable route artifacts
- Server-side authorization metadata
- Typed params and query state
- Layout composition
- Function-based lifecycle
- `prepare()` data loading
- Route ownership with `routeSlot()` / `routesFor()`
- Named outlets
- Lazy loading
- Route-specific providers
- Atomic runtime configuration
- Explicit revalidation and revocation
- Framework-neutral server router
- Express adapter
- Standalone Angular support

---

## Core API

### `route()`

Defines a navigable destination.

```ts
route('/projects/:id', ProjectPage);
```

---

### `frame()`

Associates rendering with navigation lifecycle.

```ts
frame(ProjectPage, {
  beforeEnter,
  prepare,
  afterEnter,
  beforeLeave,
});
```

---

### `layout()`

Composes inherited application structure.

```ts
layout('/app', AppShell, [
  route('/projects', ProjectsPage),
]);
```

---

### `routeSlot()`

Declares a navigation ownership boundary.

```ts
routeSlot('administration');
```

---

### `routesFor()`

Contributes separately owned navigation to a slot.

```ts
routesFor('administration', [
  route('/users', UsersPage),
]);
```

---

### `revalidate()`

Explicitly reevaluates the current destination against the current authorization and navigation configuration.

```ts
await router.revalidate();
```

---

## What Waypoint does not claim

Waypoint improves control over **route discovery and code delivery**.

It is not a substitute for server-side authorization of application data or APIs.

A route being absent from the browser does not make an unprotected backend endpoint secure.

Applications should still authorize every protected server operation independently.

Waypoint also cannot erase JavaScript that has already been downloaded by a browser. Revocation removes delivered navigation from the active route model; principal replacement should use a fresh document realm when that distinction matters.

---

## When should I use Waypoint?

Waypoint is particularly useful for applications with:

- administration areas
- role- or permission-specific functionality
- multi-tenant navigation
- licensed features
- independently owned application branches
- server-composed applications
- route structures that should not be globally exposed
- protected frontend code that should be delivered selectively

If your entire route map is intentionally public and ordinary client-side guards are sufficient, a conventional router may be simpler.

Waypoint is for applications where **what the browser is allowed to know** is part of the architecture.

---

## Examples

The repository contains two complementary examples.

### Client

Demonstrates the standalone browser runtime:

- layouts
- lifecycle
- lazy loading
- named outlets
- typed navigation

### Server

Demonstrates server-controlled navigation:

```text
public application shell
        ↓
unresolved protected destination
        ↓
server authorization
        ↓
authorized compiler artifact
        ↓
runtime route installation
```

---

## Design philosophy

Waypoint keeps application navigation declarative and pushes delivery complexity into infrastructure designed to handle it.

**Author navigation once.**

Let the compiler derive what the browser and server need.

Keep authorization on the server.

Keep runtime installation atomic.

Make revalidation explicit.

And do not send the browser navigation it does not need to know about.

---

## Documentation

For protocol-level details, see:

- `docs/server-delivery-contract.md`

It defines the normative server/browser delivery protocol, artifact resolution behavior, HTTP semantics, authorization requirements, and publication model.

---

## License

MIT