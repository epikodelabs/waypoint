# Waypoint

**Server-authorized routing for Angular.**

Waypoint is an Angular router for applications where route authorization
is also a **code-delivery boundary**.

Most client routers answer:

> Can the current user activate this route?

Waypoint can additionally answer:

> Should the browser receive this route and its implementation at all?

That distinction drives the architecture.

``` text
                Waypoint Builder
                      │
             ┌────────┴────────┐
             │                 │
        public host      protected modules
             │                 │
             │                 ▼
             │          Waypoint Server
             │          authorization
             │                 │
             └──── Browser ◄───┘
                       │
                       ▼
                 Waypoint Client
```

**Builder isolates. Server authorizes. Client navigates.**

------------------------------------------------------------------------

## The idea

Consider an application with public, user, and administrative areas:

``` text
/
/login
/app
/app/projects
/app/admin
```

With ordinary lazy loading, the administrative code can still be a
publicly addressable deployment artifact even if a guard prevents
navigation to it.

Waypoint allows the administrative branch to become a **protected build
artifact** instead.

The public browser application contains enough information to reach an
ownership boundary, but not necessarily the protected route
implementation behind it. When navigation reaches that boundary, the
client asks the server to resolve the destination. The server evaluates
the current principal and returns only the route artifacts that
principal is allowed to receive.

This is not a replacement for API authorization. Backend operations must
still authorize every protected request independently.

------------------------------------------------------------------------

## Three parts, three responsibilities

Waypoint deliberately separates build-time isolation, server
authorization, and browser navigation.

### Builder

The builder understands route ownership and authorization while
compiling the Angular application.

It:

-   analyzes authored navigation;
-   validates authorization boundaries;
-   separates protected branches from the public host;
-   compiles Angular code for protected route artifacts;
-   tracks artifact dependencies;
-   verifies host isolation;
-   publishes the resulting generation atomically.

A typical output looks like:

``` text
dist/app/
├── browser/
│   └── ... public Angular application
│
├── protected/
│   ├── application-core-<hash>.js
│   ├── administration-core-<hash>.js
│   └── ...
│
└── .waypoint/
    └── server/
        └── server-index.json
```

`protected/` is intentionally outside the normal public browser assets.

The directory name itself provides no security. The deployment must
expose those files only through the authorized server delivery path.

### Server

The server owns disclosure.

Given a URL and a principal, it determines:

``` text
Which route matches?
        │
        ▼
Which route contribution owns it?
        │
        ▼
Which policy applies?
        │
        ▼
Which artifacts are required?
        │
        ▼
Is the complete chain authorized?
        │
        ▼
Return a delivery plan
```

The server does not trust the browser to decide what it may load.

### Client

The client owns navigation state.

When a destination requires server-delivered configuration, it:

1.  resolves the destination with the server;
2.  loads the authorized artifact chain;
3.  validates and installs the returned route contributions;
4.  prepares the navigation;
5.  commits the resulting UI atomically.

Navigation remains cancellable while this happens. A stale request
cannot finish later and replace a newer navigation.

------------------------------------------------------------------------

# Authoring routes

Waypoint keeps normal route definitions close to the component they
describe.

``` ts
import {
  layout,
  route,
  s,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export const routes = [
  layout('/app', AppShellComponent, [
    route('/projects/:projectId', ProjectPage, {
      name: 'project',

      paramsSchema: {
        projectId: s.number({ min: 1 }),
      },

      querySchema: {
        tab: s.string('overview'),
      },
    }),
  ]),
] as const satisfies NavigationTree;
```

Routes may describe rendering, identity, schemas, policy, providers, and
navigation lifecycle without requiring separate guard or resolver
classes for every destination.

------------------------------------------------------------------------

## Lifecycle

`frame()` associates a component with route lifecycle behavior.

``` ts
const projectRoute = route(
  '/projects/:projectId',

  frame(ProjectPage, {
    beforeEnter: [
      context =>
        session.canOpenProject(
          context.params.projectId,
        ),
    ],

    prepare: [
      async context => ({
        project:
          await projects.load(
            context.params.projectId,
          ),
      }),
    ],

    afterEnter: [
      context =>
        analytics.page(context.path),
    ],
  }),

  {
    name: 'project',

    paramsSchema: {
      projectId: s.number({ min: 1 }),
    },
  },
);
```

Navigation is conceptually:

``` text
beforeLeave
    ↓
beforeEnter
    ↓
prepare
    ↓
commit
    ↓
afterEnter
```

