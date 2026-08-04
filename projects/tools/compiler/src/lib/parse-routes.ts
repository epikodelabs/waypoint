import { createRouteProgram } from './program.js';
import { analyzeRouteGraph } from './route-analyzer.js';
import type {
  PlannedCompilerOutputs,
  ParsedRouteGraph,
  RouteCompilerDiagnostic,
} from './types.js';

export interface ParseRoutesResult {
  readonly graph: ParsedRouteGraph;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export async function parseRoutes(
  planned: PlannedCompilerOutputs,
): Promise<ParseRoutesResult> {
  return analyzeRouteGraph(
    createRouteProgram(
      planned.entry,
    ),
  );
}
