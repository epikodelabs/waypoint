import type { ServerArtifactRecord, ServerPrincipal } from './server-routing';
import type { ServerRouter } from './server-router';
import {
  createServerRouterHttpHandler,
  type ServerHttpHeaders,
} from './server-http';

export interface ExpressLikeRequest {
  readonly query: Readonly<Record<string, unknown>>;
  readonly params: Readonly<Record<string, string | readonly string[] | undefined>>;
  readonly body?: unknown;
}

export interface ExpressLikeResponse {
  status(code: number): ExpressLikeResponse;
  set(headers: ServerHttpHeaders): ExpressLikeResponse;
  json(body: unknown): unknown;
  end(): unknown;
  sendFile(path: string, callback: (error?: Error) => void): unknown;
  readonly headersSent: boolean;
}

export type ExpressLikeNext = (error?: unknown) => void;

export interface ExpressServerRouterRevalidationOptions {
  readonly landingTargets?: readonly string[];
}

export interface ExpressServerRouterReloadOptions<
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly resetPrincipal?: (
    request: TRequest,
    response: TResponse,
  ) => void | Promise<void>;
  readonly publicLocation?: string;
  readonly landingTargets?: readonly string[];
}

export interface ExpressServerRouterAdapterOptions<
  TArtifact extends ServerArtifactRecord,
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly router:
    Pick<
      ServerRouter<TArtifact>,
      'resolve' | 'resolveLanding' | 'resolveModule'
    >
    & Partial<
      Pick<
        ServerRouter<TArtifact>,
        'resolveConfiguration'
      >
    >;
  readonly principalFrom?: (request: TRequest) => ServerPrincipal | undefined;
  readonly artifactPathFor: (artifact: TArtifact) => string;
  readonly revalidation?: ExpressServerRouterRevalidationOptions;
  readonly reload?: ExpressServerRouterReloadOptions<TRequest, TResponse>;
}

export interface ExpressServerRouterHandlers<
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly resolve: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly configuration: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly module: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly reload: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
}

/**
 * Creates Express-compatible handlers without importing Express at runtime.
 * Applications remain responsible only for mounting the handlers and mapping
 * an authorized artifact descriptor to its local published file path.
 */
export function createExpressServerRouterHandlers<
  TArtifact extends ServerArtifactRecord,
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
>(
  options: ExpressServerRouterAdapterOptions<TArtifact, TRequest, TResponse>,
): ExpressServerRouterHandlers<TRequest, TResponse> {
  const http = createServerRouterHttpHandler<
    TArtifact,
    Readonly<{
      request: TRequest;
      response: TResponse;
    }>
  >(options.router, {
    revalidation: options.revalidation,
    reload: options.reload
      ? {
          publicLocation: options.reload.publicLocation,
          landingTargets: options.reload.landingTargets,
          resetPrincipal: ({ request, response }) =>
            options.reload?.resetPrincipal?.(request, response),
        }
      : undefined,
  });
  const principalFrom = options.principalFrom ?? (() => undefined);

  return Object.freeze({
    async resolve(
      request: TRequest,
      response: ExpressLikeResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const result = await http.resolve({
          target: request.query['path'],
          principal: principalFrom(request),
        });

        response
          .status(result.status)
          .set(result.headers)
          .json(result.body);
      } catch (error) {
        next(error);
      }
    },

    async configuration(
      request: TRequest,
      response: TResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const result =
          await http.configuration({
            principal:
              principalFrom(request),
          });

        response
          .status(result.status)
          .set(result.headers)
          .json(result.body);
      } catch (error) {
        next(error);
      }
    },

    async module(
      request: TRequest,
      response: ExpressLikeResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const result = await http.module({
          artifactKey: request.params['artifactKey'],
          hash: request.params['hash'],
          principal: principalFrom(request),
        });

        response.status(result.status).set(result.headers);
        if (result.kind === 'empty') {
          response.end();
          return;
        }

        let file: string;
        try {
          file = options.artifactPathFor(result.artifact);
        } catch (error) {
          next(error);
          return;
        }

        response.sendFile(file, (error?: Error) => {
          if (error && !response.headersSent) next(error);
        });
      } catch (error) {
        next(error);
      }
    },

    async reload(
      request: TRequest,
      response: TResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const body =
          request.body && typeof request.body === 'object'
            ? request.body as {
                readonly reason?: unknown;
                readonly target?: unknown;
              }
            : {};

        const result = await http.reload({
          reason: body.reason,
          target: body.target,
          principal: principalFrom(request),
          context: Object.freeze({
            request,
            response,
          }),
        });

        response
          .status(result.status)
          .set(result.headers)
          .json(result.body);
      } catch (error) {
        next(error);
      }
    },
  });
}