# Waypoint Server Delivery Contract

## Status

This document defines the browser/server delivery boundary for server-side
routing in Waypoint.

The contract is intentionally smaller than the compiler's server index. It is a
public delivery protocol, not a serialization of Waypoint's semantic model or
compiler internals.

## Purpose

A browser asks the server to resolve a destination. The server owns route
matching, authorization, artifact selection, and dependency resolution. If the
destination is allowed, the browser receives only the browser modules required
to install that navigation.

```text
requested URL + principal
        ↓
server route resolution
        ↓
server authorization
        ↓
artifact dependency resolution
        ↓
ServerNavigationResolution
        ↓
browser module loading
        ↓
runtime contribution installation
```

## Wire shape

```ts
interface ServerNavigationResolution {
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

interface ServerArtifactDelivery {
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}
```

### `artifactKey`

Identifies the artifact that contains the originally requested destination.

The artifact must be present in `artifacts`, but it is not required to be the final
entry. Internal redirects may require additional authorized artifacts that appear
later while `artifacts` remains dependency-first.

### `artifacts`

Contains the complete authorized artifact plan in dependency-first order. For an
internal redirect chain, the plan includes the artifacts required for every
authorized redirect hop and the final destination.

The browser must not discover dependencies by querying a global artifact graph.
Each artifact key appears at most once.

### `moduleUrl`

A browser-loadable URL for the authorized artifact. The transport and URL shape
are application concerns; Waypoint does not require Express, a particular API
prefix, or SSR.

### `hash`

Identifies the exact compiled artifact contents. Browser loaders should treat
`artifactKey + hash` as delivery identity so recompiling an artifact under the
same stable key cannot reuse stale loaded code.

## Server-only information

The following information must not be required by the browser delivery
protocol:

- route policies;
- roles or permissions;
- route branch IDs;
- route-set ownership metadata;
- slot indexes;
- compiler shard locations;
- source file names or exports;
- artifact dependency edges;
- the complete protected route catalog.

Those belong to server resolution and compiler output, not the public wire
contract.

## Authorization invariant

An emitted browser artifact is an atomic code-delivery boundary.

The server may deliver an artifact only when every branch contained by that
artifact belongs to its expected route set and every effective policy on those
branches allows the current principal.

For a target with dependencies, the complete dependency chain must be
authorized before any delivery plan is returned.

```text
authorized(target)
  = authorized(dependency 1)
  ∧ authorized(dependency 2)
  ∧ ...
  ∧ authorized(target artifact)
```

The browser never performs this authorization calculation.

## Hidden routes

An application should avoid making authorization a route-discovery oracle.
Unknown and unauthorized protected destinations should normally have the same
public resolution behavior. The example server uses `404` for both.

Direct artifact-module requests must be authorized independently as well. A
client knowing or guessing an old artifact URL does not grant access to it.

## Redirects across artifacts

Internal redirects are resolved by the server before the delivery plan crosses
the browser boundary. The server follows the redirect chain using compiler shard
metadata, interpolates path parameters, authorizes every redirect hop and final
destination, and returns the union of required artifacts in dependency-first
order.

If any internal redirect target is unknown or unauthorized, no partial delivery
plan is returned. This prevents an otherwise authorized redirect artifact from
becoming a route-discovery or authorization bypass. External redirects are not
followed by the server; the authorized source redirect is delivered and the
browser runtime delegates the external navigation normally.

## Browser behavior

A conforming browser integration:

1. requests resolution for the current destination;
2. rejects malformed or unsupported protocol responses;
3. loads `artifacts` in the order returned;
4. validates that loaded modules are Waypoint route contributions;
5. caches loaded artifacts by `artifactKey + hash` rather than stable key alone;
6. installs the resulting contributions into the runtime configuration;
7. revalidates the current URL.

The browser does not need the server index or manifest to perform these steps.

Waypoint provides `createServerNavigationResolver()` as the default browser
implementation of this contract. The returned function can be passed directly
to `RouterOptions.resolveRoutes`. It validates the wire response before loading
code, imports the dependency-first artifact list in order, verifies that each
module exports a `routesFor()` contribution, and caches successful imports by
`artifactKey + hash`. Failed imports are removed from the resolver cache so a
later navigation can retry, and a newly published hash supersedes the resolver's
cache reference for the previous hash of the same stable artifact key.


