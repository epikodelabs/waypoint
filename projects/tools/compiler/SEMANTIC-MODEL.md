# Waypoint Semantic Model

## Status

**Finalized: Semantic Model v1.** Changes to the laws or entities in this document require an explicit semantic-model revision. Additive compiler metadata and artifact formats do not change the semantic model.

This document defines the semantic model of the Waypoint navigation language.

It describes what Waypoint route declarations mean independently of:

- TypeScript syntax and AST nodes;
- Angular rendering details;
- compiler implementation stages;
- server artifact formats;
- browser entry generation;
- bundler behavior;
- file names and output directories.

The compiler, runtime, server integration, and tooling should all implement this model consistently.

---


## Normative decisions for v1

The following decisions are frozen for Semantic Model v1:

- `routeSlot()` and named rendering outlets are separate concepts.
- A slot is retained after route-set expansion.
- `routesFor()` targets exactly one existing slot.
- One owner per slot is supported in v1.
- Slot IDs and route names are globally unique in one navigation program.
- Paths compose segment-by-segment through layouts and slot contexts.
- Optional path segments and optional path-parameter schemas are not supported.
- `paramsSchema` refines path parameters but never changes path shape.
- Invalid supplied schema values fail rather than being clamped or repaired.
- Artifact files, names, hashes, and delivery URLs are derived data, not semantic entities.
- TypeScript AST nodes cannot appear in the resolved semantic program.

---

## 1. Design goals

The semantic model exists to provide one stable meaning for Waypoint navigation declarations.

It should:

1. distinguish navigation concepts from compiler implementation details;
2. preserve route ownership and extension boundaries;
3. define context inheritance precisely;
4. keep URL matching separate from rendering outlets;
5. support large applications without requiring duplicated trees;
6. provide clear invariants for compiler validation;
7. allow runtime and build-time compilers to agree on route meaning;
8. allow artifact planning to be derived from semantics rather than embedded in it.

---

## 2. Navigation program

A Waypoint navigation program consists of:

- one root navigation tree;
- zero or more externally declared route sets;
- source identity for declarations;
- optional policies, schemas, providers, frames, and outlets.

Conceptually:

```ts
interface NavigationProgram {
  readonly entries: readonly NavigationEntry[];
  readonly routeSets: readonly RoutesForDefinition[];
}
```

A navigation program is not itself a browser artifact or server manifest.

Those are derived outputs.

---

## 3. Navigation entries

A navigation tree may contain:

```ts
type NavigationEntry =
  | Route
  | Redirect
  | Layout
  | RouteSlot;
```

A `routesFor()` declaration contains another navigation tree associated with one slot.

It is not inserted directly into the root tree as an ordinary entry.

---

## 4. Route

A route defines one navigable destination.

Example:

```ts
route('/devices/:deviceId', DevicePage, {
  name: 'device',
  paramsSchema: {
    deviceId: s.number({ min: 1 }),
  },
});
```

Conceptually:

```ts
interface SemanticRoute {
  readonly kind: 'route';
  readonly path: RoutePath;
  readonly name?: string;
  readonly outlet?: string;
  readonly frame: SemanticFrame;
  readonly paramsSchema?: SemanticSchemaRecord;
  readonly querySchema?: SemanticSchemaRecord;
  readonly policy?: SemanticPolicy;
  readonly providers?: SemanticProviderSet;
  readonly data?: SemanticStaticData;
  readonly source: SemanticSource;
}
```

### Route semantics

A route:

- contributes a path to the current path context;
- defines a navigable destination;
- may define a stable navigation name;
- may refine path parameters with `paramsSchema`;
- may parse query values with `querySchema`;
- may render into the primary outlet or a named rendering outlet;
- may introduce route-local providers, policy, data, and lifecycle behavior.

A route does not automatically define an ownership or artifact boundary.

---

## 5. Redirect

A redirect defines navigation from one path to another target.

Example:

```ts
redirectRoute('/legacy', '/app/home');
```

Conceptually:

```ts
interface SemanticRedirect {
  readonly kind: 'redirect';
  readonly path: RoutePath;
  readonly target: RedirectTarget;
  readonly replace: boolean;
  readonly source: SemanticSource;
}
```

