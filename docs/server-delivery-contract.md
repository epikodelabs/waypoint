# Waypoint Server Delivery Contract v1

## Status

**Version 1.** This document defines the browser/server delivery boundary for
server-side routing in Waypoint.

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
ServerNavigationResolution v1
        ↓
browser module loading
        ↓
runtime contribution installation
```

## Wire shape

```ts
interface ServerNavigationResolution {
  readonly version: 1;
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

interface ServerArtifactDelivery {
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}
```

### `version`

Identifies the wire contract. A client must reject versions it does not
understand.

### `artifactKey`

Identifies the target artifact selected for the requested destination.

The final entry in `artifacts` must have this key.

### `artifacts`

Contains the complete authorized artifact chain in dependency-first order.

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
const serverRouter = createServerRouter({
  loadIndex,
  loadShard,
  moduleUrlFor,
});
```

The server router owns:

- parsing and normalizing requested navigation targets;
- selecting candidate shards by segment-aware path prefix;
- exact route-pattern matching, including dynamic parameters;
- mapping a matched branch to its route-set artifact;
- resolving transitive artifact dependencies in dependency-first order;
- loading the branch provenance required to authorize those artifacts;
- authorizing the complete artifact chain;
- constructing `ServerNavigationResolution v1`;
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
filesystem layout, or a particular compiler-output directory. Applications
provide `loadIndex()`, `loadShard()`, and `moduleUrlFor()`.

### Compiler-output snapshots

`createServerRouterSnapshotSource()` can sit in front of those loaders. It caches
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

## Relationship to `routeSlot()` and `routesFor()`

Compiler artifacts export actual `routesFor()` contributions. They are not
flattened route arrays.

When delivered, those contributions attach to the matching `routeSlot()` in the
already installed navigation skeleton. This preserves ownership, inherited path
context, layouts, providers, and policy provenance established by the authored
navigation model.

## Relationship to SSR

Server Delivery Contract v1 does not define server-side rendering.

The same contract can be used by a browser-only Angular application, an Angular
SSR application, or another HTTP server integration. "Server-side routing" in
Waypoint refers to server ownership of route visibility, authorization, and
route-code delivery.

## Versioning

Additive compiler metadata does not change this contract because compiler
metadata is not sent over this boundary.

A change requires a new delivery-contract version when an existing client could
no longer safely interpret a server response according to these rules.