import {
  isServerNavigationResolution,
  WAYPOINT_SERVER_DELIVERY_VERSION,
  type ServerNavigationResolution,
} from '../lib/server-delivery';

describe('server delivery contract', () => {
  const valid: ServerNavigationResolution = {
    version: WAYPOINT_SERVER_DELIVERY_VERSION,
    artifactKey: 'leaf',
    artifacts: [
      {
        artifactKey: 'parent',
        moduleUrl: '/api/navigation/modules/parent.js',
        hash: 'PARENT',
      },
      {
        artifactKey: 'leaf',
        moduleUrl: '/api/navigation/modules/leaf.js',
        hash: 'LEAF',
      },
    ],
  };

  it('accepts a versioned dependency-first resolution', () => {
    expect(isServerNavigationResolution(valid)).toBeTrue();
  });

  it('rejects unknown protocol versions', () => {
    expect(isServerNavigationResolution({ ...valid, version: 2 })).toBeFalse();
  });

  it('allows the requested artifact before redirect-followed artifacts', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifactKey: 'parent',
    })).toBeTrue();
  });

  it('requires the requested artifact to be present in the delivery plan', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifactKey: 'missing',
    })).toBeFalse();
  });

  it('rejects duplicate artifact descriptors', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifacts: [valid.artifacts[0], valid.artifacts[0]],
      artifactKey: 'parent',
    })).toBeFalse();
  });

  it('does not accept route or authorization metadata as a substitute for delivery fields', () => {
    expect(isServerNavigationResolution({
      version: 1,
      artifactKey: 'leaf',
      artifacts: [{
        artifactKey: 'leaf',
        branchIds: ['hidden'],
        policies: [{ roles: ['admin'] }],
      }],
    })).toBeFalse();
  });
});