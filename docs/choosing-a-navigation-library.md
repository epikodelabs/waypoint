# Choosing a Navigation Library

The navigation ecosystem consists of three libraries with a shared vocabulary but different navigation models.

They intentionally solve different problems.

All three libraries share the same design principles:

- typed navigation
- builder-style APIs
- layouts
- frames
- typed params and query schemas
- standalone-first Angular
- function-based lifecycle
- modern TypeScript

If you've learned one, the others will feel familiar.

The difference is **where navigation authority lives and how navigation itself is modeled**.

---

# Waypoint

**Server-side routing for Angular.**

Waypoint is designed for applications where the server should control which routes and route artifacts a browser is allowed to receive.

Routes are authored in TypeScript, compiled into server authorization metadata and browser artifacts, and delivered according to server-side policy. The client does not need to receive the complete protected route catalog up front.

Choose Waypoint when your application needs:

- server-authorized route delivery
- protected route artifacts
- role- or permission-based navigation
- deep linking and browser history
- layouts and named outlets
- typed URLs
- route lifecycle
- independently owned route branches

Waypoint still provides a familiar URL-based Angular routing runtime, but its defining feature is that route visibility and route-code delivery can be controlled before protected navigation reaches the browser.

---

# Routty

**The smallest possible router.**

Routty focuses on simplicity.

Instead of supporting every navigation scenario, it embraces flat route definitions with a tiny API surface.

Choose Routty when you want:

- minimal bundle size
- flat route tables
- straightforward applications
- libraries
- demos
- internal tools

If your application doesn't need advanced navigation concepts, Routty keeps everything intentionally small.

---

# Switchboard

**Navigation as a graph.**

Switchboard isn't centered around URLs.

Instead, applications are described as states connected by transitions.

Navigation becomes moving through a graph rather than matching paths.

This model is particularly well suited for:

- onboarding
- checkout
- installers
- editors
- workflow systems
- kiosk applications
- embedded applications
- state-driven experiences

Instead of asking

> "Which URL should I navigate to?"

you ask

> "Which state can I transition to?"

---

# Shared vocabulary

Although the navigation models differ, the ecosystem deliberately shares the same language.

```ts
route(...)
layout(...)
frame(...)
lazyRoute(...)
redirect(...)
```

Schemas are identical.

```ts
s.string(...)
s.number(...)
s.boolean(...)
s.array(...)
```

Lifecycle concepts remain familiar.

Moving between libraries shouldn't require relearning the API.

---

# Which library should I choose?

| If your application... | Choose |
|-------------------------|--------|
| needs server-controlled route visibility or route-code delivery | **Waypoint** |
| needs the smallest possible URL router | **Routty** |
| is built around workflows or state transitions | **Switchboard** |

Choose **Waypoint** when route authorization and delivery belong on the server.

Choose **Routty** when simplicity is the primary goal.

Choose **Switchboard** when navigation itself is part of the application's business logic.

---

# One philosophy, different models

These libraries are not editions of the same router.

Each optimizes for a different navigation problem.

Waypoint asks:

> Which routes should the server make available to this client?

Routty asks:

> What's the simplest way to reach this URL destination?

Switchboard asks:

> Which transition is valid from the current state?