import {
  createServerRouter,
  isPathPrefix,
  matchRoutePattern,
  matchesRoutePattern,
  type ServerArtifactRecord,
  type ServerRoutableBranch,
  type ServerRouterIndex,
  type ServerRouterShard,
} from '../lib/server-router';
import type { ServerPrincipal } from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly file: string;
  readonly hash: string;
}

interface Branch extends ServerRoutableBranch {
  readonly kind: 'route' | 'redirect';
}

const principal: ServerPrincipal = {
  subject: 'reader',
  roles: new Set(['user']),
  permissions: new Set(['read']),
};

const adminPrincipal: ServerPrincipal = {
  subject: 'admin',
  roles: new Set(['admin']),
  permissions: new Set(['read', 'admin']),
};

function artifact(
  artifactKey: string,
  routeSetId: string,
  dependencies: readonly string[],
  branchIds: readonly string[],
  hash = `${artifactKey}-hash`,
): Artifact {
  return {
    artifactKey,
    routeSetId,
    dependencies,
    branchIds,
    file: `../artifacts/${artifactKey}.js`,
    hash,
  };
}

function branch(
  id: string,
  path: string,
  routeSetId: string,
  permissions: readonly string[] = ['read'],
): Branch {
  return {
    id,
    kind: 'route',
    path,
    routeSetId,
    policies: [{ permissions }],
  };
}

function redirectBranch(
  id: string,
  path: string,
  redirectTo: string,
  routeSetId: string,
  permissions: readonly string[] = ['read'],
): Branch {
  return {
    id,
    kind: 'redirect',
    path,
    redirectTo,
    routeSetId,
    policies: [{ permissions }],
  };
}

function fixture() {
  const index: ServerRouterIndex<Artifact> = {
    shards: [
      { prefix: '/', file: 'root.json' },
      { prefix: '/app', file: 'app.json' },
      { prefix: '/app/admin', file: 'admin.json' },
    ],
    artifacts: [
      artifact('shell', 'shell-set', [], ['shell-home']),
      artifact('workspace', 'workspace-set', ['shell'], ['workspace-home']),
      artifact('admin', 'admin-set', ['shell'], ['admin-home']),
    ],
  };

  const shards = new Map<string, ServerRouterShard<Branch>>([
    ['root.json', {
      branches: [branch('shell-home', '/', 'shell-set')],
    }],
    ['app.json', {
      branches: [branch(
        'workspace-home',
        '/app/workspace/:projectId',
        'workspace-set',
      )],
    }],
    ['admin.json', {
      branches: [branch('admin-home', '/app/admin', 'admin-set', ['admin'])],
    }],
  ]);

  const router = createServerRouter<Artifact, Branch>({
    async loadIndex() {
      return index;
    },
    async loadShard(file) {
      const shard = shards.get(file);
      if (!shard) throw new Error(`Missing shard ${file}`);
      return shard;
    },
    moduleUrlFor(item) {
      return `/modules/${item.artifactKey}/${item.hash}`;
    },
  });

  return { index, router };
}

