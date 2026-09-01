# Waypoint

**Server-authorized routing for Angular.**

Waypoint is an Angular routing system for apps where authorization controls not just which pages a user can open, but which frontend modules the browser is allowed to receive.

A normal client router ships the full route graph and lazy chunks, then decides whether navigation can proceed. Waypoint adds a stronger boundary: authorization-sensitive route branches stay out of the public bundle and are delivered only after the server authorizes the current user.

**Builder isolates. Server authorizes. Client navigates.**

### Why it exists

Client-side guards are fine for UX and navigation policy, but they run after the code has already reached the browser. That’s enough when the frontend is meant to be public. It’s less ideal for admin areas, licensed modules, tenant-specific features, or internal tools where the code itself shouldn’t be freely available.

Waypoint treats protected frontend navigation as a delivery problem:

1. Browser requests a destination  
2. Server matches the route and checks the principal  
3. Server authorizes the full artifact dependency chain  
4. Only authorized modules are sent  
5. Client installs the routes and commits navigation  

The browser never needs the complete protected route catalog or implementations up front.

Waypoint does **not** replace backend authorization. Every protected API still has to authorize its caller on its own.

### Architecture

Three layers, each handling a different failure mode:

| Layer     | Job |
|-----------|-----|
| **Builder** | Turns authored navigation into public + protected artifacts and enforces isolation |
| **Server**  | Decides which protected routes and artifacts a principal may receive |
| **Client**  | Resolves, installs, and navigates authorized config without inconsistent UI state |

None of them can stand in for the others.

### Builder

The build-time boundary between ordinary public code and server-delivered route modules.

It analyzes the route tree, ownership, and authorization relationships, then produces a coherent generation:

```
authored navigation
        ↓
route & ownership analysis
        ↓
authorization validation
        ↓
artifact planning
        ↓
Angular compilation
        ├── public host
        └── protected artifacts
                ↓
          server metadata
```

Typical output:

```
dist/app/
├── browser/          public Angular app
├── protected/        server-delivered route artifacts
└── .waypoint/server/ server routing metadata
```

`protected/` is not a security boundary by itself — it must not be served as ordinary static files. Delivery goes through the Waypoint server.

**Ownership** is expressed with `routeSlot()` and `routesFor()`. Nested slots keep the ownership tree intact. A child can only preserve or tighten its parent’s requirements; it can never broaden them.

**Physical isolation** matters too. Angular components, directives, and providers form their own dependency graph. The Builder checks that protected code doesn’t leak into the public host or into artifacts with weaker authorization.

Protected artifacts are content-addressed and published as one complete generation. A new generation only becomes active after everything it references is ready. Partial builds never get published.

### Server

The authority for protected route disclosure.

It takes the Builder’s metadata, a URL, and the current principal, then:

- Matches the route  
- Authorizes  
- Resolves the full artifact dependency chain  
- Returns an authorized delivery plan  

It authorizes the entire chain, not just the final module.

Routing metadata is treated as a coherent snapshot. A new generation is prepared fully before it becomes active, so requests never see a mix of two builds.

Unknown, obsolete, or unauthorized artifacts all return `404`. This isn’t security through obscurity — authorization still happens — it just avoids leaking the protected catalog through different error codes. Protected responses are principal-sensitive and not shared-cacheable.

The core model is framework-neutral. Express (or similar) just adapts HTTP; auth, sessions, and app composition stay with the host.

### Client

An Angular router that can extend its configuration mid-navigation.

Known routes behave normally. Protected destinations may need a server round-trip and module installation:

```
navigate
   ↓
destination not installed
   ↓
server resolution
   ↓
authorized artifacts
   ↓
load & install routes
   ↓
prepare destination
   ↓
commit
```

The key is keeping navigation correct while config arrives asynchronously.

Newer navigations cancel older ones. History and named outlets stay consistent. Only a fully prepared, still-current navigation becomes visible UI.

