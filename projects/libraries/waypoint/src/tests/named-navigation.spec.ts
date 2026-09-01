import { NamedNavigationCatalog } from '../lib/named-navigation';

describe('NamedNavigationCatalog', () => {
  it('prefers compiled named routes over deferred catalog entries', () => {
    const catalog = new NamedNavigationCatalog([
      { name: 'user', path: '/deferred/:id' },
    ]);

    const href = catalog.href(
      { name: 'user', params: { id: '42' } },
      {
        namedRoutes: new Map([
          ['user', { path: '/compiled/:id', route: {} }],
        ]),
      },
      (value) => value,
    );

    expect(href).toBe('/compiled/42');
  });

  it('returns null when a required path parameter is absent', () => {
    const catalog = new NamedNavigationCatalog([
      { name: 'user', path: '/users/:id' },
    ]);

    expect(
      catalog.href(
        { name: 'user' },
        { namedRoutes: new Map() },
        (value) => value,
      ),
    ).toBeNull();
  });

  it('does not generate hrefs for redirect routes', () => {
    const catalog = new NamedNavigationCatalog();

    expect(
      catalog.href(
        { name: 'legacy' },
        {
          namedRoutes: new Map([
            [
              'legacy',
              {
                path: '/legacy',
                route: { kind: 'redirect' as const },
              },
            ],
          ]),
        },
        (value) => value,
      ),
    ).toBeNull();
  });
});
