import { allowedArtifactDependencies } from './artifact-exposure';

describe('artifact exposure', () => {
  it('follows only declared parent dependencies transitively', () => {
    const plan = {
      artifacts: [
        { artifactKey: 'application', dependencies: [] },
        { artifactKey: 'administration', dependencies: ['application'] },
        { artifactKey: 'audit', dependencies: ['administration'] },
      ],
    } as any;

    expect([...allowedArtifactDependencies(plan, 'audit')].sort())
      .toEqual(['administration', 'application']);
    expect([...allowedArtifactDependencies(plan, 'application')])
      .toEqual([]);
  });
});
