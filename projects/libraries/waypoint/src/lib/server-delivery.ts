/** Stable wire protocol version for server-resolved Waypoint navigation. */
export const WAYPOINT_SERVER_DELIVERY_VERSION = 1 as const;

/** One browser-loadable artifact selected and authorized by the server. */
export interface ServerArtifactDelivery {
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}

/**
 * Complete server-authorized delivery plan for one requested destination.
 *
 * Artifacts are dependency-first. `artifactKey` identifies the artifact that
 * contains the requested destination; redirect-followed artifacts may appear
 * later in the same plan. The browser consumes the plan without discovering the server's route,
 * ownership, policy, or artifact graphs.
 */
export interface ServerNavigationResolution {
  readonly version: typeof WAYPOINT_SERVER_DELIVERY_VERSION;
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

export function isServerNavigationResolution(
  value: unknown,
): value is ServerNavigationResolution {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerNavigationResolution>;
  if (
    candidate.version !== WAYPOINT_SERVER_DELIVERY_VERSION
    || !nonEmptyString(candidate.artifactKey)
    || !Array.isArray(candidate.artifacts)
    || candidate.artifacts.length === 0
  ) {
    return false;
  }

  const keys = new Set<string>();

  for (const artifact of candidate.artifacts) {
    if (!isServerArtifactDelivery(artifact) || keys.has(artifact.artifactKey)) {
      return false;
    }
    keys.add(artifact.artifactKey);
  }

  return keys.has(candidate.artifactKey);
}

export function isServerArtifactDelivery(
  value: unknown,
): value is ServerArtifactDelivery {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerArtifactDelivery>;

  return nonEmptyString(candidate.artifactKey)
    && nonEmptyString(candidate.moduleUrl)
    && nonEmptyString(candidate.hash);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}