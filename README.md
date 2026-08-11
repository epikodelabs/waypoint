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

# Server Delivery Contract v1

The browser/server boundary is a small, versioned Waypoint protocol. A server
resolution returns only the target artifact and the dependency-first list of
authorized browser modules needed to install it.

```ts
interface ServerNavigationResolution {
  readonly version: 1;
  readonly artifactKey: string;
  readonly artifacts: readonly {
    readonly artifactKey: string;
    readonly moduleUrl: string;
    readonly hash: string;
  }[];
}
```

Server-only route metadata does not cross this boundary: policies, branch IDs,
route-set ownership, source files, compiler shards, and artifact dependencies
remain on the server. The browser validates the protocol version and shape,
loads the already-authorized artifact plan in order, installs the resulting
`routesFor()` contributions, and revalidates the current URL.

This contract is independent of Express and SSR. Applications can implement the
HTTP transport differently while reusing Waypoint's framework-neutral server
router:

```ts
const serverRouter = createServerRouter({
  loadIndex,
  loadShard,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${artifact.artifactKey}/${artifact.hash}`,
});

const resolution = await serverRouter.resolve(requestedPath, principal);
```

`createServerRouter()` owns path matching, shard selection, route-set lookup,
dependency ordering, complete-chain authorization, and construction of the
browser delivery plan.

Waypoint also provides a transport-neutral HTTP layer and an Express adapter:

```ts
const navigation = createExpressServerRouterHandlers({
  router: serverRouter,
  principalFrom: request => request.principal,
  artifactPathFor: artifact => resolveOutputPath(artifact.file),
});

app.get('/api/navigation/resolve', navigation.resolve);
app.get('/api/navigation/modules/:artifactKey/:hash', navigation.module);
```

`createServerRouterHttpHandler()` owns Waypoint's HTTP semantics: malformed
resolution requests, private non-cacheable responses, indistinguishable
unknown/unauthorized routes, module security headers, and safe masking of stale
or unauthorized artifact requests. `createExpressServerRouterHandlers()` only
translates those transport-neutral results to Express request/response objects
and sends an already-authorized file.

The Express adapter has no runtime dependency on Express inside the Waypoint
package. It targets the small structural request/response surface it needs, so
applications keep control over Express versions, authentication middleware,
filesystem layout, and server composition.

Artifact module requests are resolved by `artifactKey + hash`, not emitted
filenames. The server authorizes the complete dependency chain again before it
returns the artifact file to the transport adapter.

### Browser delivery resolver

`createServerNavigationResolver()` is the browser counterpart to the server
router. It implements Server Delivery Contract v1 directly as a
`RouterOptions.resolveRoutes` function:

```ts
const resolveRoutes = createServerNavigationResolver();

provideRouter(routes, {
  resolveRoutes,
});
```

The resolver requests one server-authorized delivery plan, validates the wire
contract, loads artifacts in dependency-first order, validates each module as a
`routesFor()` contribution, and returns the contributions for atomic runtime
installation. Artifact imports are deduplicated by `artifactKey + hash`; when a
new hash is published for a stable artifact key, Waypoint drops its own cache
reference to the older delivery identity. Failed imports are evicted so a later
navigation can retry. Superseded route resolutions receive an `AbortSignal`;
Waypoint stops obsolete fetch/import pipelines from returning route contributions
after a newer navigation, revocation, or router disposal. If an artifact URL goes
stale during an atomic compiler publication, the resolver re-resolves the
destination once so it can pick up the newly published content hash.

Applications can override the resolution endpoint, fetch implementation, or
module importer without changing the routing runtime:

```ts
const resolveRoutes = createServerNavigationResolver({
  endpoint: '/internal/navigation/resolve',
  fetch: customFetch,
  importModule: loadModule,
});
```

### Compiler-output snapshots

Production servers should not reread and reparse the server index and shards for
every navigation. `createServerRouterSnapshotSource()` turns compiler output into
one immutable routing generation:

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});

const serverRouter = createServerRouter({
  loadSnapshot: source.loadSnapshot,
  moduleUrlFor,
});
```

A snapshot eagerly loads all shards referenced by its index before publication.
Refresh is atomic: a failed or changing generation never replaces the last good
snapshot. With an optional cheap `revision()` function, normal requests reuse the
cached parsed generation and refresh automatically only after compiler output
changes. `refresh()` and `invalidate()` are also available for explicit host
lifecycle integration.

The normative protocol details are documented in
`docs/server-delivery-contract.md`.


## Route revocation

Server-delivered route contributions are active runtime configuration, not permanent
membership in the application route graph. When identity, tenant, licensing, or
permissions change, applications can explicitly cross an authorization boundary:

```ts
await router.revalidate({
  resetResolvedRoutes: true,
});
```

Waypoint then:

1. removes routes and `routesFor()` contributions previously installed through
   `resolveRoutes`;
2. preserves authored routes and authored contributions;
3. clears cached unresolved-route decisions;
4. resolves the current URL against the server again;
5. installs the resulting registry atomically; and
6. revalidates the active destination.

Downloaded JavaScript is not treated as revocable. The browser delivery resolver
may retain content-addressed module caches, while the route contributions exported
by those modules can leave and later re-enter the active navigation model.

This distinction keeps the security boundary precise:

```text
artifact delivery  → whether code may enter the browser
route revocation   → whether delivered code participates in navigation now
```

Ordinary navigation remains additive. A target-scoped server resolution does not
represent the user's complete authorized route catalog, so Waypoint does not
revoke unrelated contributions on every navigation. Revocation happens only when
the application explicitly declares that authorization context has changed.

## Principal replacement

A change of security principal or tenant is a stronger boundary than an ordinary
permission refresh. Waypoint's recommended model is to establish the new principal
on the server, select an authorized landing destination with `resolveLanding()`,
and perform a full document navigation. The new document starts from the public
route-slot skeleton and receives only artifacts authorized for the new principal.

```text
same principal + permissions changed
    → revoke + revalidate

principal / tenant changed
    → server session switch
    → authorized landing
    → full document replace
    → fresh JavaScript realm
```

Downloaded code is not claimed to be erasable from browser caches, but it does not
remain installed in the new application's JavaScript realm. Authorization
boundaries should therefore align with independently deliverable `routesFor()`
artifact boundaries.

---

# Example applications

## Client

Exercises the standalone Waypoint browser runtime, including layouts, lifecycle,
lazy loading, named outlets, and typed navigation.

## Server

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