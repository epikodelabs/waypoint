import { artifactDeliveryOrder } from './delivery-order';

describe('artifact delivery order', () => {
  it('returns shared and parent artifacts before the requested route artifact', () => {
    const artifacts = [
      { artifactKey: 'application', dependencies: [], sharedDependencies: ['shared:user'] },
      { artifactKey: 'shared:user', dependencies: [] },
      { artifactKey: 'admin', dependencies: ['application'], sharedDependencies: ['shared:admin'] },
      { artifactKey: 'shared:admin', dependencies: ['shared:user'] },
    ];

    expect(artifactDeliveryOrder('admin', artifacts)).toEqual([
      'shared:user',
      'application',
      'shared:admin',
      'admin',
    ]);
  });
});
