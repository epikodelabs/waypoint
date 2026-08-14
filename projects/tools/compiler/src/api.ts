export interface CompileWaypointOptions {
  readonly entry: string;
  readonly artifactTsconfig: string;
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
  readonly artifactsOutput: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
}

export interface CompileWaypointResult {
  readonly success: true;
}

/** Programmatic compiler entry used by build-system integrations. */
export async function compileWaypoint(
  options: CompileWaypointOptions,
): Promise<CompileWaypointResult> {
  const { compileRoutes } = await import('./compile-routes');
  await compileRoutes(options);
  return { success: true };
}
