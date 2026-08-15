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
      async resolveLanding() {
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
      async resolveLanding() {
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
      async resolveLanding() {
        return null;
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
      async resolveLanding() {
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
      async resolveLanding() {
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
      async resolveLanding() {
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

  it('returns a private reload destination when the current target is still authorized', async () => {
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const seenTargets: string[] = [];
    const seenPrincipals: unknown[] = [];
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve(target, actual) {
        seenTargets.push(String(target));
        seenPrincipals.push(actual);
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
    });

    expect(await handler.reload({
      reason: 'reset',
      target: '/workspace?tab=files',
      principal,
    })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: {
        location: '/workspace?tab=files',
      },
    });
    expect(seenTargets).toEqual(['/workspace?tab=files']);
    expect(seenPrincipals).toEqual([principal]);
  });

  it('resets the principal before selecting a new public reload destination', async () => {
    const seenPrincipals: unknown[] = [];
    const resetContexts: string[] = [];
    const handler = createServerRouterHttpHandler<
      Artifact,
      Readonly<{ sessionId: string }>
    >({
      async resolve(_target, principal) {
        seenPrincipals.push(principal);
        return null;
      },
      async resolveLanding(targets, principal) {
        seenPrincipals.push(principal);
        return typeof targets[0] === 'string'
          ? targets[0]
          : null;
      },
      async resolveModule() {
        return null;
      },
    }, {
      reload: {
        publicLocation: '/?account=choose',
        async resetPrincipal(context) {
          resetContexts.push(context.sessionId);
        },
      },
    });

    expect(await handler.reload({
      reason: 'principal-change',
      target: '/admin',
      principal: {
        subject: 'admin',
        roles: new Set(['admin']),
        permissions: new Set(['manage']),
      },
      context: {
        sessionId: 'session-1',
      },
    })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: {
        location: '/?account=choose',
      },
    });
    expect(resetContexts).toEqual(['session-1']);
    expect(seenPrincipals).toEqual([undefined, undefined]);
  });

  it('rejects external reload targets before invoking the router', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        calls += 1;
        return null;
      },
      async resolveLanding() {
        calls += 1;
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.reload({
      reason: 'reset',
      target: 'https://evil.example/phish',
    })).toEqual({
      kind: 'json',
      status: 400,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Invalid reload target.' },
    });
    expect(calls).toBe(0);
  });
});
