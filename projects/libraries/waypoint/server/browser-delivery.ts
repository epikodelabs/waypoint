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
  readonly endpoint?: string;
  readonly fetch?: ServerNavigationFetch;
  readonly importModule?: ServerNavigationModuleImporter;
  readonly artifactRefreshRetries?: number;
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
 * Browser half of Waypoint Server Delivery Contract v2.
 *
 * The server sends an already-authorized dependency-first artifact plan.
 * Shared artifacts are imported for their module side effects / ESM dependency
 * registration only. Route artifacts must export a routesFor() contribution.
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
  const artifactRefreshRetries = normalizeRetryCount(
    options.artifactRefreshRetries ?? 1,
  );

  const loadedArtifacts = new Map<string, Promise<unknown>>();
  const latestIdentityByArtifact = new Map<string, string>();

  async function importArtifact(
    descriptor: ServerArtifactDelivery,
  ): Promise<unknown> {
    const identity = deliveryIdentity(descriptor);
    const existing = loadedArtifacts.get(identity);
    if (existing) return existing;

    const previousIdentity = latestIdentityByArtifact.get(descriptor.artifactKey);
    if (previousIdentity && previousIdentity !== identity) {
      loadedArtifacts.delete(previousIdentity);
    }
    latestIdentityByArtifact.set(descriptor.artifactKey, identity);

    const pending = (async () => {
      try {
        return await importModule(descriptor.moduleUrl);
      } catch (error) {
        throw new ServerNavigationArtifactLoadError(descriptor, error);
      }
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

  async function importRouteContribution(
    descriptor: ServerArtifactDelivery,
  ): Promise<RouteContributionDefinition> {
    const loaded = await importArtifact(descriptor) as RouteModule;
    const contribution = loaded?.default;

    if (!isRouteContributionDefinition(contribution)) {
      throw new Error(
        `Route artifact "${descriptor.artifactKey}" did not export a route contribution.`,
      );
    }

    return contribution;
  }

  async function resolveOnce(
    url: URL,
    signal?: AbortSignal,
    retryingArtifact?: ServerNavigationArtifactLoadError,
  ): Promise<ServerResolvedNavigationConfiguration | null> {
    throwIfAborted(signal);
    const target = `${url.pathname}${url.search}${url.hash}`;
    const response = await fetchNavigation(
      resolutionRequestUrl(endpoint, target),
      {
        credentials: 'same-origin',
        headers: Object.freeze({ Accept: 'application/json' }),
        signal,
      },
    );

    throwIfAborted(signal);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to resolve "${target}": ${response.status}.`);
    }

    const payload = await response.json();
    throwIfAborted(signal);

    if (!isServerNavigationResolution(payload)) {
      throw new Error(
        `Server returned an invalid Waypoint navigation resolution for "${target}".`,
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

      if (artifact.kind === 'shared') {
        await importArtifact(artifact);
        continue;
      }

      contributions.push(await importRouteContribution(artifact));
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
          throw error;
        }
        retryingArtifact = error;
      }
    }
  };
}

/* Existing helpers below this point remain unchanged:
 * normalizeEndpoint, normalizeRetryCount, resolutionRequestUrl,
 * deliveryIdentity, ServerNavigationArtifactLoadError,
 * unwrapArtifactLoadError, throwIfAborted, defaultFetch,
 * defaultImportModule, isRouteContributionDefinition.
 */
