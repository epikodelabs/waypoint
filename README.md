# Waypoint

> **The client shouldn't know about navigation it isn't allowed to use.**

Waypoint is a typed Angular navigation library built around a different assumption
than traditional client-side routers: **navigation is runtime configuration, not
a static application asset**.

Instead of shipping the complete route graph to every browser and relying on
guards to deny access, Waypoint allows navigation to be **compiled, filtered by
the server, and delivered on demand**. Clients receive only the navigation they
are authorized to discover.

---

# Why Waypoint?

Most routers answer one question:

> "How do I navigate between pages?"

Waypoint answers another one first:

> "Which pages should this browser even know exist?"

This makes Waypoint particularly suitable for:

- enterprise applications
- multi-tenant systems
- role-based applications
- feature licensing
- plugin architectures
- server-driven UI

---

# Highlights

- Server-driven navigation
- Typed params and query strings
- Function-based navigation lifecycle
- Layout composition
- Named outlets
- Lazy loading
- Standalone Angular
- Atomic runtime configuration
- Explicit revalidation
- Compiler-driven navigation artifacts

---

# Installation

```bash
npm install @epikodelabs/waypoint
```

---

# Quick start

```ts
const routes = [
  layout('/app', AppShellComponent, [
    route(
      '/projects/:projectId',
      frame(ProjectPage, {
        prepare: [
          ctx => ({
            project: inject(ProjectStore)
              .load(ctx.params.projectId),
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

Everything about a destination lives together:

- URL
- lifecycle
- schemas
- rendering
- identity

---

# Core concepts

## route()

Describes a destination.

Owns:

- path
- params
- query
- redirects
- navigation identity

## frame()

Connects rendering with navigation lifecycle.

Lifecycle includes:

- prepare
- beforeEnter
- beforeLeave
- afterEnter

## layout()

Composes application shells without turning layouts into navigation state.

---

# Dynamic configuration

Navigation is runtime configuration.

```ts
const changed = router.replaceConfiguration({
  routes,
  transitions,
});

if (changed) {
  await router.revalidate();
}
```

`replaceConfiguration()` installs a new navigation model atomically.

`revalidate()` decides whether the current URL should be matched again.

Keeping those operations separate allows applications to update permissions,
feature flags, server state, and navigation in a single transaction.

---

# Immutable routes

Route definitions should be treated as immutable configuration values.

Prefer replacing route objects rather than mutating them.

This keeps runtime caching deterministic and makes configuration replacement
predictable.

---

# Server-driven navigation

Author routes once.

```
TypeScript routes
        ↓
Waypoint compiler
        ↓
Navigation artifacts
        ↓
Authorization
        ↓
Filtered route graph
        ↓
Browser
```

The browser receives only the navigation it is allowed to discover.

---

# Example applications

## App1

Demonstrates Waypoint as a traditional client-side router with:

- layouts
- lifecycle
- lazy loading
- named outlets
- typed navigation

## App2

Demonstrates server-driven navigation.

The browser starts with no route graph.

Navigation artifacts are requested from the server, installed with
`replaceConfiguration()`, then activated using `revalidate()`.

---

# Philosophy

Waypoint intentionally keeps the public API small.

The complexity belongs in the compiler and navigation pipeline—not in
application code.

Applications describe navigation once.

Waypoint derives everything else.

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
