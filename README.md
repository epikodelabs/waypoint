# Regular-client Waypoint refactor

This pass removes `@waypoint-demo/runtime` and the synthetic `projects/apps/shared` project.

The app now owns ordinary local Angular source:

- `app.routes.ts` is the authored navigation entry.
- grouped route contributions live under `app/routes/`.
- application state lives under `app/core/`.
- pages/components live under `app/pages/`.
- route code uses normal relative imports.

The existing route compiler is temporarily pointed at the normal client `app.routes.ts`. The next step is a custom Waypoint Angular builder that consumes this ordinary application graph and emits host/protected partitions without requiring application-specific host-module aliases.
