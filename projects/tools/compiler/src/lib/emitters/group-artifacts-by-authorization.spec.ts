import { groupArtifactsByAuthorization } from './group-artifacts-by-authorization';

describe('authorization-domain bundling', () => {
  it('never puts different authorization audiences into one esbuild graph', () => {
    const artifacts = [
      { artifactKey: 'admin-a', authorization: { allowAnonymous: false, roles: ['admin'], permissions: [] } },
      { artifactKey: 'admin-b', authorization: { allowAnonymous: false, roles: ['admin'], permissions: [] } },
      { artifactKey: 'finance', authorization: { allowAnonymous: false, roles: ['finance'], permissions: [] } },
    ] as any;

    const groups = groupArtifactsByAuthorization(artifacts);
    expect(groups.length).toBe(2);
    expect(groups.find(group => group.artifacts.length === 2)?.artifacts.map(artifact => artifact.artifactKey))
      .toEqual(['admin-a', 'admin-b']);
  });
});