## Server Router API v1

Waypoint provides a framework-neutral server router around the compiler's
server index and shards:

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

The server router owns:

- parsing and normalizing requested navigation targets;
- selecting candidate shards by segment-aware path prefix;
- exact route-pattern matching, including dynamic parameters;
- mapping a matched branch to its route-set artifact;
- following and authorizing internal redirects across route-set artifacts;
- interpolating redirect path parameters without exposing the route graph;
- resolving transitive artifact dependencies in dependency-first order;
- loading the branch provenance required to authorize those artifacts;
- authorizing the complete artifact chain;
- constructing `ServerNavigationResolution`;
- authorizing direct module delivery by `artifactKey + hash`.

The transport adapter owns only transport concerns such as authentication input,
HTTP status codes, response headers, and sending the already-authorized file.

```text
HTTP adapter
    ↓ target + principal
createServerRouter()
    ↓ authorized resolution / artifact
HTTP adapter
    ↓ JSON or JavaScript response
browser
```

`createServerRouter()` deliberately does not depend on Express, Angular SSR,
filesystem layout, or a particular compiler-output directory. It consumes one
immutable `loadSnapshot()` source and a `moduleUrlFor()` mapping.

### Angular AOT and host-runtime identity

Waypoint route artifacts are executable Angular application modules, not raw
TypeScript decorator source. The route compiler performs Angular **full AOT**
compilation before isolated artifact bundling. This matches Angular's application
compilation model and avoids requiring JIT compilation in the browser.

Independently bundled artifacts must not create second identities for Angular
or Waypoint. The compiler therefore rewrites host-shared imports to a small
runtime bridge. During protected AOT preparation the builder discovers the exact
host module specifiers used by delivered artifacts, then generates a browser
bootstrap that imports and registers those host namespace objects before native
artifact imports can occur.

Application code does not register host modules manually:

```ts
const resolveRoutes = createServerNavigationResolver();
```

Registering a different namespace for an already registered specifier remains
an error inside the bridge. This prevents accidentally mixing multiple
Angular/Waypoint runtime identities in one document realm. Protected application
code remains inside authorized route artifacts; the generated host bridge only
contains framework/runtime module identities discovered by the compiler.

## Compiler-output snapshots

`createServerRouterSnapshotSource()` builds that source from compiler-output loaders. It caches
one complete index + shard generation and exposes it through `loadSnapshot()`.
The server router uses that snapshot for the entire match/authorization operation,
so an index from one compiler publication cannot be combined with shards from a
later publication.

A refresh loads every referenced shard before swapping the active snapshot. If
loading fails, the previous successful snapshot remains active. Hosts may provide
a cheap `revision()` probe to detect a new publication without reparsing JSON on
every request, or call `refresh()` / `invalidate()` explicitly.

### Module identity

Browser module URLs should identify an artifact by its stable `artifactKey` and
its exact content `hash`. Emitted filenames are compiler/storage details and are
not part of the server delivery protocol.

A module request is valid only when:

1. the artifact key exists;
2. the requested hash equals the currently published artifact hash;
3. the artifact and every dependency are authorized for the current principal.

A stale hash, unknown artifact, or unauthorized artifact should normally be
indistinguishable at the public HTTP boundary.


## Revocation and delivered-route lifecycle

A successful delivery authorizes an artifact for that request; it does not make
its route contribution permanent for the lifetime of the application.

Waypoint distinguishes downloaded module state from active navigation state:

- downloaded artifact modules may remain cached by `artifactKey + hash`;
- `routesFor()` contributions installed from those modules are revocable;
- authored routes and authored contributions are not part of server-delivery
  revocation;
- an authorization-context change should reset resolved navigation and resolve
  the current destination again.

The Angular router exposes this boundary explicitly:

```ts
await router.revalidate();
```

Resetting resolved routes increments the resolver generation. Results from older
in-flight resolutions are ignored, preventing a slow response produced under a
previous identity or tenant from reattaching revoked navigation.

