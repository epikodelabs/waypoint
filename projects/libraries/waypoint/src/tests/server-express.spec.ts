import {
  createExpressServerRouterHandlers,
  type ExpressLikeNext,
  type ExpressLikeRequest,
  type ExpressLikeResponse,
} from '../lib/server-express';
import type { ServerArtifactRecord } from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly file: string;
  readonly hash: string;
}

const artifact: Artifact = {
  artifactKey: 'workspace',
  routeSetId: 'workspace-set',
  dependencies: [],
  branchIds: ['workspace-home'],
  file: '../artifacts/workspace.js',
  hash: 'ABC123',
};

class ResponseDouble implements ExpressLikeResponse {
  statusCode = 0;
  headers: Readonly<Record<string, string>> = {};
  jsonBody: unknown;
  ended = false;
  sentFile?: string;
  headersSent = false;
  fileError?: Error;

  status(code: number): ExpressLikeResponse {
    this.statusCode = code;
    return this;
  }

  set(headers: Readonly<Record<string, string>>): ExpressLikeResponse {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }

  json(body: unknown): unknown {
    this.jsonBody = body;
    this.headersSent = true;
    return body;
  }

  end(): unknown {
    this.ended = true;
    this.headersSent = true;
    return undefined;
  }

  sendFile(path: string, callback: (error?: Error) => void): unknown {
    this.sentFile = path;
    if (!this.fileError) this.headersSent = true;
    callback(this.fileError);
    return undefined;
  }
}

function request(
  query: Readonly<Record<string, unknown>> = {},
  params: Readonly<Record<string, string | undefined>> = {},
  body?: unknown,
): ExpressLikeRequest {
  return { query, params, body };
}

function nextSpy(): { next: ExpressLikeNext; errors: unknown[] } {
  const errors: unknown[] = [];
  return {
    errors,
    next(error) {
      if (error !== undefined) errors.push(error);
    },
  };
}

describe('Express server router adapter', () => {
  it('translates route resolution to an Express response', async () => {
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return {
            artifactKey: 'workspace',
            artifacts: [{
              artifactKey: 'workspace',
              moduleUrl: '/modules/workspace/ABC123',
              hash: 'ABC123',
            }],
          };
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor: item => item.file,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.resolve(request({ path: '/workspace' }), response, next);

    expect(response.statusCode).toBe(200);
    expect((response.jsonBody as { artifactKey: string }).artifactKey)
      .toBe('workspace');
    expect(errors).toEqual([]);
  });

  it('passes the application principal into both router operations', async () => {
    const seen: unknown[] = [];
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const handlers = createExpressServerRouterHandlers<Artifact, ExpressLikeRequest>({
      router: {
        async resolve(_target, actual) {
          seen.push(actual);
          return null;
        },
        async resolveLanding(_targets, actual) {
          seen.push(actual);
          return null;
        },
        async resolveModule(_key, _hash, actual) {
          seen.push(actual);
          return null;
        },
      },
      principalFrom: () => principal,
      artifactPathFor: item => item.file,
    });
    const { next } = nextSpy();

    await handlers.resolve(
      request({ path: '/workspace' }),
      new ResponseDouble(),
      next,
    );
    await handlers.module(
      request({}, { artifactKey: 'workspace', hash: 'ABC123' }),
      new ResponseDouble(),
      next,
    );

    expect(seen).toEqual([principal, principal]);
  });

  it('sends only an already-authorized artifact file', async () => {
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return artifact;
        },
      },
      artifactPathFor: item => `/published/${item.artifactKey}-${item.hash}.js`,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.module(
      request({}, { artifactKey: 'workspace', hash: 'ABC123' }),
      response,
      next,
    );

    expect(response.statusCode).toBe(200);
    expect(response.sentFile).toBe('/published/workspace-ABC123.js');
    expect(errors).toEqual([]);
  });

  it('does not call artifactPathFor for unauthorized module requests', async () => {
    let mapped = false;
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor() {
        mapped = true;
        return '/should-not-be-used.js';
      },
    });
    const response = new ResponseDouble();
    const { next } = nextSpy();

    await handlers.module(
      request({}, { artifactKey: 'private', hash: 'guess' }),
      response,
      next,
    );

    expect(response.statusCode).toBe(404);
    expect(response.ended).toBeTrue();
    expect(mapped).toBeFalse();
  });

  it('forwards unexpected failures to Express next()', async () => {
    const failure = new Error('storage failed');
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          throw failure;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor: item => item.file,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.resolve(request({ path: '/workspace' }), response, next);

    expect(errors).toEqual([failure]);
  });

  it('translates reload responses and lets reset hooks touch the response', async () => {
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const resetBodies: unknown[] = [];
    const handlers = createExpressServerRouterHandlers<
      Artifact,
      ExpressLikeRequest,
      ResponseDouble
    >({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding(targets, actual) {
          expect(actual).toBeUndefined();
          return typeof targets[0] === 'string'
            ? targets[0]
            : null;
        },
        async resolveModule() {
          return null;
        },
      },
      principalFrom: () => principal,
      artifactPathFor: item => item.file,
      reload: {
        publicLocation: '/?account=choose',
        async resetPrincipal(request, response) {
          resetBodies.push(request.body);
          response.set({
            'Clear-Site-Data': '"cache"',
          });
        },
      },
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.reload(
      request({}, {}, {
        reason: 'principal-change',
        target: '/app/workspace/101',
      }),
      response,
      next,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      'Clear-Site-Data': '"cache"',
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
    });
    expect(response.jsonBody).toEqual({
      location: '/?account=choose',
    });
    expect(resetBodies).toEqual([{
      reason: 'principal-change',
      target: '/app/workspace/101',
    }]);
    expect(errors).toEqual([]);
  });
});
