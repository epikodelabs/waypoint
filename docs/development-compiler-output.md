# Development compiler-output selection

`npm run start:server` runs the route compiler as a prerequisite.

Development compilation publishes to:

`dist/waypoint-generated/server`

A previously built production application may leave:

`dist/app2-server/waypoint`

on disk at the same time.

The development server must prefer the fresh
`dist/waypoint-generated/server/server-index.json` when it exists. The packaged
output is a fallback for environments where the development compiler output is
not present.

`WAYPOINT_OUTPUT_ROOT` and `WAYPOINT_SERVER_INDEX` still override automatic
selection explicitly.
