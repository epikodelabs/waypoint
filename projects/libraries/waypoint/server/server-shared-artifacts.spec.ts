import {
  resolveServerArtifactChain,
  requiredServerBranchIds,
  isServerArtifactChainAuthorized,
} from './server-routing';
import type { ServerArtifactRecord } from './server-artifact';

describe('shared protected server artifacts', () => {
  const user = {
    subject: 'user',
    roles: new Set(['user']),
    permissions: new Set<string>(),
  };
  const admin = {
    subject: 'admin',
    roles: new Set(['admin']),
    permissions: new Set<string>(),
  };

  const artifacts: readonly ServerArtifactRecord[] = [
    {
      kind: 'shared',
      artifactKey: 'shared:admin',
      dependencies: [],
      consumers: ['admin'],
      authorization: {
        allowAnonymous: false,
        roles: ['admin'],
        permissions: [],
      },
      file: 'protected/shared/admin.js',
      hash: 'SHARED',
    },
    {
      kind: 'route',
      artifactKey: 'admin',
      routeSetId: 'administration',
      dependencies: [],
      sharedDependencies: ['shared:admin'],
      branchIds: ['admin-home'],
      authorization: {
        allowAnonymous: false,
        roles: ['admin'],
        permissions: [],
      },
      file: 'protected/routes/admin.js',
      hash: 'ADMIN',
    },
  ];

  const branches = new Map([
    ['admin-home', {
      id: 'admin-home',
      routeSetId: 'administration',
      policies: [{ roles: ['admin'] }],
    }],
  ]);

  it('delivers shared chunks before their route consumer', () => {
    expect(resolveServerArtifactChain({ artifacts }, 'admin')
      .map(item => item.artifactKey))
      .toEqual(['shared:admin', 'admin']);
  });

  it('does not request branch shards for shared artifacts', () => {
    expect([...requiredServerBranchIds(
      resolveServerArtifactChain({ artifacts }, 'admin'),
    )]).toEqual(['admin-home']);
  });

  it('authorizes every shared delivery unit', () => {
    const chain = resolveServerArtifactChain({ artifacts }, 'admin');

    expect(isServerArtifactChainAuthorized(chain, branches, admin)).toBeTrue();
    expect(isServerArtifactChainAuthorized(chain, branches, user)).toBeFalse();
  });
});