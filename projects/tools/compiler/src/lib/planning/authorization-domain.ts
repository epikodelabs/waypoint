export interface AuthorizationDomain {
  readonly allowAnonymous: boolean;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
}

export const PUBLIC_AUTHORIZATION_DOMAIN: AuthorizationDomain = Object.freeze({
  allowAnonymous: true,
  roles: Object.freeze([]),
  permissions: Object.freeze([]),
});

export function normalizeAuthorizationDomain(
  policy: {
    readonly allowAnonymous?: boolean;
    readonly roles?: readonly string[];
    readonly permissions?: readonly string[];
  } | undefined,
): AuthorizationDomain {
  return Object.freeze({
    allowAnonymous: policy?.allowAnonymous === true,
    roles: Object.freeze(unique(policy?.roles)),
    permissions: Object.freeze(unique(policy?.permissions)),
  });
}

/**
 * Returns true when every principal admitted by `candidate` is also admitted
 * by `container`.
 *
 * This is intentionally conservative. Roles and permissions are requirements,
 * not a numeric privilege rank. A bundle may be placed in another domain only
 * when the latter is at least as restrictive for all represented dimensions.
 */
export function canContainAuthorizationDomain(
  container: AuthorizationDomain,
  candidate: AuthorizationDomain,
): boolean {
  if (candidate.allowAnonymous && !container.allowAnonymous) return true;
  if (container.allowAnonymous && !candidate.allowAnonymous) return false;

  return (
    isSuperset(container.roles, candidate.roles) &&
    isSuperset(container.permissions, candidate.permissions)
  );
}

function unique(values: readonly string[] | undefined): readonly string[] {
  return [...new Set(values ?? [])].sort();
}

function isSuperset(
  stricterRequirements: readonly string[],
  weakerRequirements: readonly string[],
): boolean {
  const weaker = new Set(weakerRequirements);
  return stricterRequirements.every(value => weaker.has(value));
}
