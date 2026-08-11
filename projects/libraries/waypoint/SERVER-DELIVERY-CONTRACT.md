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
