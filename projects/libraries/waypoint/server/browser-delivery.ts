import type { RouteContributionDefinition } from '@epikodelabs/waypoint';
import {
  registerServerNavigationHostModules,
  type ServerNavigationHostModules,
} from './server-host-runtime';
import {
  isServerNavigationResolution,
  type ServerArtifactDelivery,
} from './server-delivery';

export interface ServerNavigationFetchResponse {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
}

export type ServerNavigationFetch = (
  input: string,
  init: Readonly<{
    readonly credentials: 'same-origin';
    readonly headers: Readonly<Record<string, string>>;
    readonly signal?: AbortSignal;
  }>,
) => Promise<ServerNavigationFetchResponse>;

export type ServerNavigationModuleImporter = (
  moduleUrl: string,
) => Promise<unknown>;

export interface ServerNavigationResolverOptions {
  /**
   * Endpoint used to resolve a browser destination on the server.
   * Defaults to `/api/navigation/resolve`.
   */
  readonly endpoint?: string;
  /** Override browser fetch, primarily for non-browser hosts and tests. */
  readonly fetch?: ServerNavigationFetch;
  /** Override dynamic ESM import, primarily for custom loaders and tests. */
  readonly importModule?: ServerNavigationModuleImporter;
  /** Re-resolve once when an artifact URL becomes stale during publication. */
  readonly artifactRefreshRetries?: number;
  /**
   * Module namespaces shared with independently delivered artifacts. At
   * minimum, Angular packages used by protected code and
   * `@epikodelabs/waypoint` must point at the host application's identities.
   */
  readonly hostModules?: ServerNavigationHostModules;
}

export interface ServerNavigationResolverContext {
  readonly signal?: AbortSignal;
}

export interface ServerResolvedNavigationConfiguration {
  readonly contributions: readonly RouteContributionDefinition[];
}

export type ServerNavigationResolver = (
  url: URL,
  context?: ServerNavigationResolverContext,
) => Promise<ServerResolvedNavigationConfiguration | null>;

interface RouteModule {
  readonly default?: unknown;
}

/**
 * Creates the browser half of Waypoint's Server Delivery Contract v1.
 *
 * The resolver asks the server for one already-authorized dependency-first
 * delivery plan, loads each content-addressed artifact, validates its default
 * export as a `routesFor()` contribution, and returns a configuration that can
 * be consumed directly by `RouterOptions.resolveRoutes`.
 */
