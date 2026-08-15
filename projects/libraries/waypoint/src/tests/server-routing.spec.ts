import {
  createServerNavigationResolution,
  isServerArtifactAuthorized,
  isServerArtifactChainAuthorized,
  requiredServerBranchIds,
  resolveServerArtifactChain,
  serverArtifactEffectiveIdentity,
  type ServerArtifactIndex,
  type ServerArtifactRecord,
  type ServerPrincipal,
  type ServerRouteBranch,
} from '../lib/server-routing';

function artifact(
  artifactKey: string,
  dependencies: readonly string[],
  branchIds: readonly string[],
): ServerArtifactRecord {
  return {
    artifactKey,
    routeSetId: artifactKey,
    dependencies,
    branchIds,
    file: `../artifacts/${artifactKey}-HASH.js`,
    hash: 'HASH',
  };
}

function branch(
  id: string,
  routeSetId: string,
  permissions: readonly string[] = [],
): ServerRouteBranch {
  return {
    id,
    policies: [{ permissions }],
    routeSetId,
  };
}

const principal: ServerPrincipal = {
  subject: 'user',
  roles: new Set(['user']),
  permissions: new Set(['read']),
};

describe('server routing', () => {
  it('resolves dependencies on the server in dependency-first order', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('root', [], ['root-branch']),
        artifact('child', ['root'], ['child-branch']),
        artifact('leaf', ['child'], ['leaf-branch']),
      ],
    };

    const chain = resolveServerArtifactChain(index, 'leaf');

    expect(chain.map(item => item.artifactKey)).toEqual([
      'root',
      'child',
      'leaf',
    ]);
    expect([...requiredServerBranchIds(chain)]).toEqual([
      'root-branch',
      'child-branch',
      'leaf-branch',
    ]);
  });

  it('rejects duplicate artifact keys instead of resolving an ambiguous index', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('duplicate', [], ['first']),
        artifact('duplicate', [], ['second']),
      ],
    };

    expect(() => resolveServerArtifactChain(index, 'duplicate')).toThrowError(
      /duplicate artifact key/i,
    );
  });

  it('rejects cyclic artifact graphs rather than exposing partial delivery', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('a', ['b'], ['a-branch']),
        artifact('b', ['a'], ['b-branch']),
      ],
    };

    expect(() => resolveServerArtifactChain(index, 'a')).toThrowError(
      /dependency cycle/i,
    );
  });

  it('authorizes an atomic artifact only when every contained branch is allowed', () => {
    const descriptor = artifact('workspace', [], ['allowed', 'hidden']);
    const branches = new Map<string, ServerRouteBranch>([
      ['allowed', branch('allowed', 'workspace', ['read'])],
      ['hidden', branch('hidden', 'workspace', ['admin'])],
    ]);

    expect(isServerArtifactAuthorized(
      descriptor,
      branches,
      principal,
    )).toBeFalse();

    branches.set('hidden', branch('hidden', 'workspace', ['read']));
    expect(isServerArtifactAuthorized(
      descriptor,
      branches,
      principal,
    )).toBeTrue();
  });

  it('rejects a dependency chain when any artifact is unauthorized', () => {
    const chain = [
      artifact('parent', [], ['parent']),
      artifact('child', ['parent'], ['child']),
    ];
    const branches = new Map<string, ServerRouteBranch>([
      ['parent', branch('parent', 'parent', ['admin'])],
      ['child', branch('child', 'child', ['read'])],
    ]);

    expect(isServerArtifactChainAuthorized(
      chain,
      branches,
      principal,
    )).toBeFalse();
  });

  it('rejects missing or mismatched branch provenance', () => {
    const descriptor = artifact('workspace', [], ['branch']);

    expect(isServerArtifactAuthorized(
      descriptor,
      new Map(),
      principal,
    )).toBeFalse();
    expect(isServerArtifactAuthorized(
      descriptor,
      new Map([['branch', branch('branch', 'other', ['read'])]]),
      principal,
    )).toBeFalse();
  });

  it('creates a wire response without leaking server routing metadata', () => {
    const chain = [
      artifact('parent', [], ['parent-branch']),
      artifact('leaf', ['parent'], ['leaf-branch']),
    ];

    const resolution = createServerNavigationResolution(
      'leaf',
      chain,
      item => `/modules/${item.artifactKey}.js`,
    );

    expect(resolution.artifactKey).toBe('leaf');
    expect(resolution.artifacts).toEqual([
      {
        artifactKey: 'parent',
        moduleUrl: '/modules/parent.js',
        hash: 'HASH',
      },
      {
        artifactKey: 'leaf',
        moduleUrl: '/modules/leaf.js',
        hash: 'HASH',
      },
    ]);
    expect('dependencies' in resolution.artifacts[0]).toBeFalse();
    expect('branchIds' in resolution.artifacts[0]).toBeFalse();
    expect('routeSetId' in resolution.artifacts[0]).toBeFalse();
  });
});

describe('server effective artifact identity', () => {
  it('changes when a transitive dependency content hash changes', () => {
    const first: ServerArtifactIndex = {
      artifacts: [
        artifact('shared', [], ['shared']),
        artifact('route', ['shared'], ['route']),
      ],
    };

    const second: ServerArtifactIndex = {
      artifacts: [
        {
          ...artifact('shared', [], ['shared']),
          hash: 'OTHER',
        },
        artifact('route', ['shared'], ['route']),
      ],
    };

    expect(
      serverArtifactEffectiveIdentity(
        first,
        'route',
      ),
    ).not.toBe(
      serverArtifactEffectiveIdentity(
        second,
        'route',
      ),
    );
  });
});
