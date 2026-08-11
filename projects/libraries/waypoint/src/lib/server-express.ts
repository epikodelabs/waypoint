import type { ServerArtifactRecord, ServerPrincipal } from './server-routing';
import type { ServerRouter } from './server-router';
import {
  createServerRouterHttpHandler,
  type ServerHttpHeaders,
} from './server-http';

export interface ExpressLikeRequest {
  readonly query: Readonly<Record<string, unknown>>;
  readonly params: Readonly<Record<string, string | readonly string[] | undefined>>;
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

export interface ExpressServerRouterAdapterOptions<
  TArtifact extends ServerArtifactRecord,
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
> {
  readonly router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveModule'>;
  readonly principalFrom?: (request: TRequest) => ServerPrincipal | undefined;
  readonly artifactPathFor: (artifact: TArtifact) => string;
}

export interface ExpressServerRouterHandlers<
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
> {
  readonly resolve: (
    request: TRequest,
    response: ExpressLikeResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly module: (
    request: TRequest,
    response: ExpressLikeResponse,
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
>(
  options: ExpressServerRouterAdapterOptions<TArtifact, TRequest>,
): ExpressServerRouterHandlers<TRequest> {
  const http = createServerRouterHttpHandler(options.router);
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
  });
}
