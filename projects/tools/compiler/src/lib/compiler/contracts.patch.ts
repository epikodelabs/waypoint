/*
Deprecate `routesExport`.

RouteCompilerOptions:
  /** @deprecated Entry modules are navigation modules; explicit root export is rarely needed. */
  readonly routesExport?: string;

PlannedCompilerOutputs:
  readonly routesExport?: string;

Do not expose routesExport in the default builder schema anymore after one
compatibility cycle.
*/
