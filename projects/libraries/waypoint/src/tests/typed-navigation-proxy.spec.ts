import {
  createTypedHrefProxy,
} from '../lib/typed-navigation-proxy';

describe('typed navigation proxy', () => {
  it('converts a property access to a named target', () => {
    const seen: unknown[] = [];

    const href =
      createTypedHrefProxy<any>(
        (target) => {
          seen.push(target);
          return '/users/42';
        },
      );

    expect(
      (href as any).user({
        params: { id: 42 },
      }),
    ).toBe('/users/42');

    expect(seen).toEqual([
      {
        name: 'user',
        params: { id: 42 },
      },
    ]);
  });

  it('is not promise-like', () => {
    const href =
      createTypedHrefProxy<any>(
        () => '/',
      );

    expect(
      (href as any).then,
    ).toBeUndefined();
  });
});
