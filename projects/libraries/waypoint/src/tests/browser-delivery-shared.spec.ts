

describe('generated host-module API', () => {
  it('exposes host module registration for generated builder code', async () => {
    const waypoint = await import('../public-api');

    expect(
      typeof waypoint.registerServerNavigationHostModules,
    ).toBe('function');
  });
});
