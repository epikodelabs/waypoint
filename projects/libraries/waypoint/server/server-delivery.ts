/** Stable wire protocol version for server-resolved Waypoint navigation. */
export const WAYPOINT_SERVER_DELIVERY_VERSION = 2 as const;

export type ServerArtifactDeliveryKind = 'route' | 'shared';

/** One browser-loadable artifact selected and authorized by the server. */
export interface ServerArtifactDelivery {
  readonly kind: ServerArtifactDeliveryKind;
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;

  /**
   * Effective executable identity of this artifact including its transitive
   * dependency content identities. This is deliberately opaque to the browser.
   */
  readonly identity: string;
}

/**
 * Complete server-authorized delivery plan for one requested destination.
 *
 * Artifacts are dependency-first. Shared artifacts may appear in the plan, but
 * only route artifacts contribute `routesFor()` definitions to navigation.
 */
export interface ServerNavigationResolution {
  readonly version: typeof WAYPOINT_SERVER_DELIVERY_VERSION;
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

export interface ServerNavigationConfiguration {
  readonly version: typeof WAYPOINT_SERVER_DELIVERY_VERSION;

  /**
   * Stable identity of the complete authorized executable navigation set.
   * Equal revision means revalidation is a strict no-op.
   */
  readonly revision: string;

  readonly artifacts: readonly ServerArtifactDelivery[];
  readonly landing?: string;
}

export function isServerNavigationConfiguration(
  value: unknown,
): value is ServerNavigationConfiguration {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerNavigationConfiguration>;
  return candidate.version === WAYPOINT_SERVER_DELIVERY_VERSION
    && nonEmptyString(candidate.revision)
    && Array.isArray(candidate.artifacts)
    && candidate.artifacts.every(isServerArtifactDelivery)
    && (
      candidate.landing === undefined
      || (
        nonEmptyString(candidate.landing)
        && candidate.landing.startsWith('/')
        && !candidate.landing.startsWith('//')
      )
    );
}

export function isServerNavigationResolution(
  value: unknown,
): value is ServerNavigationResolution {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerNavigationResolution>;
  return candidate.version === WAYPOINT_SERVER_DELIVERY_VERSION
    && nonEmptyString(candidate.artifactKey)
    && Array.isArray(candidate.artifacts)
    && candidate.artifacts.every(isServerArtifactDelivery);
}

export function isServerArtifactDelivery(
  value: unknown,
): value is ServerArtifactDelivery {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerArtifactDelivery>;
  return (candidate.kind === 'route' || candidate.kind === 'shared')
    && nonEmptyString(candidate.artifactKey)
    && nonEmptyString(candidate.moduleUrl)
    && nonEmptyString(candidate.hash)
    && nonEmptyString(candidate.identity);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}