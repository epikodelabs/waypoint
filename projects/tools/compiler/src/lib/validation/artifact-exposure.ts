import type { RouteArtifactPlan } from '../compiler/contracts.js';

/**
 * Returns the transitive set of artifacts that `artifactKey` is allowed to
 * consume according to the Artifact Plan.
 *
 * This deliberately models ownership/dependency only. Policy ordering
 * (roles/permissions) should be added only after policy is represented
 * explicitly in Artifact Plan v2; guessing privilege strength from names
 * such as "admin" would be unsafe.
 */
export function allowedArtifactDependencies(
  plan: RouteArtifactPlan,
  artifactKey: string,
): ReadonlySet<string> {
  const artifacts = new Map(plan.artifacts.map(item => [item.artifactKey, item]));
  const allowed = new Set<string>();
  const pending = [...(artifacts.get(artifactKey)?.dependencies ?? [])];

  while (pending.length > 0) {
    const key = pending.pop()!;
    if (allowed.has(key)) continue;
    allowed.add(key);
    pending.push(...(artifacts.get(key)?.dependencies ?? []));
  }

  return allowed;
}
