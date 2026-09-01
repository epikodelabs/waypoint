import {
  RouterReloadError,
  type RouterReloadOptions,
} from './router-contract';

export interface RouterReloadEnvironment {
  readonly fetch?: typeof fetch;
  readonly location?: Pick<
    Location,
    'replace'
  >;
}

export async function reloadRouterApplication(
  options: RouterReloadOptions,
  displayUrl: string,
  environment:
    RouterReloadEnvironment = {},
): Promise<never> {
  const request =
    environment.fetch ?? globalThis.fetch;

  const response = await request(
    '/api/navigation/reload',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        reason:
          options.reason ?? 'reset',
        target:
          options.target ?? displayUrl,
      }),
    },
  );

  if (!response.ok) {
    throw new RouterReloadError(
      response.status,
    );
  }

  const payload: unknown =
    await response.json();
  const location =
    environment.location
      ?? window.location;

  location.replace(
    readReloadLocation(payload),
  );

  return new Promise<never>(() => {});
}

export function readReloadLocation(
  payload: unknown,
): string {
  if (
    !payload
    || typeof payload !== 'object'
    || typeof (
      payload as {
        location?: unknown;
      }
    ).location !== 'string'
  ) {
    throw new Error(
      'Server returned an invalid ' +
      'Waypoint reload response.',
    );
  }

  const location =
    (
      payload as {
        location: string;
      }
    ).location;

  if (
    !location.startsWith('/')
    || location.startsWith('//')
  ) {
    throw new Error(
      'Server returned an unsafe ' +
      'Waypoint reload location.',
    );
  }

  return location;
}