describe('server router', () => {
  it('matches dynamic route patterns exactly', () => {
    expect(matchesRoutePattern(
      '/app/workspace/:projectId',
      '/app/workspace/101',
    )).toBeTrue();
    expect(matchesRoutePattern(
      '/app/workspace/:projectId',
      '/app/workspace/101/settings',
    )).toBeFalse();
  });

  it('extracts encoded dynamic segments for server redirect interpolation', () => {
    expect(matchRoutePattern(
      '/legacy/:projectId',
      '/legacy/hello%20world',
    )).toEqual({ projectId: 'hello%20world' });
  });

  it('treats shard prefixes as path prefixes rather than string prefixes', () => {
    expect(isPathPrefix('/app', '/app')).toBeTrue();
    expect(isPathPrefix('/app', '/app/admin')).toBeTrue();
    expect(isPathPrefix('/app', '/application')).toBeFalse();
    expect(isPathPrefix('/', '/anything')).toBeTrue();
  });

  it('selects the most specific shard and resolves a destination', async () => {
    const { router } = fixture();

    const matched = await router.match('/app/workspace/101?view=overview');

    expect(matched?.id).toBe('workspace-home');
  });

  it('returns one dependency-first authorized delivery plan', async () => {
    const { router } = fixture();

    const resolution = await router.resolve(
      '/app/workspace/101?view=overview',
      principal,
    );

    expect(resolution).toEqual({
      version: 1,
      artifactKey: 'workspace',
      artifacts: [
        {
          artifactKey: 'shell',
          moduleUrl: '/modules/shell/shell-hash',
          hash: 'shell-hash',
        },
        {
          artifactKey: 'workspace',
          moduleUrl: '/modules/workspace/workspace-hash',
          hash: 'workspace-hash',
        },
      ],
    });
  });

  it('resolves internal redirects across separately delivered artifacts', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('legacy', 'legacy-set', [], ['legacy']),
        artifact('target', 'target-set', [], ['target']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('legacy', '/legacy/:projectId', '/projects/:projectId', 'legacy-set'),
        branch('target', '/projects/:projectId', 'target-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      async loadIndex() { return index; },
      async loadShard() { return shard; },
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect(await router.resolve('/legacy/hello%20world', principal)).toEqual({
      version: 1,
      artifactKey: 'legacy',
      artifacts: [
        {
          artifactKey: 'legacy',
          moduleUrl: '/modules/legacy/legacy-hash',
          hash: 'legacy-hash',
        },
        {
          artifactKey: 'target',
          moduleUrl: '/modules/target/target-hash',
          hash: 'target-hash',
        },
      ],
    });
  });

  it('does not deliver a redirect source when its internal target is unauthorized', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('legacy', 'legacy-set', [], ['legacy']),
        artifact('admin', 'admin-set', [], ['admin']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('legacy', '/legacy-admin', '/admin', 'legacy-set'),
        branch('admin', '/admin', 'admin-set', ['admin']),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      async loadIndex() { return index; },
      async loadShard() { return shard; },
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect(await router.resolve('/legacy-admin', principal)).toBeNull();
  });

  it('stops internal server redirect loops before returning a delivery plan', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('a', 'a-set', [], ['a']),
        artifact('b', 'b-set', [], ['b']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('a', '/a', '/b', 'a-set'),
        redirectBranch('b', '/b', '/a', 'b-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      async loadIndex() { return index; },
      async loadShard() { return shard; },
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
      maxRedirects: 3,
    });

    expect(await router.resolve('/a', principal)).toBeNull();
  });

  it('keeps external redirects as one authorized source artifact', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [artifact('external', 'external-set', [], ['external'])],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('external', '/external', 'https://example.com/docs', 'external-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      async loadIndex() { return index; },
      async loadShard() { return shard; },
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect((await router.resolve('/external', principal))?.artifactKey).toBe('external');
  });

  it('rejects ambiguous route-set to artifact mappings', async () => {
    const { index, router } = fixture();
    (index.artifacts as Artifact[]).push(
      artifact('workspace-shadow', 'workspace-set', [], ['workspace-home']),
    );

    await expectAsync(
      router.resolve('/app/workspace/101', principal),
    ).toBeRejectedWithError(/maps to multiple server artifacts/i);
  });

  it('does not resolve an unauthorized destination', async () => {
    const { router } = fixture();

    expect(await router.resolve('/app/admin', principal)).toBeNull();
  });

  it('selects the first server-authorized landing target', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['/app/admin', '/app/workspace/101?view=overview'],
      principal,
    )).toBe('/app/workspace/101?view=overview');
  });

  it('keeps the preferred landing when the new principal is authorized', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['/app/admin', '/app/workspace/101?view=overview'],
      adminPrincipal,
    )).toBe('/app/admin');
  });

  it('does not return an external landing target', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['https://example.com/app/workspace/101'],
      principal,
    )).toBeNull();
  });

  it('authorizes a module through its complete dependency chain', async () => {
    const { router } = fixture();

    const resolved = await router.resolveModule(
      'workspace',
      'workspace-hash',
      principal,
    );

    expect(resolved?.artifactKey).toBe('workspace');
  });

  it('rejects stale hashes without revealing another artifact version', async () => {
    const { router } = fixture();

    expect(await router.resolveModule(
      'workspace',
      'old-hash',
      principal,
    )).toBeNull();
  });

  it('rejects direct module access when the artifact itself is unauthorized', async () => {
    const { router } = fixture();

    expect(await router.resolveModule(
      'admin',
      'admin-hash',
      principal,
    )).toBeNull();
  });

  it('rejects absolute external navigation targets', async () => {
    const { router } = fixture();

    expect(await router.resolve(
      'https://example.com/app/workspace/101',
      principal,
    )).toBeNull();
  });
});