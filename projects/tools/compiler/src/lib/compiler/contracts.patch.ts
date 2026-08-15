/*
Change:

  readonly routesExport: string;

to:

  readonly routesExport?: string;

in RouteCompilerOptions and PlannedCompilerOutputs.

Do not inject "routes" during normalization anymore.

The compiler should discover the root when no explicit override exists.
*/