### Redirect semantics

A redirect:

- participates in path matching;
- does not render a view;
- does not define named outlets;
- does not define parameter or query schemas unless explicitly supported by the public API;
- resolves its target according to Waypoint redirect rules;
- remains distinct from a renderable route.

---

## 6. Layout

A layout defines inherited navigation and rendering context for descendant entries.

Example:

```ts
layout('/app', AppLayout, [
  route('/home', HomePage),
]);
```

Conceptually:

```ts
interface SemanticLayout {
  readonly kind: 'layout';
  readonly path: RoutePath;
  readonly frame: SemanticFrame;
  readonly policy?: SemanticPolicy;
  readonly providers?: SemanticProviderSet;
  readonly entries: readonly NavigationEntry[];
  readonly source: SemanticSource;
}
```

### Layout semantics

A layout introduces:

- path context;
- layout rendering context;
- provider context;
- policy context;
- lifecycle context when represented by a frame.

Descendant entries inherit the layout context.

A layout is not itself necessarily a navigable destination.

A pathless layout may contribute rendering, policy, provider, or lifecycle context without adding URL segments.

---

## 7. Frame

A frame is a view plus navigation lifecycle behavior.

Example:

```ts
frame(DevicePage, {
  beforeEnter: [requireDeviceAccess],
  prepare: [loadDevice],
  afterEnter: [trackDeviceOpen],
  beforeLeave: [confirmUnsavedChanges],
});
```

Conceptually:

```ts
interface SemanticFrame {
  readonly view: SemanticView;
  readonly lifecycle: SemanticLifecycle;
}
```

A component passed directly to `route()` or `layout()` is semantic shorthand for a frame with an empty lifecycle.

### Frame lifecycle

```ts
interface SemanticLifecycle {
  readonly beforeEnter: readonly BeforeEnterHandler[];
  readonly prepare: readonly PrepareHandler[];
  readonly afterEnter: readonly AfterEnterHandler[];
  readonly beforeLeave: readonly BeforeLeaveHandler[];
}
```

Lifecycle ordering is:

```text
beforeLeave
→ beforeEnter
→ prepare
→ render/commit
→ afterEnter
```

Exact cancellation and transition behavior belongs to the runtime contract, but all implementations must preserve the same semantic phase order.

---

## 8. Route slot

A route slot declares a named ownership boundary inside a navigation tree.

Example:

```ts
layout('/app', AppLayout, [
  routeSlot('workspace'),
]);
```

Conceptually:

```ts
interface SemanticRouteSlot {
  readonly kind: 'route-slot';
  readonly id: string;
  readonly source: SemanticSource;
}
```

### Route-slot semantics

A route slot:

- is not navigable;
- does not render a component;
- contributes no path segment of its own;
- captures the surrounding path context;
- captures the surrounding layout context;
- captures inherited policy and provider context;
- remains present even when no routes are associated with it;
- defines a stable target for `routesFor()` declarations;
- may be used by the compiler as an ownership boundary.

A route slot is not a named rendering outlet.

The distinction is fundamental:

```text
routeSlot()  extends the navigation
outlet       selects a rendered view target
```

---

## 9. Routes for a slot

`routesFor()` declares a route set associated with one route slot.

Example:

```ts
export const workspaceRoutes = routesFor('workspace', [
  route('/dashboard', DashboardPage),
  route('/projects', ProjectsPage),
]);
```

Conceptually:

```ts
interface SemanticRoutesFor {
  readonly kind: 'routes-for';
  readonly slotId: string;
  readonly entries: readonly NavigationEntry[];
  readonly source: SemanticExportSource;
}
```

### `routesFor()` semantics

A `routesFor()` declaration:

- targets exactly one route slot;
- defines routes interpreted relative to that slot's captured context;
- introduces source ownership and provenance;
- provides a natural artifact-planning boundary;
- does not itself contribute a path;
- does not erase or replace the target slot;
- remains semantically distinct from its expanded routes.

The exported source declaration may provide deterministic ownership identity.

Artifact names, hashes, and files are not part of the semantic model.

---

## 10. Ownership

