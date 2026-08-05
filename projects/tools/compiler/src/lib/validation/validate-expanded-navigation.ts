import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import { diagnostic } from '../compiler/diagnostics.js';
import { extractRouteParamNames, normalizeRoutePattern } from '../ir/route-path.js';
import type { ExpandedNavigationModel, ExpandedRouteBranch } from '../ir/model.js';
import { NavigationDiagnosticCode as Code } from './diagnostic-codes.js';
import type { NavigationValidationResult } from './validation-result.js';

export function validateExpandedNavigation(
  model: ExpandedNavigationModel,
): NavigationValidationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const names = new Map<string, ExpandedRouteBranch>();
  const literalPaths = new Map<string, ExpandedRouteBranch>();
  const patterns = new Map<string, ExpandedRouteBranch>();
  const routeSetIds = new Set<string>();

  for (const routeSet of model.routeSets) {
    if (routeSetIds.has(routeSet.id)) {
      diagnostics.push(diagnostic(Code.duplicateRouteSetIdentity, 'error', `Duplicate route-set id "${routeSet.id}".`, routeSet.source));
    }
    routeSetIds.add(routeSet.id);
  }

  for (const branch of model.branches) {
    validateBranch(branch, diagnostics);
    if (branch.name) {
      const previous = names.get(branch.name);
      if (previous) diagnostics.push(diagnostic(Code.duplicateRouteName, 'error', `Duplicate route name "${branch.name}" for paths "${previous.path}" and "${branch.path}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
      else names.set(branch.name, branch);
    }
    const previousPath = literalPaths.get(branch.path);
    if (previousPath) diagnostics.push(diagnostic(Code.duplicateRoutePath, 'error', `Duplicate expanded route path "${branch.path}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
    else literalPaths.set(branch.path, branch);
    const pattern = normalizeRoutePattern(branch.path);
    const previousPattern = patterns.get(pattern);
    if (previousPattern && previousPattern.path !== branch.path) diagnostics.push(diagnostic(Code.conflictingRoutePattern, 'error', `Conflicting route patterns "${previousPattern.path}" and "${branch.path}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
    else patterns.set(pattern, branch);
  }
  return { diagnostics };
}

function validateBranch(branch: ExpandedRouteBranch, diagnostics: RouteCompilerDiagnostic[]): void {
  let params: readonly string[];
  try {
    params = extractRouteParamNames(branch.path);
  } catch (error) {
    diagnostics.push(diagnostic(Code.invalidPath, 'error', error instanceof Error ? error.message : String(error), branch.source, { routePath: branch.path, routeName: branch.name }));
    return;
  }
  const seen = new Set<string>();
  for (const name of params) {
    if (seen.has(name)) diagnostics.push(diagnostic(Code.duplicatePathParameter, 'error', `Duplicate path parameter ":${name}" in expanded route "${branch.path}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
    seen.add(name);
  }
  if (branch.paramsSchema) {
    for (const name of Object.keys(branch.paramsSchema)) {
      if (!seen.has(name)) diagnostics.push(diagnostic(Code.schemaParameterMissingFromPath, 'error', `paramsSchema declares "${name}", but expanded route "${branch.path}" does not contain ":${name}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
    }
  }
  const outletNames = new Set<string>();
  for (const outlet of branch.outlets) {
    if (outletNames.has(outlet.outlet)) diagnostics.push(diagnostic(Code.duplicateOutlet, 'error', `Duplicate named outlet "${outlet.outlet}" for route "${branch.path}".`, branch.source, { routePath: branch.path, routeName: branch.name }));
    outletNames.add(outlet.outlet);
  }
  if (branch.kind === 'redirect' && branch.outlets.length > 0) diagnostics.push(diagnostic(Code.redirectWithOutlets, 'error', `Redirect route "${branch.path}" cannot have named outlets.`, branch.source, { routePath: branch.path, routeName: branch.name }));
}