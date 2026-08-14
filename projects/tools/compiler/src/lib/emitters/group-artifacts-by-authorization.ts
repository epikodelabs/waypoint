import type { PlannedRouteArtifact } from '../compiler/contracts.js';
import type { AuthorizationDomain } from '../planning/authorization-domain.js';
import { domainKey } from '../planning/shared-bundles.js';

export interface AuthorizationArtifactGroup {
  readonly key: string;
  readonly authorization: AuthorizationDomain;
  readonly artifacts: readonly PlannedRouteArtifact[];
}

export function groupArtifactsByAuthorization(
  artifacts: readonly PlannedRouteArtifact[],
): readonly AuthorizationArtifactGroup[] {
  const groups = new Map<string, { authorization: AuthorizationDomain; artifacts: PlannedRouteArtifact[] }>();
  for (const artifact of artifacts) {
    const key = domainKey(artifact.authorization);
    let group = groups.get(key);
    if (!group) {
      group = { authorization: artifact.authorization, artifacts: [] };
      groups.set(key, group);
    }
    group.artifacts.push(artifact);
  }
  return Object.freeze([...groups.entries()]
    .map(([key, group]) => Object.freeze({
      key,
      authorization: group.authorization,
      artifacts: Object.freeze(group.artifacts.sort((a, b) => a.artifactKey.localeCompare(b.artifactKey))),
    }))
    .sort((a, b) => a.key.localeCompare(b.key)));
}
