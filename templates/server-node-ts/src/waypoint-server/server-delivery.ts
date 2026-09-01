export type ServerArtifactDeliveryKind = 'route' | 'shared';

/**
 * Target-resolution descriptor.
 */
export interface ServerArtifactDelivery {
  /** Route artifacts contribute routes; shared artifacts are import-only dependencies. */
  readonly kind?: ServerArtifactDeliveryKind;
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}

/**
 * Full-configuration refresh descriptor.
 *
 * `kind` and dependency-aware `identity` are refresh-only metadata; they are
 * not added to ordinary target-resolution responses.
 */
export interface ServerConfigurationArtifactDelivery
  extends ServerArtifactDelivery {
  readonly kind: ServerArtifactDeliveryKind;
  readonly identity: string;
}

/**
 * Complete server-authorized delivery plan for one requested destination.
 */
export interface ServerNavigationResolution {
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

/**
 * Complete authorized executable navigation set used only by revalidate().
 */
export interface ServerNavigationConfiguration {
  readonly revision: string;
  readonly artifacts: readonly ServerConfigurationArtifactDelivery[];
  readonly landing?: string;
}

export function isServerNavigationConfiguration(
  value: unknown,
): value is ServerNavigationConfiguration {
  if (!value || typeof value !== 'object') return false;

  const candidate =
    value as Partial<ServerNavigationConfiguration>;

  return nonEmptyString(candidate.revision)
    && Array.isArray(candidate.artifacts)
    && candidate.artifacts.every(
      isServerConfigurationArtifactDelivery,
    )
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

  const candidate =
    value as Partial<ServerNavigationResolution>;

  if (
    !nonEmptyString(candidate.artifactKey)
    || !Array.isArray(candidate.artifacts)
    || !candidate.artifacts.every(isServerArtifactDelivery)
  ) {
    return false;
  }

  const keys =
    candidate.artifacts.map(
      artifact => artifact.artifactKey,
    );

  return new Set(keys).size === keys.length
    && keys.includes(candidate.artifactKey);
}

export function isServerArtifactDelivery(
  value: unknown,
): value is ServerArtifactDelivery {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate =
    value as Partial<ServerArtifactDelivery>;

  return nonEmptyString(candidate.artifactKey)
    && nonEmptyString(candidate.moduleUrl)
    && nonEmptyString(candidate.hash);
}

export function isServerConfigurationArtifactDelivery(
  value: unknown,
): value is ServerConfigurationArtifactDelivery {
  if (!isServerArtifactDelivery(value)) {
    return false;
  }

  const candidate =
    value as Partial<ServerConfigurationArtifactDelivery>;

  return (
    candidate.kind === 'route'
    || candidate.kind === 'shared'
  ) && nonEmptyString(candidate.identity);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}