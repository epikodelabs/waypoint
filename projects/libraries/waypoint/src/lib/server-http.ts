import type { ServerNavigationResolution } from './server-delivery';
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

export interface ServerRouterHttpHandler<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> {
  resolve(request: ServerResolveRequest): Promise<ServerResolveResponse>;
  module(request: ServerModuleRequest): Promise<ServerModuleResponse<TArtifact>>;
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
>(
  router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveModule'>,
): ServerRouterHttpHandler<TArtifact> {
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