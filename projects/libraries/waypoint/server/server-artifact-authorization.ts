import type {
  ServerArtifactAuthorization,
  ServerArtifactRecord,
  ServerRouteArtifactRecord,
} from './server-artifact';
import type {
  ServerPrincipal,
  ServerRouteBranch,
  ServerRoutePolicy,
} from './server-routing';

export function isServerAuthorizationAllowed(
  authorization: ServerArtifactAuthorization,
  principal?: ServerPrincipal,
): boolean {
  return isServerPolicyAllowed({
    allowAnonymous: authorization.allowAnonymous,
    roles: authorization.roles,
    permissions: authorization.permissions,
  }, principal);
}

export function isServerDeliveryArtifactAuthorized(
  artifact: ServerArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  if (!isServerAuthorizationAllowed(artifact.authorization, principal)) {
    return false;
  }

  if (artifact.kind === 'shared') {
    return true;
  }

  return isRouteArtifactBranchesAuthorized(artifact, branches, principal);
}

function isRouteArtifactBranchesAuthorized(
  artifact: ServerRouteArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  return artifact.branchIds.length > 0
    && artifact.branchIds.every(branchId => {
      const branch = branches.get(branchId);
      return !!branch
        && branch.routeSetId === artifact.routeSetId
        && branch.policies.every(policy =>
          isServerPolicyAllowed(policy, principal));
    });
}

function isServerPolicyAllowed(
  policy: ServerRoutePolicy,
  principal?: ServerPrincipal,
): boolean {
  if (policy.allowAnonymous) return true;
  if (!principal) return false;

  const roles = policy.roles ?? [];
  return (roles.length === 0 || roles.some(role => principal.roles.has(role)))
    && (policy.permissions ?? [])
      .every(permission => principal.permissions.has(permission));
}