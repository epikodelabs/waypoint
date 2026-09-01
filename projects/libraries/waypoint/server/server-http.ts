import type {
  ServerNavigationConfiguration,
  ServerNavigationResolution,
} from './server-delivery';
import {
  ServerArtifactResolutionError,
  type ServerArtifactRecord,
  type ServerPrincipal,
} from './server-routing';
import type { ServerRouter } from './server-router';

export const WAYPOINT_PRIVATE_NO_STORE_HEADERS = Object.freeze({
  'Cache-Control': 'private, no-store',
  Vary: 'Authorization, Cookie',
} as const);

export const WAYPOINT_MODULE_HEADERS = Object.freeze({
  ...WAYPOINT_PRIVATE_NO_STORE_HEADERS,
  'Content-Type': 'text/javascript; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
} as const);

export type ServerHttpHeaders = Readonly<Record<string, string>>;

export interface ServerResolveRequest {
  readonly target: unknown;
  readonly principal?: ServerPrincipal;
}

export interface ServerModuleRequest {
  readonly artifactKey: unknown;
  readonly hash: unknown;
  readonly principal?: ServerPrincipal;
}

export interface ServerConfigurationRequest {
  readonly principal?: ServerPrincipal;
}

export interface ServerRevalidationOptions {
  readonly landingTargets?: readonly string[];
}

export type ServerReloadReason =
  | 'reset'
  | 'principal-change';

export interface ServerReloadRequest<
  TContext = unknown,
> {
  readonly reason?: unknown;
  readonly target?: unknown;
  readonly principal?: ServerPrincipal;
  readonly context?: TContext;
}

export interface ServerReloadOptions<
  TContext = unknown,
> {
  readonly resetPrincipal?: (context: TContext) => void | Promise<void>;
  readonly publicLocation?: string;
  readonly landingTargets?: readonly string[];
}

export interface ServerReloadResult {
  readonly location: string;
}

export interface ServerJsonResponse<T> {
  readonly kind: 'json';
  readonly status: number;
  readonly headers: ServerHttpHeaders;
  readonly body: T;
}

export interface ServerEmptyResponse {
  readonly kind: 'empty';
  readonly status: number;
  readonly headers: ServerHttpHeaders;
}

export interface ServerArtifactResponse<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> {
  readonly kind: 'artifact';
  readonly status: 200;
  readonly headers: ServerHttpHeaders;
  readonly artifact: TArtifact;
}

export type ServerResolveResponse =
  | ServerJsonResponse<ServerNavigationResolution>
  | ServerJsonResponse<{ readonly error: string }>;

export type ServerModuleResponse<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> = ServerArtifactResponse<TArtifact> | ServerEmptyResponse;

export type ServerReloadResponse =
  | ServerJsonResponse<ServerReloadResult>
  | ServerJsonResponse<{ readonly error: string }>;

export type ServerConfigurationResponse =
  | ServerJsonResponse<ServerNavigationConfiguration>
  | ServerJsonResponse<{ readonly error: string }>;

export interface ServerRouterHttpHandler<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TContext = unknown,
> {
  resolve(request: ServerResolveRequest): Promise<ServerResolveResponse>;
  configuration(
    request: ServerConfigurationRequest,
  ): Promise<ServerConfigurationResponse>;
  module(request: ServerModuleRequest): Promise<ServerModuleResponse<TArtifact>>;
  reload(request: ServerReloadRequest<TContext>): Promise<ServerReloadResponse>;
}

/**
 * Maps the framework-neutral Server Router API to stable HTTP semantics.
 *
 * Unknown and unauthorized routes deliberately share the same 404 response.
 * Direct module requests also collapse missing, stale, and unauthorized
 * artifacts to 404 so HTTP does not become a route or artifact discovery
 * oracle. Compiler publication failures are exposed as 503 only during route
 * resolution, where the server already knows the requested route is routable.
 */
export function createServerRouterHttpHandler<
  TArtifact extends ServerArtifactRecord,
  TContext = unknown,