A target-scoped `ServerNavigationResolution` is not an authorized route catalog.
Therefore ordinary navigation must not replace the entire delivered contribution
set with the artifact chain for the latest target. Doing so would incorrectly
revoke unrelated routes that remain authorized. Full revocation is instead tied
to an explicit authorization-boundary change.

## Relationship to `routeSlot()` and `routesFor()`

Compiler artifacts export actual `routesFor()` contributions. They are not
flattened route arrays.

When delivered, those contributions attach to the matching `routeSlot()` in the
already installed navigation skeleton. This preserves ownership, inherited path
context, layouts, providers, and policy provenance established by the authored
navigation model.

## Failure and race invariants

Server-side routing must fail closed at authorization-boundary changes. If the
browser revokes resolved contributions and reauthorization then fails because of
a transport, import, or server error, the previously authorized contribution set
must not remain active merely because the refresh failed.

A failed resolution is also not equivalent to a negative authorization result.
Only an explicit hidden/not-found response may be cached as unresolved; transient
transport or artifact-loading failures remain retryable.

Resolved navigation is committed transactionally. A malformed contribution, an
unknown slot, a conflicting route definition, or a collision with an authored
contribution identity must reject the candidate without leaving partial resolved
state installed.

Navigation ordering spans the server-resolution phase as well as the underlying
router transition. If a newer navigation starts while an older navigation is
still waiting for server resolution, the older request must not commit afterward.
Revocation and router disposal similarly invalidate in-flight resolved navigation.

Server artifact identity must be unambiguous. Duplicate artifact keys or multiple
artifacts claiming the same route-set delivery unit are invalid compiler output
and must fail resolution rather than selecting one by iteration order.


## Principal replacement

Delivered-route revocation and principal replacement are separate operations.
Soft revocation may remove delivered contributions from the active routing
configuration while leaving previously imported JavaScript modules cached in
the current browser realm.

When the authenticated security principal or tenant changes, applications
should replace the browser realm with a full document navigation. The server
establishes the new principal, selects an authorized landing route, and the
browser navigates there as a new document before protected navigation is
installed for that principal.

`createServerRouter()` exposes `resolveLanding(candidates, principal)` for this
server-side selection. It returns the first candidate that successfully resolves
and authorizes under the same complete-chain rules as ordinary route delivery.
It never turns the delivery protocol into an authorized-route catalog.
Applications must also account for browser back/forward-cache restoration: a document created for one principal must not become interactive again after the current session identifies a different principal. Reload or replace that restored document before reusing Waypoint runtime state.

Artifact boundaries must respect authorization boundaries as well. Since an
artifact is an atomic delivery unit, a sensitive branch should live in a
separate `routesFor()` artifact rather than sharing one artifact with routes
that less-privileged principals must receive.

## Relationship to SSR

The Server Delivery Contract does not define server-side rendering.

The same contract can be used by a browser-only Angular application, an Angular
SSR application, or another HTTP server integration. "Server-side routing" in
Waypoint refers to server ownership of route visibility, authorization, and
route-code delivery.

## Browser cancellation and publication rollover

A browser integration should treat server resolution as cancellable work. When a
newer navigation supersedes a pending destination, revocation starts, or the
router is disposed, the pending resolver receives an abort signal. A module import
that has already started cannot be physically undone by JavaScript, but an aborted
resolution must not return or install its contributions.

Content-addressed module delivery can race with atomic compiler publication: a
resolution may refer to the previous hash just as the server publishes the next
generation. The default browser resolver may re-resolve once after a module-load
failure and use the new delivery identity. Deterministic protocol or module-shape
errors are not retried.

### Identity-preserving revalidation

Server configuration refreshes include a configuration `revision` and an opaque
effective `identity` for each delivered artifact. The effective identity folds
the artifact content hash together with all transitive dependency content
hashes. A route artifact is therefore considered unchanged only when both its
own executable code and every executable dependency are unchanged.

When the configuration revision is unchanged, `revalidate()` is a strict no-op.
When only unrelated ownership units change, Waypoint preserves the exact
runtime route and frame-transition identities for the active branch and does
not recreate its layouts/pages or rerun prepare/enter/leave hooks.
