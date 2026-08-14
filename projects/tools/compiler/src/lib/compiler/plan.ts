import { normalizeCompilerOptions } from './config.js';
import { hasErrors } from './diagnostics.js';
import { buildNavigationIr } from '../ir/build-navigation-ir.js';
import { expandNavigation } from '../ir/expand-navigation.js';
import { planRouteArtifacts } from '../planning/plan-artifacts.js';
import { resolveNavigationProgram } from '../resolution/resolve-navigation-program.js';
import { evaluateStaticRouteData } from '../resolution/evaluate-static-route-data.js';
import { validateExpandedNavigation, validateNavigationIr } from '../validation/validate-navigation.js';
import { validateArtifactPlan } from '../validation/validate-artifact-plan.js';
import type { RouteArtifactPlan, RouteCompilerDiagnostic, RouteCompilerOptions } from './contracts.js';

export interface RouteCompilerPlanResult {
  readonly success: boolean;
  readonly plan?: RouteArtifactPlan;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

/** Analyze navigation and produce the security/artifact plan without emitting files. */
export async function plan(options: RouteCompilerOptions): Promise<RouteCompilerPlanResult> {
  const planned = normalizeCompilerOptions({ ...options, dryRun: true });
  const diagnostics: RouteCompilerDiagnostic[] = [];

  const resolved = await resolveNavigationProgram(planned);
  diagnostics.push(...resolved.diagnostics);
  const semantic = resolved.program;

  const evaluated = await evaluateStaticRouteData(semantic);
  diagnostics.push(...evaluated.diagnostics);

  const navigationIr = buildNavigationIr(semantic);
  diagnostics.push(...validateNavigationIr(navigationIr).diagnostics);
  if (hasErrors(diagnostics)) return freeze(false, undefined, diagnostics);

  const expanded = expandNavigation(navigationIr);
  diagnostics.push(...expanded.diagnostics);
  diagnostics.push(...validateExpandedNavigation(expanded.model).diagnostics);
  if (hasErrors(diagnostics)) return freeze(false, undefined, diagnostics);

  const artifacts = planRouteArtifacts(planned, expanded.model);
  diagnostics.push(...artifacts.diagnostics);
  diagnostics.push(...validateArtifactPlan(artifacts.plan).diagnostics);

  return freeze(!hasErrors(diagnostics), artifacts.plan, diagnostics);
}

function freeze(success: boolean, plan: RouteArtifactPlan | undefined, diagnostics: RouteCompilerDiagnostic[]): RouteCompilerPlanResult {
  return Object.freeze({ success, plan, diagnostics: Object.freeze([...diagnostics]) });
}