Preparation happens before the new UI becomes active.

------------------------------------------------------------------------

# Typed navigation

Named routes produce typed navigation helpers.

``` ts
await router.navigateTo.project({
  params: {
    projectId: 42,
  },

  query: {
    tab: 'activity',
  },
});
```

URLs can be generated without navigating:

``` ts
const href = router.hrefTo.project({
  params: {
    projectId: 42,
  },
});
```

The route name, parameters, and query values are checked against the
configured navigation tree.

Incoming URLs are validated through the same schema model rather than
being exposed as untyped strings everywhere in the application.

------------------------------------------------------------------------

# Protected route ownership

Protected navigation is organized with two concepts:

``` text
routeSlot()
routesFor()
```

A `routeSlot()` declares an ownership point.

A `routesFor()` contribution supplies navigation owned by that point.

For example, the public host may contain only:

``` ts
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
```

The application branch can then be authored independently:

``` ts
export const applicationRoutes = routesFor(
  'application',
  'application-core',
  [
    layout('/app', AppShellComponent, [
      route('/projects', ProjectsPage),

      routeSlot(
        'administration',
        () =>
          import('./administration.routes')
            .then(
              module =>
                module.administrationRoutes,
            ),
      ),
    ]),
  ],
);
```

And administration can be a separate contribution:

``` ts
export const administrationRoutes = routesFor(
  'administration',
  'administration-core',
  [
    route('/admin', AdminPage, {
      name: 'admin',

      policy: {
        roles: ['admin'],
        permissions: ['admin:read'],
      },
    }),
  ],
);
```

The important relationship is:

``` text
routeSlot('application')
        │
        ▼
routesFor(
  'application',
  'application-core',
  ...
)
        │
        ▼
routeSlot('administration', loader)
        │
        ▼
routesFor(
  'administration',
  'administration-core',
  ...
)
```

The loader on a nested `routeSlot()` is not merely a conventional lazy
import. It expresses the authored ownership edge that the builder uses
when planning protected artifacts.

A root slot can remain loader-less when its contribution is supplied
through server delivery:

``` ts
routeSlot('application')
```

------------------------------------------------------------------------

# Authorization follows ownership

Waypoint does not treat policies as unrelated annotations on arbitrary
chunks.

Protected ownership forms an authorization hierarchy.

A child contribution may preserve or strengthen the authorization
inherited from its parent, but it must not weaken it.

``` text
application
  authenticated user
        │
        ▼
administration
  authenticated user
  + admin role
        │
        ▼
security
  authenticated user
  + admin role
  + security:manage
```

The builder uses this relationship to keep three things aligned:

``` text
route ownership
      │
      ▼
artifact dependency
      │
      ▼
authorization dependency
```

That is a core Waypoint invariant.

A protected child cannot depend on its parent for delivery while
simultaneously claiming a broader audience than that parent.

------------------------------------------------------------------------

# Why build-time analysis matters

Separating route arrays is not enough to protect Angular code.

Components, directives, providers, and other declarations introduce
their own dependency graph. A shared Angular declaration can
accidentally connect two authorization domains even when the route
definitions themselves look correctly separated.

Waypoint therefore checks the physical build graph as well as the
logical route graph.

The builder is responsible for detecting cases where protected
implementation would:

-   enter the public host;
-   cross incompatible authorization domains;
-   become reachable through an incorrectly shared declaration;
-   create an invalid artifact dependency.

The build fails instead of silently weakening the intended boundary.

This is one of the main differences between Waypoint and a router that
simply attaches role metadata to lazy routes.

------------------------------------------------------------------------

# Server delivery

The server consumes the metadata produced by the client build.

A server router is created from a coherent routing snapshot:

``` ts
const source =
  createServerRouterSnapshotSource({
    loadIndex,
    loadShard,
    revision: readPublishedRevision,
  });

const router = createServerRouter({
  loadSnapshot: source.loadSnapshot,

  moduleUrlFor: artifact =>
    `/api/navigation/modules/${artifact.artifactKey}/${artifact.hash}`,
});
```

A destination is resolved against the current principal:

``` ts
const result = await router.resolve(
  requestedPath,
  principal,
);
```

Resolution includes both route authorization and artifact dependencies.

The server must authorize the **complete required chain**, not only the
final route artifact.

``` text
application-core
       │
       ▼
administration-core
       │
       ▼
security-core
```

If `/app/admin/security` requires all three, all three must be valid for
the principal before the server returns the delivery plan.