Waypoint uses ownership to associate externally declared routes with a stable location in the navigation tree.

Ownership is represented by the relationship:

```text
routeSlot(id)
    ← targeted by
routesFor(id, entries)
```

The semantic model keeps these identities separate:

| Identity | Meaning |
|---|---|
| Slot ID | Ownership location in the navigation tree |
| Route-set identity | Source ownership and artifact-planning boundary |
| Route name | Typed navigation identity |
| Route path | URL matching identity |
| Outlet name | Render target identity |

A compiler must not treat these identities as interchangeable.

---

## 11. Context

Waypoint meaning is inherited through parent-linked contexts.

Conceptually:

```ts
interface SemanticContext {
  readonly parent: SemanticContext | null;
  readonly path: RoutePath;
  readonly layout?: SemanticLayout;
  readonly policy?: SemanticPolicy;
  readonly providers?: SemanticProviderSet;
}
```

An implementation may use indexes rather than object references, but the semantics are equivalent.

### Context kinds

A descendant entry may inherit:

- path context;
- layout chain;
- policy chain;
- provider chain;
- source ownership;
- route-slot ownership provenance.

### Slot context

When a slot is declared, it captures the current context.

```ts
interface BoundRouteSlot {
  readonly slot: SemanticRouteSlot;
  readonly context: SemanticContext;
}
```

Routes from `routesFor()` are interpreted under that captured context.

---

## 12. Path semantics

Waypoint paths are composed from parent and child path contexts.

Example:

```ts
layout('/app', AppLayout, [
  routeSlot('workspace'),
]);
```

```ts
routesFor('workspace', [
  route('/dashboard', DashboardPage),
]);
```

Result:

```text
/app/dashboard
```

### Path rules

- path composition is segment-based;
- repeated slashes are normalized;
- trailing slashes are normalized according to Waypoint path rules;
- parameter names must be valid identifiers;
- parameter names must be unique across the complete composed path;
- route matching requires exact segment count unless optional segments are explicitly added to the language;
- `paramsSchema` does not alter path shape;
- a route path is interpreted relative to its semantic parent context.

---

## 13. Path parameters

A dynamic path segment introduces a parameter.

Example:

```text
/app/device/:deviceId/board/:boardId
```

Introduces:

```ts
{
  deviceId: string;
  boardId: string;
}
```

A parameter schema may refine its value type:

```ts
paramsSchema: {
  deviceId: s.number({ min: 1 }),
  boardId: s.number({ min: 1 }),
}
```

Result:

```ts
{
  deviceId: number;
  boardId: number;
}
```

### Parameter invariants

- every `paramsSchema` key must exist in the complete composed path;
- optional path-parameter schemas are not valid unless optional path syntax exists;
- duplicate parameter names are invalid;
- invalid supplied values fail parsing;
- number ranges reject invalid values rather than clamp them;
- defaults do not repair malformed supplied values.

---

## 14. Query semantics

Query schemas parse URL query values independently of path matching.

Example:

```ts
querySchema: {
  tab: s.string('overview'),
  filters: s.optional(s.array()),
}
```

### Query invariants

- query schemas may be optional;
- query values do not change route path matching;
- defaults apply only when values are absent;
- malformed supplied values fail according to schema rules;
- query serialization should omit values equivalent to declared defaults where specified by the runtime contract.

---

## 15. Policy

A policy expresses authorization metadata.

Conceptually:

```ts
interface SemanticPolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}
```

### Policy semantics

A route may inherit a policy chain from:

- layouts;
- route-slot context;
- route-local policy.

The semantic model preserves this chain.

It does not prematurely reduce it to one server-specific representation.

```ts
interface SemanticPolicyContext {
  readonly parent: SemanticPolicyContext | null;
  readonly policy: SemanticPolicy;
}
```

Effective policy composition rules must be defined by the authorization contract and implemented consistently by generated server tooling.

A child route should not silently weaken an inherited protected policy unless the language explicitly defines that behavior.

---

## 16. Providers

Providers are inherited through layout and slot contexts.

Conceptually:

```ts
interface SemanticProviderContext {
  readonly parent: SemanticProviderContext | null;
  readonly providers: SemanticProviderSet;
}
```

