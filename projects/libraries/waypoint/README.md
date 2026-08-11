# Waypoint

> **Server-side routing for Angular.**

Waypoint is an Angular routing library where the server controls which routes
and route artifacts are delivered to the browser.

Traditional client-side routers usually ship the application's route graph and
use guards to decide whether a navigation may continue. Waypoint can keep
protected navigation outside the initial client application: authored routes
are compiled into server metadata and independently deliverable browser
artifacts, authorized on the server, and delivered only when the current client
is allowed to receive them.

Server-side routing in Waypoint is not the same thing as server-side rendering
(SSR). Angular may still render in the browser or use SSR. The term describes
**where route visibility and route-code delivery are controlled**.

---

# Why Waypoint?

Most client routers answer:

> "Can this client activate this route?"

Waypoint can answer an earlier question on the server:

> "Should this client receive this route at all?"

That distinction matters when the route map itself reveals application
structure or when protected route code should not be part of the browser's
initially available application artifacts.

Waypoint is particularly suited to applications with:

- role- or permission-based route delivery
- multi-tenant navigation
- feature licensing
- protected administration areas
- independently owned route branches
- server-controlled application composition

---

# How it works

Author navigation once in TypeScript.

```text
TypeScript navigation
        ↓
Waypoint compiler
        ↓
Semantic navigation model
        ↓
Server authorization metadata + isolated browser artifacts
        ↓
Server authorization
        ↓
Allowed route artifacts
        ↓
Browser runtime
```

The server can resolve the requested URL against generated navigation metadata,
evaluate the route policy, and expose only the artifact required for the
allowed navigation. The browser installs delivered navigation atomically and
revalidates the current URL against its updated configuration.

---

# Highlights

- Server-side route authorization and delivery
- Compiler-generated isolated browser artifacts
- Typed params and query strings
- Function-based navigation lifecycle
- Layout composition
- Route ownership with `routeSlot()` and `routesFor()`
- Named outlets
- Lazy loading
- Standalone Angular
- Atomic runtime configuration
- Explicit revalidation

---

# Installation

```bash
npm install @epikodelabs/waypoint
```

---

# Route authoring

Waypoint keeps the declaration of a destination together:

```ts
const routes = [
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

A destination can describe its URL, typed schemas, rendering, lifecycle,
identity, policy, and providers without spreading routing behavior across guard
and resolver classes.

---

# Route ownership

Large applications can declare extension boundaries without duplicating one
large route tree.

```ts
export const routes = [
  layout('/app', AppShellComponent, [
    routeSlot('administration'),
  ]),
];
```

A separately owned route set targets that slot:

```ts
export const administrationRoutes = routesFor(
  'administration',
  [
    route('/users', UsersPage, {
      policy: {
        roles: ['admin'],
      },
    }),
  ],
);
```

The compiler preserves ownership and inherited path, layout, provider, and
policy context while deriving server metadata and browser artifacts from the
same authored navigation model.

---

# Core concepts

## `route()`

Defines a navigable destination, including path, params, query, identity,
policy, providers, and rendering metadata.

## `frame()`

Connects a view with navigation lifecycle behavior:

- `beforeLeave`
- `beforeEnter`
- `prepare`
- `afterEnter`

## `layout()`

Adds inherited path, rendering, provider, policy, and lifecycle context for
descendant navigation.

## `routeSlot()` and `routesFor()`

Define stable ownership boundaries for separately authored route branches.
They are navigation-composition concepts and are distinct from named rendering
outlets.

---

# Runtime configuration

Delivered navigation is installed as runtime configuration.

```ts
const changed = router.replaceConfiguration({
  routes,
  transitions,
});

if (changed) {
  await router.revalidate();
}
```

`replaceConfiguration()` replaces the active navigation model atomically.

`revalidate()` explicitly rematches the current URL when permissions, server
state, feature availability, or delivered route configuration changes.

Keeping installation and revalidation separate lets applications coordinate
navigation changes with other application state instead of implicitly forcing a
transition on every configuration update.

---

# Compiler

The Waypoint compiler turns authored TypeScript navigation into a validated,
AST-free semantic model and derives delivery artifacts from it.

The current compiler pipeline includes:

```text
TypeScript source
→ semantic resolution
→ Navigation IR
→ expansion and validation
→ artifact planning
→ isolated browser bundles
→ server index and shards
→ delivery manifest
```

Protected route sets can become independently deliverable browser artifacts.
Generated server metadata retains the path, policy, ownership, dependency, and
artifact information needed to authorize and resolve delivery without shipping
the complete protected route catalog to the client.

---

# Example applications

## App1

Exercises the Waypoint runtime surface directly, including layouts, lifecycle,
lazy loading, named outlets, and typed navigation.

## App2

Exercises Waypoint's server-side routing model. The browser starts with the
public shell, while protected navigation is resolved against generated server
metadata and loaded from authorized compiler artifacts.

---

# Philosophy

Waypoint keeps application route authoring declarative and moves delivery
complexity into the compiler and server integration.

Applications describe navigation once. The compiler derives the representations
needed by the browser and server without changing the navigation language's
meaning.

---

# Roadmap

- richer compiler diagnostics
- plugin navigation
- artifact visualization
- devtools support
- Routty integration
- Switchboard integration

---

# License

MIT