------------------------------------------------------------------------

## Coherent server generations

Waypoint treats generated routing metadata as one published generation.

The server snapshot source loads the required metadata before exposing
the new snapshot. A failed or interrupted refresh should leave the
previous valid generation active rather than combining old and new
routing data.

The same principle exists in the builder:

``` text
write new artifacts
       ↓
write new metadata
       ↓
publish authoritative index
       ↓
clean stale output
```

A server should never observe an index that points to an artifact
generation that has not been published successfully.

------------------------------------------------------------------------

## Protected module responses

Protected module delivery should not reveal unnecessary information
about the protected catalog.

An unauthorized artifact, an unknown artifact, and a stale artifact can
all appear externally as:

``` text
404 Not Found
```

This is not the authorization mechanism. The server still performs real
authorization.

The uniform response simply avoids turning the endpoint into an
artifact-discovery oracle.

Principal-sensitive module responses should also avoid shared caching:

``` text
Cache-Control: private, no-store
Vary: Authorization, Cookie
```

------------------------------------------------------------------------

# Browser delivery

The client installs a server resolver into the router:

``` ts
import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

const resolveRoutes =
  createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideRouter(routes, {
      resolveRoutes,
      viewTransitions: true,
    }),
  ],
};
```

When the current configuration cannot resolve a destination, the server
resolver can extend it with authorized route contributions.

``` text
navigate('/app/admin')
        │
        ▼
not installed locally
        │
        ▼
server resolve
        │
        ▼
authorized artifact plan
        │
        ▼
load modules
        │
        ▼
install routesFor() contributions
        │
        ▼
continue navigation
```

------------------------------------------------------------------------

# One Angular runtime

Protected artifacts are independently delivered, but they are not
independent Angular applications.

They must use the same important runtime identities as the host.

Waypoint therefore provides a host-module bridge so protected artifacts
can use the host's Angular and Waypoint modules instead of embedding
private copies.

``` text
Browser host
├── Angular
├── Waypoint
└── shared runtime modules
        ▲
        │
        │ host bridge
        │
protected artifact
```

This preserves framework identity and avoids duplicating large runtime
dependencies in every protected artifact.

------------------------------------------------------------------------

# Navigation remains transactional

Server delivery makes route discovery asynchronous.

That means a navigation can be superseded while it is:

-   resolving with the server;
-   downloading an artifact;
-   installing configuration;
-   preparing components.

Waypoint treats cancellation as part of the navigation transaction.

``` text
navigation A
    │
    ├── server request
    │
navigation B starts
    │
    ├── A aborted
    │
    ▼
B prepares and commits
```

Navigation A is not allowed to complete later and replace B.

The same transaction model applies to history and named outlets.

If several outlets belong to one navigation, they prepare before the
navigation commits. A failure should not leave one outlet showing the
new destination while another still shows the old one.

------------------------------------------------------------------------

# Revalidation and revocation

Authorization can change while the application is running.

Waypoint makes configuration replacement and revalidation explicit:

``` ts
const changed =
  router.replaceConfiguration({
    routes,
    transitions,
  });

if (changed) {
  await router.revalidate();
}
```

This can be used when:

-   permissions change;
-   a licensed feature is enabled or removed;
-   tenant context changes;
-   the server returns a different navigation set.

There is an important limitation:

> JavaScript already delivered to a browser cannot be meaningfully
> undownloaded.

Waypoint can revoke a route contribution from active navigation, but it
cannot erase bytes already received by the browser.

For a complete principal or tenant replacement, a full document
navigation can be used to establish a fresh JavaScript realm.

------------------------------------------------------------------------

# Lazy loading is different

Waypoint still supports ordinary lazy routes:

``` ts
const reports = lazyRoute(
  '/reports',
  () =>
    import('./reports.page')
      .then(module => module.ReportsPage),
  {
    name: 'reports',
  },
);
```

But lazy loading and protected delivery answer different questions:

``` text
lazy route
    When should the browser load this code?

protected route contribution
    Is this browser authorized to receive this code?
```

A protected artifact may also be lazy in practical terms, but its
defining property is server-authorized delivery.

------------------------------------------------------------------------

# Building

Waypoint uses one build owner:

``` text
@epikodelabs/waypoint-builder
```

The builder's TypeScript source contains the complete internal
compilation pipeline. Generated builder JavaScript is build output, not
a parallel implementation.

For the application:

``` text
Waypoint builder
       ↓
client build
       ↓
browser + protected + server metadata
       ↓
server build
```

