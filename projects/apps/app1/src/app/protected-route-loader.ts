import type { NavigationTree } from '@epikodelabs/waypoint';

interface ResolveNavigationResponse {
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly moduleUrl: string;
  readonly hash: string;
}

interface RouteModule {
  readonly default?: unknown;
}

const loadedArtifacts =
  new Map<string, Promise<NavigationTree>>();

function isRouteArray(value: unknown): value is NavigationTree {
  return Array.isArray(value);
}

async function getDescriptor(url: string): Promise<ResolveNavigationResponse> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Navigation request failed: ${response.status}.`);
  }

  return response.json() as Promise<ResolveNavigationResponse>;
}

async function importArtifact(
  descriptor: ResolveNavigationResponse,
): Promise<NavigationTree> {
  const existing = loadedArtifacts.get(descriptor.artifactKey);
  if (existing) return existing;

  const pending = (async () => {
    for (const dependency of descriptor.dependencies) {
      await importArtifact(
        await getDescriptor(
          `/api/navigation/artifacts/${encodeURIComponent(dependency)}`,
        ),
      );
    }

    const loaded = await import(
      /* @vite-ignore */
      descriptor.moduleUrl
    ) as RouteModule;

    if (!isRouteArray(loaded.default)) {
      throw new Error(
        `Artifact "${descriptor.artifactKey}" did not export a route array.`,
      );
    }

    return Object.freeze([...loaded.default]) as NavigationTree;
  })();

  loadedArtifacts.set(descriptor.artifactKey, pending);

  try {
    return await pending;
  } catch (error) {
    loadedArtifacts.delete(descriptor.artifactKey);
    throw error;
  }
}

export async function loadProtectedRouteBranch(
  url: URL,
): Promise<NavigationTree | null> {
  const path = `${url.pathname}${url.search}${url.hash}`;
  const response = await fetch(
    `/api/navigation/resolve?path=${encodeURIComponent(path)}`,
    {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    },
  );

  if ([401, 403, 404].includes(response.status)) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to resolve "${path}": ${response.status}.`);
  }

  return importArtifact(
    await response.json() as ResolveNavigationResponse,
  );
}