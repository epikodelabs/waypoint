import { discoverRouteSources } from '../discovery/discover-route-sources.js';
import { createRouteProgram } from '../discovery/program.js';
import { buildSemanticProgram } from './build-semantic-program.js';
import type { PlannedCompilerOutputs, RouteCompilerDiagnostic } from '../compiler/contracts.js';
import type { SemanticNavigationProgram } from '../ir/model.js';

export interface ResolveNavigationProgramResult {
  readonly program: SemanticNavigationProgram;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export async function resolveNavigationProgram(
  planned: PlannedCompilerOutputs,
): Promise<ResolveNavigationProgramResult> {
  const program = createRouteProgram(planned.entry);
  const discovery = discoverRouteSources(program, planned.routesExport);
  return buildSemanticProgram(program, discovery);
}