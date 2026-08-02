import type {
  ParsedRouteGraph,
  RouteCompilerDiagnostic,
} from './types.js';

export interface StaticEvaluationResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export async function evaluateStaticRouteData(
  _parsed: ParsedRouteGraph,
): Promise<StaticEvaluationResult> {
  return {
    diagnostics: [
      {
        level: 'info',
        message:
          'Static route evaluation is scaffolded but not implemented yet.',
      },
    ],
  };
}
