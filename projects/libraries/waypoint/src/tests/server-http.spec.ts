import {
  createServerRouterHttpHandler,
  WAYPOINT_MODULE_HEADERS,
  WAYPOINT_PRIVATE_NO_STORE_HEADERS,
} from '../lib/server-http';
import {
  ServerArtifactResolutionError,
  type ServerArtifactRecord,
} from '../lib/server-routing';

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

describe('server HTTP handler', () => {
  it('rejects malformed resolve requests before invoking the router', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        calls += 1;
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    const response = await handler.resolve({ target: ['not', 'a', 'path'] });

    expect(calls).toBe(0);
    expect(response).toEqual({
      kind: 'json',
      status: 400,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Invalid path.' },
    });
  });

  it('uses the same private 404 for unknown and unauthorized routes', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.resolve({ target: '/admin' })).toEqual({
      kind: 'json',
      status: 404,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Route not found.' },
    });
  });

  it('returns authorized resolution using private non-cacheable headers', async () => {
    const resolution = {
      version: 1 as const,
      artifactKey: 'workspace',
      artifacts: [{
        artifactKey: 'workspace',
        moduleUrl: '/modules/workspace/ABC123',
        hash: 'ABC123',
      }],
    };
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return resolution;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.resolve({ target: '/workspace' })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: resolution,
    });
  });

  it('maps publication failure to 503 only on authorized route resolution', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        throw new ServerArtifactResolutionError(
          'unavailable',
          'Artifact is not published.',
        );
      },
      async resolveModule() {
        throw new ServerArtifactResolutionError(
          'unavailable',
          'Artifact is not published.',
        );
      },
    });

    expect(await handler.resolve({ target: '/workspace' })).toEqual({
      kind: 'json',
      status: 503,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Navigation artifact unavailable.' },
    });

    expect((await handler.module({
      artifactKey: 'workspace',
      hash: 'ABC123',
    })).status).toBe(404);
  });

  it('returns an authorized artifact without exposing its file in JSON', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveModule() {
        return artifact;
      },
    });

    expect(await handler.module({
      artifactKey: 'workspace',
      hash: 'ABC123',
    })).toEqual({
      kind: 'artifact',
      status: 200,
      headers: WAYPOINT_MODULE_HEADERS,
      artifact,
    });
  });

  it('collapses malformed, stale, missing, and unauthorized module requests to 404', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveModule() {
        calls += 1;
        return null;
      },
    });

    expect((await handler.module({ artifactKey: '', hash: 'ABC123' })).status)
      .toBe(404);
    expect(calls).toBe(0);

    expect((await handler.module({
      artifactKey: 'workspace',
      hash: 'old',
    })).status).toBe(404);
    expect(calls).toBe(1);
  });
});