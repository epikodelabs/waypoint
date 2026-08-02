import type {
  NavigationTree,
} from '@epikodelabs/waypoint';

interface RouteModule {
  readonly default?: unknown;
}

const importRouteModule =
  new Function(
    'url',
    'return import(url);',
  ) as (
    url: string,
  ) => Promise<RouteModule>;

function isRouteArray(
  value: unknown,
): value is NavigationTree {
  return Array.isArray(value);
}

export async function loadProtectedRouteBranch(
  url: URL,
): Promise<NavigationTree | null> {
  const requestPath =
    `${url.pathname}${url.search}${url.hash}`;
  const response =
    await fetch(
      `/api/routes/module?path=${encodeURIComponent(requestPath)}`,
      {
        credentials: 'same-origin',
        headers: {
          Accept: 'text/javascript',
        },
      },
    );

  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404
  ) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to resolve route branch for ${requestPath}: ${response.status}`,
    );
  }

  const moduleSource =
    await response.text();
  const blobUrl =
    URL.createObjectURL(
      new Blob(
        [moduleSource],
        {
          type: 'text/javascript',
        },
      ),
    );

  try {
    const loaded =
      await importRouteModule(
        blobUrl,
      );
    const branch =
      loaded.default;

    if (!isRouteArray(branch)) {
      throw new Error(
        `Route module for ${requestPath} did not export a route array.`,
      );
    }

    return Object.freeze(
      [...branch],
    ) as NavigationTree;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

