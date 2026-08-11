import type { RouteContributionDefinition } from './navigation-definitions';
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
}

export interface ServerResolvedNavigationConfiguration {
  readonly contributions: readonly RouteContributionDefinition[];
}

export type ServerNavigationResolver = (
  url: URL,
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
  const endpoint = normalizeEndpoint(options.endpoint ?? '/api/navigation/resolve');
  const fetchNavigation = options.fetch ?? defaultFetch;
  const importModule = options.importModule ?? defaultImportModule;
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
      const loaded = await importModule(descriptor.moduleUrl) as RouteModule;
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

  return async (url: URL): Promise<ServerResolvedNavigationConfiguration | null> => {
    const path = `${url.pathname}${url.search}${url.hash}`;
    const response = await fetchNavigation(
      resolutionRequestUrl(endpoint, path),
      {
        credentials: 'same-origin',
        headers: Object.freeze({ Accept: 'application/json' }),
      },
    );

    // Hidden and unknown destinations are intentionally indistinguishable.
    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`Failed to resolve "${path}": ${response.status}.`);
    }

    const payload = await response.json();
    if (!isServerNavigationResolution(payload)) {
      throw new Error(
        `Server returned an invalid Waypoint navigation resolution for "${path}".`,
      );
    }

    const contributions: RouteContributionDefinition[] = [];
    for (const artifact of payload.artifacts) {
      contributions.push(await importArtifact(artifact));
    }

    return Object.freeze({
      contributions: Object.freeze(contributions),
    });
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