Build in that order:

``` bash
npm run build:builder
npm run build:client
npm run build:server
```

The client build comes before the server because it owns the Waypoint
artifact generation consumed by the server.

------------------------------------------------------------------------

# What Waypoint guarantees

Waypoint is designed around a few strong invariants.

### The public host is actually public

Protected route implementation should not accidentally remain reachable
from the host bundle.

### Authorization becomes no weaker through protected ownership

Nested contributions preserve or strengthen inherited authorization.

### Delivery is server-authorized

Knowing or guessing an artifact URL does not grant access to it.

### Artifact dependencies are authorized together

A leaf cannot be delivered through an unauthorized dependency chain.

### Published generations are coherent

The builder and server avoid exposing mixtures of old and new artifact
metadata.

### Navigation commits coherently

Cancelled, failed, or superseded work does not become visible
application state.

------------------------------------------------------------------------

# What Waypoint does not guarantee

Waypoint does not replace application security outside routing.

It does not secure an unprotected backend API.

It does not make downloaded JavaScript secret forever.

It does not make content hashes authorization tokens.

It does not mean every application needs protected frontend modules.

If the complete client application is intentionally public and route
guards are sufficient, a conventional router is simpler.

------------------------------------------------------------------------

# Assessment

Waypoint is more infrastructure than a conventional Angular router
because it solves a larger problem.

## Builder --- highly sophisticated

The builder is the most unusual part of the system.

It must understand both the logical navigation model and the physical
Angular dependency graph. Authorization policy is useful only if the
resulting code artifacts preserve the same boundary.

The combination of authorization monotonicity, declaration isolation,
host isolation, dependency-aware artifacts, content hashing, and atomic
publication makes the builder closer to an **authorization-aware
application linker** than a route configuration generator.

## Server --- robust and deliberately narrow

The server does not duplicate the browser router.

Its job is to transform:

``` text
URL + principal + published generation
```

into:

``` text
authorized delivery plan
```

Coherent snapshots, complete-chain authorization, non-disclosing
failures, and framework-neutral HTTP integration make that boundary
comparatively easy to reason about.

## Client --- asynchronous without becoming nondeterministic

The client has to combine a normal router's responsibilities with
configuration that may arrive during navigation.

The important achievement is not simply dynamic route installation. It
is preserving cancellation, history, outlet, and commit consistency
while doing so.

## Overall

Waypoint's architecture addresses three independent failure modes:

``` text
protected code leaks during build
              ↓
        Builder isolation

unauthorized code is delivered
              ↓
       Server authorization

stale/partial navigation commits
              ↓
        Client transaction
```

That separation is the system's strongest architectural property.

------------------------------------------------------------------------

# When Waypoint fits

Waypoint is particularly suited to applications with:

-   administrative areas;
-   permission-specific frontend capabilities;
-   multi-tenant navigation;
-   licensed modules;
-   internal tooling;
-   server-composed route branches;
-   frontend code whose disclosure is itself part of the
    security/privacy model.

The central question is:

> **Is what the browser is allowed to know part of the architecture?**

If the answer is yes, Waypoint provides a routing model built around
that boundary.

------------------------------------------------------------------------

## Core concepts

  -----------------------------------------------------------------------
  API                                 Purpose
  ----------------------------------- -----------------------------------
  `route()`                           Define a destination

  `layout()`                          Define inherited route structure

  `frame()`                           Attach rendering lifecycle

  `lazyRoute()`                       Lazy-load ordinary route code

  `routeSlot()`                       Declare a navigation ownership
                                      boundary

  `routesFor()`                       Contribute routes to an ownership
                                      boundary

  `router.navigateTo.*`               Typed named navigation

  `router.hrefTo.*`                   Typed URL generation

  `router.replaceConfiguration()`     Replace runtime navigation
                                      configuration

  `router.revalidate()`               Reevaluate the current destination
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Design principles

-   The server is authoritative for protected delivery.
-   Do not ship protected implementation to a principal that cannot use
    it.
-   Authorization may become stricter through nested ownership, not
    weaker.
-   Protect the physical code graph, not only route metadata.
-   Authorize the complete artifact chain.
-   Do not use hashes as secrets.
-   Publish complete generations.
-   Commit complete navigations.
-   Stale asynchronous work never wins.
-   Share framework runtime identities across delivered artifacts.
-   Keep backend authorization independent from frontend routing.

------------------------------------------------------------------------

## License

MIT
