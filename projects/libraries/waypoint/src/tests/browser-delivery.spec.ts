import {
  createServerNavigationResolver,
  isRouteContributionDefinition,
  type ServerNavigationFetch,
} from '../lib/browser-delivery';
import type { RouteContributionDefinition } from '../lib/navigation-definitions';

function contribution(
  id: string,
  slotId = 'application',
): RouteContributionDefinition {
  return {
    kind: 'route-contribution',
    id,
    slotId,
    entries: [],
  };
}

function response(
  status: number,
  body: unknown,
): Awaited<ReturnType<ServerNavigationFetch>> {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  };
}

describe('browser server delivery', () => {
  it('validates route contribution exports', () => {
    expect(isRouteContributionDefinition(contribution('workspace'))).toBeTrue();
    expect(isRouteContributionDefinition({
      kind: 'route-contribution',
      id: '',
      slotId: 'application',
      entries: [],
    })).toBeFalse();
    expect(isRouteContributionDefinition({
      kind: 'route-contribution',
      id: 'workspace',
      slotId: 'application',
      entries: {},
    })).toBeFalse();
  });

  it('requests one server resolution and imports artifacts dependency-first', async () => {
    const requests: string[] = [];
    const imports: string[] = [];
    const fetch: ServerNavigationFetch = async input => {
      requests.push(input);
      return response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'shell', moduleUrl: '/modules/shell.js', hash: 'SHELL', identity: 'v1:SHELL' },
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'WORK', identity: 'v1:WORK' },
        ],
      });
    };

    const resolve = createServerNavigationResolver({
      fetch,
      async importModule(url) {
        imports.push(url);
        return {
          default: contribution(url.includes('shell') ? 'shell' : 'workspace'),
        };
      },
    });

    const result = await resolve(new URL(
      'https://waypoint.test/app/workspace/101?view=overview#details',
    ));

    expect(requests).toEqual([
      '/api/navigation/resolve?path=%2Fapp%2Fworkspace%2F101%3Fview%3Doverview%23details',
    ]);
    expect(imports).toEqual(['/modules/shell.js', '/modules/workspace.js']);
    expect(result?.contributions?.map(item => item.id)).toEqual([
      'shell',
      'workspace',
    ]);
  });

  it('treats hidden and unknown destinations identically', async () => {
    const resolve = createServerNavigationResolver({
      fetch: async () => response(404, { error: 'Route not found.' }),
      importModule: async () => {
        throw new Error('must not import');
      },
    });

    expect(await resolve(new URL('https://waypoint.test/hidden'))).toBeNull();
  });

  it('rejects malformed delivery responses before importing code', async () => {
    let imports = 0;
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [],
      }),
      importModule: async () => {
        imports += 1;
        return {};
      },
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/invalid Waypoint navigation resolution/i);
    expect(imports).toBe(0);
  });

  it('deduplicates concurrent imports for the same content identity', async () => {
    let imports = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const fetch: ServerNavigationFetch = async () => response(200, {
      version: 1,
      artifactKey: 'workspace',
      artifacts: [
        { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH', identity: 'v1:HASH' },
      ],
    });
    const resolver = createServerNavigationResolver({
      fetch,
      async importModule() {
        imports += 1;
        await gate;
        return { default: contribution('workspace') };
      },
    });

    const first = resolver(new URL('https://waypoint.test/app/workspace'));
    const second = resolver(new URL('https://waypoint.test/app/workspace'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(imports).toBe(1);

    release();
    await Promise.all([first, second]);
    expect(imports).toBe(1);
  });

  it('loads a new content hash under the same stable artifact key', async () => {
    let hash = 'A';
    const imports: string[] = [];
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [{
          artifactKey: 'workspace',
          moduleUrl: `/modules/workspace-${hash}.js`,
          hash,
        }],
      }),
      async importModule(url) {
        imports.push(url);
        return { default: contribution(`workspace-${hash}`) };
      },
    });

    await resolve(new URL('https://waypoint.test/app/workspace'));
    hash = 'B';
    await resolve(new URL('https://waypoint.test/app/workspace'));
    await resolve(new URL('https://waypoint.test/app/workspace'));

    expect(imports).toEqual([
      '/modules/workspace-A.js',
      '/modules/workspace-B.js',
    ]);
  });

  it('evicts a failed artifact import so a later resolution can retry', async () => {
    let attempts = 0;
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH', identity: 'v1:HASH' },
        ],
      }),
      async importModule() {
        attempts += 1;
        if (attempts === 1) throw new Error('temporary import failure');
        return { default: contribution('workspace') };
      },
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/temporary import failure/);
    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeResolved();
    expect(attempts).toBe(2);
  });

  it('rejects modules that do not export a routesFor contribution', async () => {
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH', identity: 'v1:HASH' },
        ],
      }),
      importModule: async () => ({ default: [] }),
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/did not export a route contribution/i);
  });

  it('requires host module identities when using native artifact imports', () => {
    expect(() => createServerNavigationResolver()).toThrowError(/hostModules/i);
  });

  it('requires the active Waypoint identity for native artifact imports', () => {
    expect(() => createServerNavigationResolver({
      hostModules: {
        '@angular/core': {},
      },
    })).toThrowError(/@epikodelabs\/waypoint/i);
  });

  it('supports a custom resolution endpoint', async () => {
    let request = '';
    const resolve = createServerNavigationResolver({
      endpoint: '/internal/waypoint/resolve?',
      fetch: async input => {
        request = input;
        return response(404, null);
      },
      importModule: async () => ({ default: contribution('unused') }),
    });

    await resolve(new URL('https://waypoint.test/app'));
    expect(request).toBe('/internal/waypoint/resolve?path=%2Fapp');
  });
});