Provider values are browser/runtime concerns.

The build compiler may preserve source references or metadata but should not attempt to execute Angular dependency injection.

---

## 17. Static route data

Static route data belongs to the semantic route declaration.

```ts
interface SemanticStaticData {
  readonly values: Readonly<Record<string, SemanticStaticValue>>;
}
```

Only statically evaluable values may be used by build-time compiler outputs.

Runtime-only values may remain represented as source references or be ignored by server-oriented outputs, depending on the compiler contract.

---

## 18. Named rendering outlets

Named outlets allow multiple views to be associated with the same matched route destination.

Example:

```ts
route('/workspace', WorkspacePage);

route('/workspace', SidebarPage, {
  outlet: 'sidebar',
});
```

### Outlet semantics

- one primary route owns destination semantics;
- named outlet routes attach secondary rendered views;
- named outlets do not define route ownership boundaries;
- outlet names must be unique within one route group;
- a named outlet route cannot independently redefine destination schemas, names, redirects, or transition settings unless explicitly supported.

---

## 19. Source identity

Every semantic declaration retains source identity.

Conceptually:

```ts
interface SemanticSource {
  readonly file: string;
  readonly start: number;
  readonly length: number;
}
```

Exported ownership boundaries retain export identity:

```ts
interface SemanticExportSource extends SemanticSource {
  readonly exportName: string;
}
```

Source identity exists for:

- diagnostics;
- deterministic ownership identity;
- browser entry planning;
- traceability.

Source text should not be copied into every semantic record.

---

## 20. Expansion

Expansion interprets route entries under a semantic context.

For normal tree entries:

```text
parent context
→ child entry
→ expanded destination
```

For owned routes:

```text
slot context
+ routesFor entries
→ expanded owned destinations
```

Expansion preserves provenance:

```ts
interface SemanticProvenance {
  readonly source: SemanticSource;
  readonly slotId?: string;
  readonly routeSetId?: string;
}
```

Expanded routes may be flat for matching, while slots and route-set identities remain present in the semantic program.

---

## 21. Semantic invariants

A valid Waypoint semantic program must satisfy the following invariants.

### Identity

- slot IDs are globally unique;
- route names are globally unique where named navigation requires it;
- route-set identities are deterministic and unique;
- outlet names are unique within one route group.

### Ownership

- every `routesFor()` declaration targets an existing slot;
- one slot has at most one `routesFor()` owner in Semantic Model v1;
- `routesFor()` entries may contain layouts, redirects, routes, and nested route slots;
- route ownership forms an acyclic hierarchy;
- nested slots inherit the complete context in which they are declared;
- empty slots are valid;
- a route set cannot target itself recursively through route ownership;
- owned routes preserve slot and source provenance.

### Paths

- compiled primary route paths are unique within the same layout context;
- normalized route patterns are unambiguous;
- parameter names are unique across the full composed path;
- schemas agree with the complete composed path.

### Rendering

- a named outlet route requires a primary route for the same destination;
- redirects cannot own named outlets;
- rendering outlets and route slots remain separate concepts.

### Policies

- policy values must be statically representable when used by server artifacts;
- inherited policy chains remain visible to authorization planning.

### Sources

- protected or independently delivered route sets require an exported source boundary;
- source identities must be stable enough for deterministic planning.

---

## 22. Artifact derivation

Artifacts are derived from the semantic model.

They are not semantic language entities.

Conceptually:

```text
SemanticRoutesFor
      ↓
Artifact Planner
      ↓
Browser entry
Server metadata
Manifest record
Bundled JavaScript artifact
```

The planner may derive identity from:

```text
slot ID
+ source file identity
+ export name
```

The public Waypoint API does not expose artifact filenames, hashes, bundler chunks, or deployment URLs.

---

## 23. Large-application representation

The semantic model is conceptual.

A compiler implementation should avoid materializing one large duplicated object graph.

Recommended internal representation:

```ts
interface SemanticProgramStore {
  readonly strings: readonly string[];
  readonly sources: readonly SourceRecord[];
  readonly entries: readonly EntryRecord[];
  readonly contexts: readonly ContextRecord[];
  readonly slots: readonly SlotRecord[];
  readonly routeSets: readonly RouteSetRecord[];
}
```

