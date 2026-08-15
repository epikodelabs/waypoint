import type {
  NavigationTree,
  RouteContributionDefinition,
} from '@epikodelabs/waypoint';
import {
  registerServerNavigationHostModules,
  type ServerNavigationHostModules,
} from './server-host-runtime';
import {
  isServerNavigationConfiguration,
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
  readonly configurationEndpoint?: string;
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

  /** Complete authorized configuration identity when returned by refresh. */
  readonly revision?: string;

  /**
   * Stable delivery identity for each route contribution.
   *
   * `artifactKey + hash` is deliberately kept separate from the route
   * definition so Waypoint can preserve the old contribution object when the
   * server confirms that the executable artifact is unchanged.
   */
  readonly contributionIdentities: Readonly<Record<string, string>>;

  readonly landing?: string;
}

export interface ServerNavigationResolver {
  (
    url: URL,
    context?: ServerNavigationResolverContext,
  ): Promise<ServerResolvedNavigationConfiguration | null>;

  resolveConfiguration(
    context?: ServerNavigationResolverContext,
  ): Promise<ServerResolvedNavigationConfiguration>;
}

interface RouteModule {
  readonly default?: unknown;
}

export class ServerNavigationArtifactLoadError extends Error {
  constructor(
    public readonly descriptor: ServerArtifactDelivery,
    public override readonly cause: unknown,
  ) {
    super(
      `Failed to load server navigation artifact "${descriptor.artifactKey}" from "${descriptor.moduleUrl}".`,
    );
    this.name = 'ServerNavigationArtifactLoadError';
  }
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

  const endpoint =
    normalizeEndpoint(
      options.endpoint
      ?? '/api/navigation/resolve',
    );

  const configurationEndpoint =
    normalizeEndpoint(
      options.configurationEndpoint
      ?? '/api/navigation/configuration',
    );

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

  async function loadDeliveryPlan(
    artifacts: readonly ServerArtifactDelivery[],
    signal?: AbortSignal,
  ): Promise<Readonly<{
    contributions: readonly RouteContributionDefinition[];
    contributionIdentities: Readonly<Record<string, string>>;
  }>> {
    const contributions: RouteContributionDefinition[] = [];
    const contributionIdentities: Record<string, string> = {};

    for (const artifact of artifacts) {
      throwIfAborted(signal);

      if (artifact.kind === 'shared') {
        await importArtifact(artifact);
        continue;
      }

      const contribution =
        await importRouteContribution(artifact);

      const identity =
        deliveryIdentity(artifact);

      const previous =
        contributionIdentities[contribution.id];

      if (
        previous !== undefined
        && previous !== identity
      ) {
        throw new Error(
          `Route contribution "${contribution.id}" was delivered by multiple artifact identities.`,
        );
      }

      contributionIdentities[contribution.id] =
        identity;

      contributions.push(contribution);
    }

    throwIfAborted(signal);

    return Object.freeze({
      contributions:
        Object.freeze(contributions),
      contributionIdentities:
        Object.freeze({
          ...contributionIdentities,
        }),
    });
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

    const plan =
      await loadDeliveryPlan(
        payload.artifacts,
        signal,
      );

    return Object.freeze({
      contributions:
        plan.contributions,
      contributionIdentities:
        plan.contributionIdentities,
    });
  }

  const resolver = async (
    url: URL,
    context: ServerNavigationResolverContext = {},
  ): Promise<ServerResolvedNavigationConfiguration | null> => {
    let retryingArtifact:
      ServerNavigationArtifactLoadError
      | undefined;

    for (let attempt = 0; ; attempt++) {
      try {
        return await resolveOnce(
          url,
          context.signal,
          retryingArtifact,
        );
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

  const resolveConfiguration = async (
    context: ServerNavigationResolverContext = {},
  ): Promise<ServerResolvedNavigationConfiguration> => {
    throwIfAborted(context.signal);

    const response =
      await fetchNavigation(
        configurationEndpoint,
        {
          credentials: 'same-origin',
          headers: Object.freeze({
            Accept: 'application/json',
          }),
          signal: context.signal,
        },
      );

    throwIfAborted(context.signal);

    if (!response.ok) {
      throw new Error(
        `Failed to refresh Waypoint navigation configuration: ${response.status}.`,
      );
    }

    const payload = await response.json();
    throwIfAborted(context.signal);

    if (!isServerNavigationConfiguration(payload)) {
      throw new Error(
        'Server returned an invalid Waypoint navigation configuration.',
      );
    }

    const plan =
      await loadDeliveryPlan(
        payload.artifacts,
        context.signal,
      );

    return Object.freeze({
      contributions:
        plan.contributions,
      contributionIdentities:
        plan.contributionIdentities,
      revision:
        payload.revision,
      landing:
        payload.landing,
    });
  };

  return Object.assign(
    resolver,
    {
      resolveConfiguration,
    },
  );
}

function normalizeEndpoint(endpoint: string): string {
  const normalized = endpoint.trim();
  if (!normalized) {
    throw new Error('Server navigation endpoint must not be empty.');
  }

  return normalized;
}

function normalizeRetryCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Server navigation artifactRefreshRetries must be a non-negative number.');
  }

  return Math.floor(value);
}

function resolutionRequestUrl(
  endpoint: string,
  target: string,
): string {
  const separator =
    endpoint.includes('?')
      ? (endpoint.endsWith('?') || endpoint.endsWith('&') ? '' : '&')
      : '?';

  return `${endpoint}${separator}path=${encodeURIComponent(target)}`;
}

function deliveryIdentity(
  descriptor: ServerArtifactDelivery,
): string {
  return descriptor.identity;
}

function unwrapArtifactLoadError(
  error: ServerNavigationArtifactLoadError,
): Error {
  return error.cause instanceof Error
    ? error.cause
    : new Error(String(error.cause));
}

function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return;

  throw signal.reason instanceof Error
    ? signal.reason
    : new Error('The operation was aborted.');
}

const defaultFetch: ServerNavigationFetch = async (
  input,
  init,
) => {
  return fetch(input, init);
};

const defaultImportModule: ServerNavigationModuleImporter = async (
  moduleUrl,
) => {
  return import(/* @vite-ignore */ moduleUrl);
};

export function isRouteContributionDefinition(
  value: unknown,
): value is RouteContributionDefinition<string, string, NavigationTree> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate =
    value as Partial<RouteContributionDefinition<string, string, NavigationTree>>;

  return candidate.kind === 'route-contribution'
    && typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && typeof candidate.slotId === 'string'
    && candidate.slotId.trim().length > 0
    && Array.isArray(candidate.entries);
}