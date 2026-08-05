# Route Compiler

`@epikodelabs/route-compiler` resolves authored Waypoint navigation declarations into an AST-free semantic program, validates and expands that program, plans protected route artifacts, and emits server metadata and focused browser entries.

## Pipeline

```text
TypeScript source
→ discovery
→ semantic resolution
→ Navigation IR
→ expansion
→ validation
→ artifact planning
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
- isolated esbuild bundles per exported `routesFor()`;
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

The compiler now produces a versioned `RouteArtifactPlan` before emission. The plan is the sole contract for server emitters, browser-entry emitters, and the future bundler. It records hierarchical artifact dependencies, generated entries, isolated browser bundle requirements, server shards, and manifest/index documents. See `ARTIFACT-PLAN-V1.md`.