Records may refer to interned strings and table indexes.

Example:

```ts
interface SlotRecord {
  readonly id: number;
  readonly context: number;
  readonly source: number;
}
```

```ts
interface ContextRecord {
  readonly parent: number;
  readonly path: number;
  readonly layout: number;
  readonly policy: number;
  readonly providers: number;
}
```

### Allocation rules

Implementations should:

- use parent-linked contexts rather than copied layout arrays;
- intern repeated strings where beneficial;
- share immutable schemas and policies;
- avoid `flatMap()` over large route groups;
- retain source spans instead of copied source text;
- materialize full chains only for diagnostics or final outputs;
- emit shards incrementally where practical.

These are implementation constraints, not changes to language meaning.

---

## 24. Relationship to the runtime

The runtime consumes a validated interpretation of the semantic model.

It may receive:

- flat compiled route groups;
- named-route indexes;
- slot indexes;
- route-set provenance;
- parsed schemas;
- lifecycle definitions;
- rendering metadata.

The runtime must not reinterpret route meaning differently from the build compiler.

A path accepted by the build compiler must have the same composition and matching semantics at runtime.

---

## 25. Relationship to the compiler

The compiler performs:

```text
TypeScript syntax
→ semantic declarations
→ semantic validation
→ context expansion
→ artifact planning
→ emission
```

TypeScript is the host syntax.

Waypoint is the embedded navigation language.

The semantic model is the boundary between source analysis and compilation outputs.

AST nodes must not escape into validation, expansion, planning, or emitters.

---

## 26. Semantic Model v1 scope

Semantic Model v1 includes:

- routes;
- redirects;
- layouts;
- frames;
- route slots;
- `routesFor()` ownership;
- named rendering outlets;
- path and query schemas;
- policy chains;
- provider contexts;
- source provenance;
- deterministic ownership identity.

Semantic Model v1 does not yet define:

- optional path segments;
- wildcard syntax;
- multiple owners per slot;
- route-set ordering;
- explicit route-set dependency declarations beyond hierarchical ownership;
- artifact signing;
- incremental compiler caching;
- module federation;
- remote route catalogs;
- runtime mutation semantics.

These may be added only through explicit semantic extensions.

---

## 27. Canonical example

```ts
export const routes = [
  route('/login', LoginPage, {
    name: 'login',
    policy: {
      allowAnonymous: true,
    },
  }),

  layout('/app', AppLayout, [
    route('/home', HomePage, {
      name: 'home',
    }),

    layout('/admin', AdminLayout, [
      routeSlot('administration'),
    ]),
  ]),
] as const;
```

```ts
export const administrationRoutes = routesFor(
  'administration',
  [
    route(
      '/users/:userId',
      frame(UserPage, {
        prepare: [
          async context => ({
            user: await loadUser(
              context.params.userId,
              context.signal,
            ),
          }),
        ],
      }),
      {
        name: 'adminUser',
        paramsSchema: {
          userId: s.number({ min: 1 }),
        },
        policy: {
          roles: ['admin'],
          permissions: ['users.read'],
        },
      },
    ),

    route('/settings', SettingsPage, {
      name: 'adminSettings',
    }),
  ],
);
```

Semantic results:

```text
Slot:
  id: administration
  path context: /app/admin
  layouts: AppLayout → AdminLayout

Route set:
  source export: administrationRoutes
  target slot: administration

Expanded routes:
  /app/admin/users/:userId
  /app/admin/settings

Ownership provenance:
  slot: administration
  route set: administrationRoutes
```

The slot remains present in the semantic program after expansion.

The artifact planner may derive one independently deliverable route artifact from `administrationRoutes`, but that artifact is not part of the semantic model itself.

---

## 28. Guiding principle

The semantic model should remain stable even if Waypoint changes:

- TypeScript helper syntax;
- internal compiler stages;
- Angular adapter details;
- bundler implementation;
- manifest serialization;
- server delivery protocol.

The central principle is:

> Waypoint declarations describe navigation meaning.  
> Compiler and runtime artifacts are derived representations of that meaning.