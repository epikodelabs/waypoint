import type { SemanticPolicy } from '../ir/model.js';

export interface AuthorizationDomain {
  readonly allowAnonymous: boolean;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
}

/**
 * A route-set artifact can contain several branches. Its domain must therefore
 * represent the audience allowed to receive the entire artifact.
 *
 * v2 uses the intersection of branch audiences: only requirements common to
 * every branch are safe as artifact-wide requirements. If branches have
 * incompatible policies, the planner reports that the route set must be split.
 */
export function commonAuthorizationDomain(
  policies: readonly SemanticPolicy[],
): AuthorizationDomain {
  if (policies.length === 0) {
    return freeze({ allowAnonymous: true, roles: [], permissions: [] });
  }

  return freeze({
    allowAnonymous: policies.every(policy => policy.allowAnonymous === true),
    roles: intersect(policies.map(policy => policy.roles ?? [])),
    permissions: intersect(policies.map(policy => policy.permissions ?? [])),
  });
}

export function normalizeAuthorizationDomain(
  policy: {
    readonly allowAnonymous?: boolean;
    readonly roles?: readonly string[];
    readonly permissions?: readonly string[];
  } | undefined,
): AuthorizationDomain {
  return freeze({
    allowAnonymous: policy?.allowAnonymous === true,
    roles: Object.freeze([...(policy?.roles ?? [])].sort()),
    permissions: Object.freeze([...(policy?.permissions ?? [])].sort()),
  });
}

export function canContainAuthorizationDomain(
  container: AuthorizationDomain,
  owned: AuthorizationDomain,
): boolean {
  if (container.allowAnonymous && !owned.allowAnonymous) return false;
  return isSuperset(container.roles, owned.roles)
    && isSuperset(container.permissions, owned.permissions);
}

function intersect(groups: readonly (readonly string[])[]): readonly string[] {
  if (groups.length === 0) return Object.freeze([]);
  const [first, ...rest] = groups;
  return Object.freeze(
    [...new Set(first)].filter(value => rest.every(group => group.includes(value))).sort(),
  );
}

function isSuperset(left: readonly string[], right: readonly string[]): boolean {
  const values = new Set(left);
  return right.every(value => values.has(value));
}

function freeze(value: AuthorizationDomain): AuthorizationDomain {
  return Object.freeze({
    allowAnonymous: value.allowAnonymous,
    roles: Object.freeze([...value.roles]),
    permissions: Object.freeze([...value.permissions]),
  });
}