export function createServerNavigationResolver(
  options: ServerNavigationResolverOptions = {},
): ServerNavigationResolver {
  if (!options.importModule && !options.hostModules) {
    throw new Error(
      'Native server navigation imports require hostModules so delivered Angular artifacts share the host application runtime.',
    );
  }

  if (
    !options.importModule
    && !options.hostModules?.['@epikodelabs/waypoint']
  ) {
    throw new Error(
      'Native server navigation imports require hostModules["@epikodelabs/waypoint"] to share the active Waypoint runtime identity.',
    );
  }

  if (options.hostModules) {
    registerServerNavigationHostModules(options.hostModules);
  }

  const endpoint = normalizeEndpoint(options.endpoint ?? '/api/navigation/resolve');
  const fetchNavigation = options.fetch ?? defaultFetch;
  const importModule = options.importModule ?? defaultImportModule;
  const artifactRefreshRetries = normalizeRetryCount(options.artifactRefreshRetries ?? 1);
  const loadedArtifacts = new Map<
    string,
    Promise<RouteContributionDefinition>
  >();
  const latestIdentityByArtifact = new Map<string, string>();

  async function importArtifact(
    descriptor: ServerArtifactDelivery,
  ): Promise<RouteContributionDefinition> {
    const identity = deliveryIdentity(descriptor);
    const existing = loadedArtifacts.get(identity);
    if (existing) return existing;

    const previousIdentity = latestIdentityByArtifact.get(descriptor.artifactKey);
    if (previousIdentity && previousIdentity !== identity) {
      loadedArtifacts.delete(previousIdentity);
    }
    latestIdentityByArtifact.set(descriptor.artifactKey, identity);

    const pending = (async () => {
      let loaded: RouteModule;
      try {
        loaded = await importModule(descriptor.moduleUrl) as RouteModule;
      } catch (error) {
        throw new ServerNavigationArtifactLoadError(descriptor, error);
      }
      const contribution = loaded?.default;

      if (!isRouteContributionDefinition(contribution)) {
        throw new Error(
          `Artifact "${descriptor.artifactKey}" did not export a route contribution.`,
        );
      }

      return contribution;
    })();

    loadedArtifacts.set(identity, pending);

    try {
      return await pending;
    } catch (error) {
      if (loadedArtifacts.get(identity) === pending) {
        loadedArtifacts.delete(identity);
      }
      if (latestIdentityByArtifact.get(descriptor.artifactKey) === identity) {
        latestIdentityByArtifact.delete(descriptor.artifactKey);
      }
      throw error;
    }
  }

  async function resolveOnce(
    url: URL,
    signal?: AbortSignal,
    retryingArtifact?: ServerNavigationArtifactLoadError,
  ): Promise<ServerResolvedNavigationConfiguration | null> {
    throwIfAborted(signal);
    const path = `${url.pathname}${url.search}${url.hash}`;
    const response = await fetchNavigation(
      resolutionRequestUrl(endpoint, path),
      {
        credentials: 'same-origin',
        headers: Object.freeze({ Accept: 'application/json' }),
        signal,
      },
    );

    throwIfAborted(signal);

    // Hidden and unknown destinations are intentionally indistinguishable.
    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`Failed to resolve "${path}": ${response.status}.`);
    }

    const payload = await response.json();
    throwIfAborted(signal);
    if (!isServerNavigationResolution(payload)) {
      throw new Error(
        `Server returned an invalid Waypoint navigation resolution for "${path}".`,
      );
    }

    if (retryingArtifact) {
      const candidate = payload.artifacts.find(artifact =>
        artifact.artifactKey === retryingArtifact.descriptor.artifactKey,
      );
      if (
        candidate
        && deliveryIdentity(candidate) === deliveryIdentity(retryingArtifact.descriptor)
      ) {
        throw unwrapArtifactLoadError(retryingArtifact);
      }
    }

    const contributions: RouteContributionDefinition[] = [];
    for (const artifact of payload.artifacts) {
      throwIfAborted(signal);
      contributions.push(await importArtifact(artifact));
    }
    throwIfAborted(signal);

    return Object.freeze({
      contributions: Object.freeze(contributions),
    });
  }

  return async (
    url: URL,
    context: ServerNavigationResolverContext = {},
  ): Promise<ServerResolvedNavigationConfiguration | null> => {
    let retryingArtifact: ServerNavigationArtifactLoadError | undefined;
    for (let attempt = 0; ; attempt++) {
      try {
        return await resolveOnce(url, context.signal, retryingArtifact);
      } catch (error) {
        if (
          !(error instanceof ServerNavigationArtifactLoadError)
          || attempt >= artifactRefreshRetries
          || context.signal?.aborted
        ) {
          throw unwrapArtifactLoadError(error);
        }
        retryingArtifact = error;
      }
    }
  };
}

export function isRouteContributionDefinition(
  value: unknown,
): value is RouteContributionDefinition {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<RouteContributionDefinition>;
  return candidate.kind === 'route-contribution'
    && nonEmptyString(candidate.id)
    && nonEmptyString(candidate.slotId)
    && Array.isArray(candidate.entries);
}

class ServerNavigationArtifactLoadError extends Error {
  constructor(
    readonly descriptor: ServerArtifactDelivery,
    override readonly cause: unknown,
  ) {
    super(`Failed to load Waypoint artifact "${descriptor.artifactKey}" (${descriptor.hash}).`);
    this.name = 'ServerNavigationArtifactLoadError';
  }
}

function unwrapArtifactLoadError(error: unknown): unknown {
  if (
    error instanceof ServerNavigationArtifactLoadError
    && error.cause instanceof Error
  ) {
    return error.cause;
  }
  return error;
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (!signal?.aborted) return;
  if (typeof DOMException === 'function') {
    throw new DOMException('The navigation resolution was aborted.', 'AbortError');
  }
  const error = new Error('The navigation resolution was aborted.');
  error.name = 'AbortError';
  throw error;
}

function normalizeRetryCount(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('artifactRefreshRetries must be a non-negative integer.');
  }
  return value;
}

function deliveryIdentity(descriptor: ServerArtifactDelivery): string {
  return `${descriptor.artifactKey}@${descriptor.hash}`;
}


function resolutionRequestUrl(endpoint: string, path: string): string {
  const separator = endpoint.includes('?')
    ? /[?&]$/.test(endpoint) ? '' : '&'
    : '?';
  return `${endpoint}${separator}path=${encodeURIComponent(path)}`;
}

function normalizeEndpoint(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error('Server navigation endpoint must not be empty.');
  }
  return normalized;
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

const defaultFetch: ServerNavigationFetch = async (input, init) => {
  if (typeof fetch !== 'function') {
    throw new Error(
      'Server navigation resolution requires fetch or an explicit fetch option.',
    );
  }

  return fetch(input, init);
};

const defaultImportModule: ServerNavigationModuleImporter = async moduleUrl =>
  import(
    /* @vite-ignore */
    moduleUrl
  );
