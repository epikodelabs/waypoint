import {
  extractRouteParamNames,
  normalizeRoutePattern,
} from '../ir/route-path.js';
import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  CompiledRouteBranch,
  CompiledRouteModel,
  ParsedSchema,
} from '../ir/model.js';

export interface ValidateRouteGraphResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export function validateRouteGraph(model: CompiledRouteModel): ValidateRouteGraphResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const names = new Map<string, CompiledRouteBranch>();
  const literalPaths = new Map<string, CompiledRouteBranch>();
  const patterns = new Map<string, CompiledRouteBranch>();
  const routeSetIds = new Set<string>();

  for (const routeSet of model.routeSets) {
    if (routeSetIds.has(routeSet.id)) {
      diagnostics.push(diagnostic('WPT2201', 'error', `Duplicate route-set id "${routeSet.id}".`, routeSet.source));
    }
    routeSetIds.add(routeSet.id);
  }

  for (const branch of model.branches) {
    validateBranch(branch, diagnostics);

    if (branch.name) {
      const previous = names.get(branch.name);
      if (previous) {
        diagnostics.push(diagnostic(
          'WPT2202',
          'error',
          `Duplicate route name "${branch.name}" for paths "${previous.path}" and "${branch.path}".`,
          branch.source,
          { routePath: branch.path, routeName: branch.name },
        ));
      } else {
        names.set(branch.name, branch);
      }
    }

    const previousPath = literalPaths.get(branch.path);
    if (previousPath) {
      diagnostics.push(diagnostic(
        'WPT2203',
        'error',
        `Duplicate compiled route path "${branch.path}".`,
        branch.source,
        { routePath: branch.path, routeName: branch.name },
      ));
    } else {
      literalPaths.set(branch.path, branch);
    }

    const pattern = normalizeRoutePattern(branch.path);
    const previousPattern = patterns.get(pattern);
    if (previousPattern && previousPattern.path !== branch.path) {
      diagnostics.push(diagnostic(
        'WPT2204',
        'error',
        `Conflicting route patterns "${previousPattern.path}" and "${branch.path}".`,
        branch.source,
        { routePath: branch.path, routeName: branch.name },
      ));
    } else {
      patterns.set(pattern, branch);
    }
  }

  return { diagnostics };
}

function validateBranch(
  branch: CompiledRouteBranch,
  diagnostics: RouteCompilerDiagnostic[],
): void {
  let params: readonly string[];
  try {
    params = extractRouteParamNames(branch.path);
  } catch (error) {
    diagnostics.push(diagnostic(
      'WPT2210',
      'error',
      error instanceof Error ? error.message : String(error),
      branch.source,
      { routePath: branch.path, routeName: branch.name },
    ));
    return;
  }

  const seen = new Set<string>();
  for (const name of params) {
    if (seen.has(name)) {
      diagnostics.push(diagnostic(
        'WPT2211',
        'error',
        `Duplicate path parameter ":${name}" in compiled route "${branch.path}".`,
        branch.source,
        { routePath: branch.path, routeName: branch.name },
      ));
    }
    seen.add(name);
  }

  if (branch.paramsSchema) {
    for (const [name, schema] of Object.entries(branch.paramsSchema)) {
      if (!seen.has(name)) {
        diagnostics.push(diagnostic(
          'WPT2212',
          'error',
          `paramsSchema declares "${name}", but compiled route "${branch.path}" does not contain ":${name}".`,
          branch.source,
          { routePath: branch.path, routeName: branch.name },
        ));
      }
      if (containsOptional(schema)) {
        diagnostics.push(diagnostic(
          'WPT2213',
          'error',
          `Path parameter schema "${name}" cannot be optional.`,
          branch.source,
          { routePath: branch.path, routeName: branch.name },
        ));
      }
    }
  }

  const outletNames = new Set<string>();
  for (const outlet of branch.outlets) {
    if (outletNames.has(outlet.outlet)) {
      diagnostics.push(diagnostic(
        'WPT2214',
        'error',
        `Duplicate named outlet "${outlet.outlet}" for route "${branch.path}".`,
        branch.source,
        { routePath: branch.path, routeName: branch.name },
      ));
    }
    outletNames.add(outlet.outlet);
  }

  if (branch.kind === 'redirect' && branch.outlets.length > 0) {
    diagnostics.push(diagnostic(
      'WPT2215',
      'error',
      `Redirect route "${branch.path}" cannot have named outlets.`,
      branch.source,
      { routePath: branch.path, routeName: branch.name },
    ));
  }
}

function containsOptional(schema: ParsedSchema): boolean {
  return schema.kind === 'optional';
}
export { validateRouteGraph as validateNavigation };
