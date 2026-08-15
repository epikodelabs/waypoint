/*
Keep the conventional entry default:

  src/app/app.routes.ts

Do NOT add filesystem/main.ts graph discovery for the entry filename.

Reason:
- app.routes.ts is an explicit Angular-facing application boundary;
- app.config.ts imports it directly;
- discovery would make build behavior depend on filename/search heuristics;
- non-standard layouts already have the optional waypoint.entry escape hatch.

Also remove routesExport/rootExport from the builder-facing options now that the
navigation-module export graph is authoritative.
*/
