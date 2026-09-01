import { route } from '@epikodelabs/waypoint';

import { ResolvedNavigationState } from '../lib/resolved-navigation';
import { RouteResolutionCoordinator } from '../lib/route-resolution-coordinator';
import { ServerNavigationCoordinator } from '../lib/server-navigation-coordinator';

class HomePage {}

describe('ServerNavigationCoordinator', () => {
  it('delegates authored-only revalidation to the active engine', async () => {
    const state = new ResolvedNavigationState(
      [route('/home', HomePage)] as const,
    );
    const resolution = new RouteResolutionCoordinator(state);
    let calls = 0;

    const runtime = {
      requireEngine: () => ({
        revalidate: async () => {
          calls++;
          return true;
        },
      }),
      recordError: () => {},
    } as any;

    const navigation = new ServerNavigationCoordinator({
      document: {} as Document,
      baseHref: '/',
      resolvedNavigation: state,
      routeResolution: resolution,
      runtime: () => runtime,
      href: () => '/home',
    });

    expect(await navigation.revalidate()).toBeTrue();
    expect(calls).toBe(1);
  });

  it('does not recover the untouched startup root 404', () => {
    const state = new ResolvedNavigationState([] as const);
    const resolution = new RouteResolutionCoordinator(state);
    const navigation = new ServerNavigationCoordinator({
      document: {} as Document,
      baseHref: '/',
      resolvedNavigation: state,
      routeResolution: resolution,
      runtime: () => ({} as any),
      href: () => '/',
    });

    expect(
      navigation.shouldResolveNotFoundUrl(
        new URL('https://example.test/'),
      ),
    ).toBeFalse();
    expect(
      navigation.shouldResolveNotFoundUrl(
        new URL('https://example.test/missing'),
      ),
    ).toBeTrue();
  });
});
