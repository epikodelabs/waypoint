import {
  readReloadLocation,
} from '../lib/router-reload';

describe('router reload', () => {
  it('accepts an application path', () => {
    expect(
      readReloadLocation({
        location: '/app/settings',
      }),
    ).toBe('/app/settings');
  });

  it('rejects protocol-relative locations', () => {
    expect(() =>
      readReloadLocation({
        location:
          '//evil.example/path',
      }),
    ).toThrowError(
      /unsafe Waypoint reload location/,
    );
  });

  it('rejects malformed responses', () => {
    expect(() =>
      readReloadLocation({}),
    ).toThrowError(
      /invalid Waypoint reload response/,
    );
  });
});