Protected artifacts share the host runtime (via a bridge) so dependency injection and framework identity stay coherent.

Authorization can change at runtime (permission, license, tenant). Waypoint can replace configuration and revalidate the current destination. Revocation removes a contribution from active navigation, but it can’t erase already-downloaded JavaScript — that’s a browser limit. Full principal/tenant switches can force a document navigation for a clean realm.

### Authoring

Routes stay compact:

```ts
const projectRoute = route(
  '/projects/:projectId',
  ProjectPage,
  {
    name: 'project',
    params: { projectId: s.number({ min: 1 }) },
    query: { tab: s.string('overview') },
  },
);
```

Named navigation is inferred:

```ts
await router.navigateTo.project({
  params: { projectId: 42 },
  query: { tab: 'activity' },
});
```

The compiler catches misspelled names, missing params, and type mismatches. Runtime schemas validate external URLs.

### Ownership & policies

Public root exposes only server-controlled slots:

```ts
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
```

Contributions attach to slots:

```ts
export const applicationRoutes = routesFor(
  'application',
  'application-core',
  applicationEntries,
);
```

Nested slots use dynamic imports to express ownership (the Builder decides physical artifacts).

Policies live on the route:

```ts
route('/admin', AdminPage, {
  name: 'admin',
  policy: {
    roles: ['admin'],
    permissions: ['admin:read'],
  },
});
```

Builder uses them for validation; Server uses them for delivery decisions. Client lifecycle checks are still useful for UX, but they’re not the security boundary.

### Lazy loading vs protected delivery

| Lazy loading              | Protected delivery                     |
|---------------------------|----------------------------------------|
| Controls **when** code loads | Controls **whether** the principal may receive it |
| Public deployment chunks  | Server-authorized artifacts            |
| Performance concern       | Authorization & disclosure concern     |

A protected route is naturally on-demand, but “lazy” isn’t what makes it protected.

### Build & deployment

One build owner: `@epikodelabs/waypoint-builder`.

Order:

```
Waypoint Builder → Client → Server
```

```bash
npm run build:builder
npm run build:client
npm run build:server
```

Client runs before Server because it produces the protected artifacts and metadata the server needs.

Deployment boundary:

```
browser/          → public static
protected/        → NOT public; served through authorization
.waypoint/server/ → server-only metadata
```

Serving `protected/` statically defeats the model.

### Security model (three guarantees)

1. **Build isolation** — Protected implementation doesn’t leak into the public host or broader-authorization artifacts.  
2. **Delivery authorization** — Server authorizes the principal before returning the full required artifact chain. Knowing a URL or hash isn’t enough.  
3. **Navigation integrity** — Only current, fully prepared navigation commits. Failed/cancelled/superseded work never becomes active UI.

Backend data and API authorization remain independent.

### Atomicity

A shared principle across all three layers:

> Never expose a partially transitioned state.

- Builder publishes a complete generation  
- Server activates a complete snapshot  
- Client commits a complete navigation  

### When to use it

Good fit for:

- Admin / internal areas  
- Permission-specific frontend capabilities  
- Tenant-specific navigation  
- Licensed modules  
- Server-composed branches  
- Any frontend code whose disclosure itself matters  

If the entire frontend is intentionally public, a conventional router is simpler.

Waypoint is for the other case: **when what the browser is allowed to know is part of the architecture.**

### Core API

| API | Role |
|-----|------|
| `route()` | Define an eager or lazy destination |
| `layout()` | Compose eager or lazy route structure |
| `frame()` | Define reusable navigation lifecycle |
| `redirect()` | Define a redirect |
| `routeSlot()` | Declare ownership boundary |
| `routesFor()` | Contribute routes to a boundary |
| `navigateTo` / `hrefTo` | Typed named navigation |
| `replaceConfiguration()` | Replace runtime config |
| `revalidate()` | Reevaluate current destination |

### License

MIT