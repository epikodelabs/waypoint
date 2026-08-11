import {
  createServerRouter,
  isPathPrefix,
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
  readonly kind: 'route';
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