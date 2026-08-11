import type {
  NavigationTree,
  ResolvedNavigationConfiguration,
  RouteContributionDefinition,
  ServerArtifactDelivery,
} from '@epikodelabs/waypoint';
import { isServerNavigationResolution } from '@epikodelabs/waypoint';

interface RouteModule {
  readonly default?: unknown;
}

const loadedArtifacts =
  new Map<string, Promise<RouteContributionDefinition>>();

function isRouteContribution(
  value: unknown,
): value is RouteContributionDefinition {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<RouteContributionDefinition>;

  return candidate.kind === 'route-contribution'
    && typeof candidate.id === 'string'
    && typeof candidate.slotId === 'string'
    && Array.isArray(candidate.entries);
}

async function importArtifact(
  descriptor: ServerArtifactDelivery,
): Promise<RouteContributionDefinition> {
  const cacheKey = `${descriptor.artifactKey}@${descriptor.hash}`;
  const existing = loadedArtifacts.get(cacheKey);
  if (existing) return existing;

  const pending = (async () => {
    const loaded = await import(
      /* @vite-ignore */
      descriptor.moduleUrl
    ) as RouteModule;

    if (!isRouteContribution(loaded.default)) {
      throw new Error(
        `Artifact "${descriptor.artifactKey}" did not export a route contribution.`,
      );
    }

    return loaded.default;
  })();

  loadedArtifacts.set(cacheKey, pending);

  try {
    return await pending;
  } catch (error) {
    loadedArtifacts.delete(cacheKey);
    throw error;
  }
}

export async function loadProtectedRouteBranch(
  url: URL,
): Promise<ResolvedNavigationConfiguration | NavigationTree | null> {
  const path = `${url.pathname}${url.search}${url.hash}`;
  const response = await fetch(
    `/api/navigation/resolve?path=${encodeURIComponent(path)}`,
    {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    },
  );

  // Hidden and unknown routes are intentionally indistinguishable.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to resolve "${path}": ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isServerNavigationResolution(payload)) {
    throw new Error(
      `Server returned an invalid Waypoint navigation resolution for "${path}".`,
    );
  }

  const contributions: RouteContributionDefinition[] = [];

  for (const artifact of payload.artifacts) {
    contributions.push(await importArtifact(artifact));
  }

  return contributions.length > 0
    ? { contributions: Object.freeze(contributions) }
    : null;
}