>(
  router:
    Pick<
      ServerRouter<TArtifact>,
      'resolve' | 'resolveLanding' | 'resolveModule'
    >
    & Partial<
      Pick<
        ServerRouter<TArtifact>,
        'resolveConfiguration'
      >
    >,
  options: Readonly<{
    readonly reload?: ServerReloadOptions<TContext>;
    readonly revalidation?: ServerRevalidationOptions;
  }> = {},
): ServerRouterHttpHandler<TArtifact, TContext> {
  const reloadOptions = options.reload;
  const revalidationOptions = options.revalidation;

  return Object.freeze({
    async resolve(request: ServerResolveRequest) {
      const target = stringValue(request.target);
      if (!target) {
        return json(400, { error: 'Invalid path.' });
      }

      try {
        const resolution = await router.resolve(target, request.principal);
        return resolution
          ? json(200, resolution)
          : json(404, { error: 'Route not found.' });
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) {
          return json(503, { error: 'Navigation artifact unavailable.' });
        }
        throw error;
      }
    },

    async configuration(request: ServerConfigurationRequest) {
      if (!router.resolveConfiguration) {
        return json(501, {
          error: 'Navigation configuration refresh is not configured.',
        });
      }

      try {
        const configuration =
          await router.resolveConfiguration(
            request.principal,
          );

        const landingTargets =
          revalidationOptions?.landingTargets ?? [];

        const landing =
          landingTargets.length > 0
            ? await router.resolveLanding(
                landingTargets,
                request.principal,
              )
            : null;

        return json(200, Object.freeze({
          ...configuration,
          landing: landing ?? undefined,
        }));
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) {
          return json(503, {
            error: 'Navigation artifact unavailable.',
          });
        }
        throw error;
      }
    },

    async module(request: ServerModuleRequest) {
      const artifactKey = stringValue(request.artifactKey);
      const hash = stringValue(request.hash);
      if (!artifactKey || !hash) return empty(404);

      try {
        const artifact = await router.resolveModule(
          artifactKey,
          hash,
          request.principal,
        );

        return artifact
          ? Object.freeze({
              kind: 'artifact' as const,
              status: 200 as const,
              headers: WAYPOINT_MODULE_HEADERS,
              artifact,
            })
          : empty(404);
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) return empty(404);
        throw error;
      }
    },

    async reload(request: ServerReloadRequest<TContext>) {
      const reason = reloadReasonValue(request.reason);
      if (!reason) {
        return json(400, { error: 'Invalid reload reason.' });
      }

      const target = optionalStringValue(request.target);
      if (request.target !== undefined && !target) {
        return json(400, { error: 'Invalid reload target.' });
      }

      const normalizedTarget = target
        ? normalizeInternalTarget(target)
        : null;
      if (target && !normalizedTarget) {
        return json(400, { error: 'Invalid reload target.' });
      }

      if (
        reason === 'principal-change'
        && !reloadOptions?.resetPrincipal
      ) {
        return json(501, {
          error: 'Principal reset is not configured.',
        });
      }

      try {
        let principal = request.principal;
        if (reason === 'principal-change') {
          await reloadOptions!.resetPrincipal!(request.context as TContext);
          principal = undefined;
        }

        const location = await selectReloadLocation(
          router,
          principal,
          normalizedTarget ?? undefined,
          reason,
          reloadOptions,
        );

        return location
          ? json(200, {
              location,
            })
          : json(403, {
              error: 'No authorized reload destination.',
            });
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) {
          return json(503, { error: 'Navigation artifact unavailable.' });
        }
        throw error;
      }
    },
  });
}

function json<T>(status: number, body: T): ServerJsonResponse<T> {
  return Object.freeze({
    kind: 'json',
    status,
    headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
    body,
  });
}

function empty(status: number): ServerEmptyResponse {
  return Object.freeze({
    kind: 'empty',
    status,
    headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
  });
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function optionalStringValue(value: unknown): string | undefined | null {
  if (value === undefined) return undefined;
  return stringValue(value);
}

function reloadReasonValue(value: unknown): ServerReloadReason | null {
  return value === 'reset' || value === 'principal-change'
    ? value
    : null;
}

function normalizeInternalTarget(target: string): string | null {
  try {
    const url = new URL(target, 'http://waypoint.local');
    if (url.origin !== 'http://waypoint.local') {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

async function selectReloadLocation<
  TArtifact extends ServerArtifactRecord,
  TContext,
>(
  router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveLanding'>,
  principal: ServerPrincipal | undefined,
  target: string | undefined,
  reason: ServerReloadReason,
  options: ServerReloadOptions<TContext> | undefined,
): Promise<string | null> {
  if (target) {
    const resolution = await router.resolve(target, principal);
    if (resolution) {
      return target;
    }
  }

  const fallbacks = reason === 'principal-change'
    ? [
        ...(options?.publicLocation ? [options.publicLocation] : []),
        ...(options?.landingTargets ?? []),
      ]
    : [...(options?.landingTargets ?? [])];

  if (fallbacks.length === 0) {
    return null;
  }

  return router.resolveLanding(
    Object.freeze(fallbacks),
    principal,
  );
}