// Hardening: delivery work follows router cancellation and publication generations.
describe('browser delivery hardening', () => {
  it('passes an abort signal to server resolution and stops before importing artifacts', async () => {
    let seenSignal: AbortSignal | undefined;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let imports = 0;
    const resolver = createServerNavigationResolver({
      async fetch(_input, init) {
        seenSignal = init.signal;
        await gate;
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [
            { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH', identity: 'v1:HASH' },
          ],
        });
      },
      async importModule() {
        imports += 1;
        return { default: contribution('workspace') };
      },
    });
    const controller = new AbortController();
    const pending = resolver(
      new URL('https://waypoint.test/app/workspace'),
      { signal: controller.signal },
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(seenSignal).toBe(controller.signal);
    controller.abort();
    release();

    await expectAsync(pending).toBeRejected();
    expect(imports).toBe(0);
  });

  it('re-resolves once when an artifact URL becomes stale during publication', async () => {
    let resolution = 0;
    const imports: string[] = [];
    const resolver = createServerNavigationResolver({
      async fetch() {
        resolution += 1;
        const hash = resolution === 1 ? 'OLD' : 'NEW';
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [{
            artifactKey: 'workspace',
            moduleUrl: `/modules/workspace-${hash}.js`,
            hash,
          }],
        });
      },
      async importModule(url) {
        imports.push(url);
        if (url.endsWith('-OLD.js')) {
          throw new Error('404 during publication rollover');
        }
        return { default: contribution('workspace') };
      },
    });

    const result = await resolver(new URL('https://waypoint.test/app/workspace'));

    expect(resolution).toBe(2);
    expect(imports).toEqual([
      '/modules/workspace-OLD.js',
      '/modules/workspace-NEW.js',
    ]);
    expect(result?.contributions[0]?.id).toBe('workspace');
  });

  it('does not retry deterministic malformed artifact exports', async () => {
    let resolutions = 0;
    const resolver = createServerNavigationResolver({
      async fetch() {
        resolutions += 1;
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [
            { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH', identity: 'v1:HASH' },
          ],
        });
      },
      importModule: async () => ({ default: [] }),
    });

    await expectAsync(resolver(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/did not export a route contribution/i);
    expect(resolutions).toBe(1);
  });
});

describe('browser delivery contribution identity', () => {
  it('returns artifactKey + hash identity for each delivered routesFor contribution', async () => {
    const resolve =
      createServerNavigationResolver({
        fetch: async () => response(200, {
          version: 2,
          artifactKey: 'workspace',
          artifacts: [{
            kind: 'route',
            artifactKey: 'workspace',
            moduleUrl: '/modules/workspace.js',
            hash: 'HASH-A',
          identity: 'v1:HASH-A',
          }],
        }),
        async importModule() {
          return {
            default:
              contribution('workspace'),
          };
        },
      });

    const result =
      await resolve(
        new URL(
          'https://waypoint.test/workspace',
        ),
      );

    expect(
      result?.contributionIdentities,
    ).toEqual({
      workspace: 'v1:HASH-A',
    });
  });
});
