/*
ResolvedWaypointOptions:

BEFORE
  readonly routesExport: string;

AFTER
  readonly routesExport?: string;

resolveWaypointOptions():

  routesExport: options?.routesExport

No default of "routes".
*/
