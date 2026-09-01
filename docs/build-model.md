# Waypoint build model

Waypoint has one build owner: `@epikodelabs/waypoint-builder`.

The TypeScript implementation lives under:

```text
projects/tools/builder/src/
  compiler/
  waypoint-build/
```

`src/compiler` is an internal build pipeline, not a separately packaged compiler.

Before Angular invokes the custom builder, the builder package is compiled to one
generated CommonJS entry:

```text
projects/tools/builder/dist/waypoint-build/index.cjs
```

`builders.json` points only at that generated entry. Generated JavaScript is not
checked into `src`.

The application build then performs:

```text
authored route definitions
        ↓
analyze + plan
        ↓
prepare generated host inputs
        ↓
Angular application build
        ↓
host-isolation check
        ↓
protected artifact build
        ↓
atomic artifact + server metadata publication
```

For App2, one client build generation owns all related output:

```text
dist/app2-client/
  browser/
  protected/
  .waypoint/
    server/
```

There is no parallel `dist/waypoint-generated` compiler output and no separate
compiler CLI in the normal application build path.