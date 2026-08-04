# Waypoint

Waypoint is a typed Angular navigation library built around a simple idea:

**the client shouldn't know about navigation it isn't allowed to use.**

Most Angular applications ship the entire route graph to every browser. Authentication and authorization decide whether a user may *enter* a route, but every route already exists in the client. Open DevTools, inspect bundles, or browse lazy imports and you can often discover areas of an application you were never supposed to know existed.

Waypoint takes a different approach.

Routes are authored once, compiled into navigation artifacts, and can be delivered by the server on demand. Every user receives only the navigation they're allowed to discover. Unauthorized destinations aren't merely blocked—they simply aren't part of the client's navigation model.

The result is an architecture that scales naturally to applications with large route graphs, tenant-specific functionality, enterprise permissions, and feature licensing, while keeping the developer experience familiar to anyone who has used Angular Router.

The best part? You don't have to give up everything you already like about routing. Waypoint still speaks fluent URLs—paths, redirects, layouts, lazy loading, typed params, typed query strings, and named navigation—it simply treats the server as the authority for what navigation exists.

## Why you'll like it

- **Server-driven navigation.** Clients receive only the routes they're authorized to discover instead of downloading the application's complete navigation graph.
- **Typed from end to end.** Params and query strings are declared once using a compact schema builder (`s.string`, `s.number`, `s.boolean`, `s.array`, `s.date`) and their types flow through navigation helpers, lifecycle hooks, and generated links.
- **One destination. One definition.** URL, rendering, lifecycle, schemas, and application identity live together instead of being scattered across route configs, guards, resolvers, and components.
- **Function-based lifecycle.** `prepare`, `beforeEnter`, `beforeLeave`, and `afterEnter` are just functions. Inject services, load data, redirect, or cancel navigation without framework ceremony.
- **Shell composition.** `layout(...)` composes application chrome around groups of routes without turning layouts into navigation state.
- **Standalone-first.** Designed for modern Angular applications instead of carrying years of routing history.

Waypoint intentionally stays close to the routing model Angular developers already know. The difference isn't the API—it's the architecture behind it.

## Installation

```bash
npm install @epikodelabs/waypoint
```

Waypoint is built for modern standalone Angular applications and depends only on `@angular/core` and `@angular/common`.

## Quick start

Here's a realistic route definition. Don't worry about every option just yet—the concepts underneath it are deliberately small.

```ts
import { inject } from '@angular/core';
import {
  frame,
  layout,
  route,
  s,
  type NavigationTree,
} from '@epikodelabs/waypoint';

const projectRoute = route(
  '/projects/:projectId',
  frame(ProjectPage, {
    beforeEnter: [
      () =>
        inject(SessionService).authenticated()
          ? true
          : {
              redirectTo: '/auth/login',
              replace: true,
            },
    ],

    prepare: [
      context => ({
        project: inject(ProjectStore).load(
          context.params.projectId,
        ),
      }),
    ],

    afterEnter: [
      route =>
        inject(AnalyticsService)
          .trackProjectVisit(route.path),
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
  ]),
] as const satisfies NavigationTree;
```

Read it out loud and it almost explains itself:

*"there's a project page at `/projects/:projectId`, it's known as `project`, users must be authenticated before entering it, the project loads before rendering, and visits are tracked after navigation completes."*

That's the entire philosophy behind Waypoint: one destination, one definition.

## Core ideas

Waypoint is built around four small concepts.

Once these click, everything else is detail.

### `route(path, frame, options)`

A route describes a public destination.

It owns:

- the public URL
- typed params
- typed query strings
- application identity (`name`)
- redirects
- navigation behavior

### `frame(component, options)`

A frame binds a component to its lifecycle.

This is where navigation behavior lives:

- `prepare`
- `beforeEnter`
- `beforeLeave`
- `afterEnter`

Each hook is simply a function.

Inject services, fetch data, redirect, or cancel navigation without implementing framework-specific interfaces.

### `layout(path, component, entries)`

Layouts compose application shells.

They provide navigation bars, side panels, and shared chrome around groups of routes without becoming part of the route identity themselves.

### Typed navigation

Because routes declare their schemas once, Waypoint generates fully typed navigation helpers.

```ts
router.navigateTo.project({
  params: {
    projectId: 42,
  },
});
```

Required params, optional query values, and generated hrefs all stay synchronized with the route definition.

## Server-driven navigation

Waypoint's defining feature is that routes can be compiled into server-side navigation artifacts.

Instead of treating routing as a static client configuration, Waypoint allows the server to determine which navigation branches should be delivered for the current user.

Conceptually:

```
TypeScript routes

        ↓

Navigation compiler

        ↓

Server navigation artifacts

        ↓

Identity & authorization

        ↓

Authorized route graph

        ↓

Browser
```

This architecture makes it practical to build applications where navigation changes according to:

- permissions
- tenant
- subscription
- feature flags
- deployment
- environment

without shipping every possible destination to every client.

Waypoint does **not** replace authorization.

Servers must still authorize every request.

Waypoint simply reduces unnecessary disclosure of application structure by ensuring browsers only receive navigation they're expected to use.

## What the example application demonstrates

`projects/apps/app1` provides a complete reference application showing:

- typed params and query schemas
- layouts
- frame lifecycle
- lazy loading
- named outlets
- generated navigation helpers

`projects/apps/app2` demonstrates the server-driven navigation model, where the browser receives its route graph from the server instead of embedding the complete application navigation at build time.

## A note on scope

Waypoint intentionally focuses on navigation.

It supports familiar routing concepts such as URLs, redirects, layouts, lazy loading, typed parameters, and browser history while remaining considerably smaller than Angular Router's full feature surface.

Reach for Waypoint when you want:

- typed navigation
- modern standalone Angular APIs
- function-based lifecycle
- server-driven route delivery
- privacy-safer navigation architecture
- one destination definition instead of scattered routing infrastructure

We're excited about making navigation both simpler and more scalable, and we'd love for you to build with Waypoint.