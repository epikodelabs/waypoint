import {
  registerServerNavigationHostModules,
} from '../lib/server-host-runtime';

describe('server navigation host runtime', () => {
  it('accepts repeated registration of the same package module identity', () => {
    const module = Object.freeze({ token: {} });
    const specifier = `test/same/${Math.random()}`;

    expect(() => {
      registerServerNavigationHostModules({ [specifier]: module });
      registerServerNavigationHostModules({ [specifier]: module });
    }).not.toThrow();
  });

  it('rejects a second module identity for the same shared package', () => {
    const specifier = `test/conflict/${Math.random()}`;
    registerServerNavigationHostModules({
      [specifier]: Object.freeze({ token: 1 }),
    });

    expect(() => registerServerNavigationHostModules({
      [specifier]: Object.freeze({ token: 2 }),
    })).toThrowError(/different module identity/i);
  });
});
