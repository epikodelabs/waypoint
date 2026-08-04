import { diagnostic } from '../compiler/diagnostics.js';
import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import type { SemanticNavigationProgram } from '../ir/model.js';
export interface StaticEvaluationResult { readonly diagnostics: readonly RouteCompilerDiagnostic[]; }
export async function evaluateStaticRouteData(_parsed: SemanticNavigationProgram): Promise<StaticEvaluationResult> {
  return { diagnostics: [diagnostic('WPT1200', 'info', 'Static metadata is resolved by the AST analyzer; no runtime evaluation was performed.')] };
}
