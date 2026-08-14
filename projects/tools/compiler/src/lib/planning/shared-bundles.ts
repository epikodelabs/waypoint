import {
  canContainAuthorizationDomain,
  type AuthorizationDomain,
} from './authorization-domain.js';

export interface ArtifactConsumer {
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
}

export interface SharedBundleGroup {
  readonly key: string;
  readonly authorization: AuthorizationDomain;
  readonly consumers: readonly string[];
}

/**
 * Computes a safe shared-bundle audience.
 *
 * Sharing is permitted only when one exact authorization domain can safely
 * contain code for every consumer. If no such domain exists, return undefined
 * and let the bundler duplicate the dependency.
 */
export function planSharedBundle(
  consumers: readonly ArtifactConsumer[],
): SharedBundleGroup | undefined {
  if (consumers.length < 2) return undefined;

  const candidates = consumers
    .map(consumer => consumer.authorization)
    .filter(candidate =>
      consumers.every(consumer =>
        canContainAuthorizationDomain(consumer.authorization, candidate),
      ),
    );

  const authorization = mostRestrictiveCommonCandidate(candidates);
  if (!authorization) return undefined;

  const keys = consumers.map(consumer => consumer.artifactKey).sort();
  return Object.freeze({
    key: `shared:${domainKey(authorization)}:${keys.join('+')}`,
    authorization,
    consumers: Object.freeze(keys),
  });
}

function mostRestrictiveCommonCandidate(
  candidates: readonly AuthorizationDomain[],
): AuthorizationDomain | undefined {
  return [...candidates].sort((left, right) =>
    requirementCount(right) - requirementCount(left)
  )[0];
}

function requirementCount(domain: AuthorizationDomain): number {
  return domain.roles.length + domain.permissions.length + (domain.allowAnonymous ? 0 : 1);
}

export function domainKey(domain: AuthorizationDomain): string {
  const anonymous = domain.allowAnonymous ? 'public' : 'protected';
  const roles = domain.roles.length ? `r-${domain.roles.join('.')}` : 'r-none';
  const permissions = domain.permissions.length
    ? `p-${domain.permissions.join('.')}`
    : 'p-none';
  return `${anonymous}__${roles}__${permissions}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
}
