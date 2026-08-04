import { discoverRouteSources } from '../discovery/discover-route-sources.js';
import { createRouteProgram } from '../discovery/program.js';
import { resolveRouteDiscovery } from './resolve-route-discovery.js';
import type { PlannedCompilerOutputs, RouteCompilerDiagnostic } from '../compiler/contracts.js';
import type { ParsedRouteGraph } from '../ir/model.js';

export interface ParseRoutesResult {
  readonly graph: ParsedRouteGraph;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export async function parseRoutes(
  planned: PlannedCompilerOutputs,
): Promise<ParseRoutesResult> {
  const program = createRouteProgram(planned.entry);
  const discovery = discoverRouteSources(program, planned.routesExport);
  return resolveRouteDiscovery(program, discovery);
}