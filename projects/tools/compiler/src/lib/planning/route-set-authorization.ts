import type { ExpandedNavigationModel, ExpandedRouteSet } from '../ir/model.js';
import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import { toSourceSpan } from '../compiler/diagnostics.js';
import {
  commonAuthorizationDomain,
  type AuthorizationDomain,
} from './authorization-domain.js';

export interface RouteSetAuthorizationResult {
  readonly domain: AuthorizationDomain;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export function deriveRouteSetAuthorization(
  routeSet: ExpandedRouteSet,
  model: ExpandedNavigationModel,
): RouteSetAuthorizationResult {
  const branches = routeSet.branchIds
    .map(id => model.branches.find(branch => branch.id === id))
    .filter((branch): branch is NonNullable<typeof branch> => branch !== undefined);

  const flattened = branches.flatMap(branch => branch.policies);
  const domain = commonAuthorizationDomain(flattened);
  const diagnostics: RouteCompilerDiagnostic[] = [];

  // A single physical artifact cannot safely encode mutually exclusive
  // authorization audiences without broadening delivery. Flag that case so
  // the author/compiler can split the route set before bundling.
  for (const branch of branches) {
    const branchDomain = commonAuthorizationDomain(branch.policies);
    if (!sameDomain(domain, branchDomain) && branch.policies.length > 0) {
      diagnostics.push({
        code: 'WPT3201',
        level: 'error',
        message:
          `Route set "${routeSet.id}" contains branches with different authorization domains. ` +
          `Split the route set so each protected artifact has one delivery audience.`,
        source: toSourceSpan(routeSet.source),
      });
      break;
    }
  }

  return Object.freeze({ domain, diagnostics: Object.freeze(diagnostics) });
}

function sameDomain(left: AuthorizationDomain, right: AuthorizationDomain): boolean {
  return left.allowAnonymous === right.allowAnonymous
    && equal(left.roles, right.roles)
    && equal(left.permissions, right.permissions);
}

function equal(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
