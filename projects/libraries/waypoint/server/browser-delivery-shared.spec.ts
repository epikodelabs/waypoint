import {
  createServerNavigationResolver,
} from './browser-delivery';

describe('browser shared artifact delivery', () => {
  it('loads shared modules but returns only route contributions', async () => {
    const imported: string[] = [];
    const routeContribution = { kind: 'routes-for', id: 'admin' } as any;

    const resolver = createServerNavigationResolver({
      fetch: async () => ({
        ok: true,
        status: 200,
        async json() {
          return {
            artifactKey: 'admin',
            artifacts: [
              {
                kind: 'shared',
                artifactKey: 'shared:admin',
                moduleUrl: '/modules/shared/ABC',
                hash: 'ABC',
              },
              {
                kind: 'route',
                artifactKey: 'admin',
                moduleUrl: '/modules/admin/DEF',
                hash: 'DEF',
              },
            ],
          };
        },
      }),
      importModule: async url => {
        imported.push(url);
        return url.includes('/admin/')
          ? { default: routeContribution }
          : { helper: true };
      },
    });

    const result = await resolver(new URL('https://example.test/app/admin'));

    expect(imported).toEqual([
      '/modules/shared/ABC',
      '/modules/admin/DEF',
    ]);
    expect(result?.contributions).toEqual([routeContribution]);
  });

  it('does not require shared modules to export route contributions', async () => {
    const resolver = createServerNavigationResolver({
      fetch: async () => ({
        ok: true,
        status: 200,
        async json() {
          return {
            artifactKey: 'route',
            artifacts: [
              {
                kind: 'shared',
                artifactKey: 'shared:x',
                moduleUrl: '/shared.js',
                hash: 'A',
              },
              {
                kind: 'route',
                artifactKey: 'route',
                moduleUrl: '/route.js',
                hash: 'B',
              },
            ],
          };
        },
      }),
      importModule: async url =>
        url === '/shared.js'
          ? {}
          : { default: { kind: 'routes-for', id: 'route' } },
    });

    await expectAsync(
      resolver(new URL('https://example.test/route')),
    ).toBeResolved();
  });
});