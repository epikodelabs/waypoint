# Waypoint Route Compiler

`@epikodelabs/route-compiler` is the build-time half of Waypoint's server-side routing model. It resolves authored navigation declarations into an AST-free semantic program, validates and expands that program, plans protected route artifacts, and emits the server authorization metadata and isolated browser entries used for route delivery.

## Pipeline

```text
TypeScript source
→ discovery
→ semantic resolution
→ Navigation IR
→ expansion
→ validation
→ artifact planning
→ Angular full AOT compilation
→ isolated artifact bundling
→ delivery finalization
→ emitters
```

## Project structure

```text
src/lib/
  compiler/    orchestration, configuration, diagnostics, output contracts
  discovery/   TypeScript program and declaration discovery
  resolution/  AST-to-semantic-program resolution
  ir/          Semantic Model v1, path rules, navigation expansion
  validation/  validation over expanded navigation
  planning/    deterministic artifact planning
  emitters/    browser/server emission and bundling boundary
```

`semantic-model.md` is the normative language contract. `src/lib/ir/model.ts` is its AST-free implementation.

The compiler uses only stage-specific terminology:

```text
SemanticRoute
→ ExpandedRouteBranch
→ PlannedBrowserEntry / PlannedServerShard
```

Legacy `Parsed*`, `Compiled*`, and `RouteGraph` names are intentionally absent.

## Server-side routing outputs

The compiler deliberately produces both sides of the delivery boundary from one authored navigation model:

- server indexes and shards used to resolve paths, ownership, policy, dependencies, and artifact identity;
- isolated browser artifacts for independently deliverable route sets;
- a delivery manifest that connects emitted bundles to server metadata.

Authorization and HTTP delivery remain server-integration concerns; the compiler supplies deterministic metadata and artifacts for that integration.

## Current capabilities

- `routeSlot()` and exported `routesFor()` discovery;
- hierarchical route ownership with nested slots inside route sets;
- ownership-cycle validation and parent provenance;
- semantic source provenance;
- inherited path, layout, policy, and ownership expansion;
- strict path, parameter, schema, name, outlet, and ownership validation;
- deterministic route-set and branch identity;
- server index and shard planning;
- focused browser-entry emission;
- Angular full-AOT compilation of independently delivered route code;
- isolated esbuild bundles per exported `routesFor()`;
- host-runtime bridging for Angular, Waypoint, and explicitly configured identity-sensitive application modules;
- content-hashed artifact filenames and esbuild metadata;
- finalized server and browser delivery manifests;
- dry-run compilation.

## Navigation IR

The compiler lowers the AST-free semantic program into a compact Navigation IR
before expansion:

```text
SemanticNavigationProgram
→ NavigationIr
→ ExpandedNavigationModel
```

Navigation IR interns repeated identities and stores child lists as ranges. See
`NAVIGATION-IR.md` for the representation contract.

## Validation pipeline

Validation is split at the Navigation IR boundary:

```text
SemanticNavigationProgram
→ NavigationIr
→ validateNavigationIr()
→ ExpandedNavigationModel
→ validateExpandedNavigation()
```

IR validation checks structural references, ranges, schemas, slots, and `routesFor()` ownership before expansion. Expanded validation checks composed paths, parameter/schema agreement, names, patterns, outlets, and redirects. Shared validation diagnostics use stable `NAV*` codes.

## Artifact Plan v1

The compiler produces a versioned `RouteArtifactPlan` before emission. The plan is the sole contract for server emitters, browser-entry emitters, and artifact bundling. It records hierarchical artifact dependencies, generated entries, isolated browser bundle requirements, server shards, and manifest/index documents. See `ARTIFACT-PLAN-V1.md`.
## Angular AOT and host runtime sharing

Protected route artifacts are application code. Before bundling, the compiler
runs the authored route project through Angular's full AOT compiler using the
explicit `artifactTsConfig`. The resulting executable Angular JavaScript is then
bundled independently for each `routesFor()` artifact.

Angular packages and `@epikodelabs/waypoint` are host-shared by default.
Additional identity-sensitive application modules can be declared with repeated
`--host-module <specifier>` CLI options (or `hostModules` in the compiler API).
The artifact bundler rewrites imports of those specifiers to Waypoint's host
runtime bridge instead of bundling duplicate module identities.

A configured host module must also be part of the browser host bundle and its
exact module namespace must be registered through
`createServerNavigationResolver({ hostModules: ... })`. Host modules are not
protected artifacts, so sensitive route/page modules must not be placed behind
this bridge.

## Atomic publication

Artifact Bundler v1 publishes through a staging directory and one directory
rename. A successful compilation replaces the complete artifact set, removes
stale content-hashed files, and records emitted, replaced, and removed paths
separately.

Server shards, the server index, and the browser manifest are staged together
and committed with rollback backups. If delivery publication fails, the
compiler restores the previous browser artifact directory and does not expose a
partially updated delivery set.

## Compiler Contracts v1

The library entry point is `compile(options)`.
Set `profile: true` to collect immutable per-stage timings and `inspect: true` to retain the semantic model, Navigation IR, expanded model, Artifact Plan, bundle result, and finalized delivery documents in `result.inspection`.

Artifact Plan v1 is validated before emission. Finalized delivery metadata is validated against actual bundle outputs before transactional publication.
`--dry-run` performs semantic validation, Angular full-AOT compilation, in-memory artifact bundling, delivery finalization, and finalized-delivery validation, but publishes no browser artifacts or server delivery documents. This makes `compiler:compile:check` a real executable-pipeline verification rather than a planning-only check.
