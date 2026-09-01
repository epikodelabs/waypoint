import {
  route,
  routeSlot,
  routesFor,
} from '@epikodelabs/waypoint';
import { defineRouteContribution } from '../lib/route-slots';

import {
  ResolvedNavigationState,
} from '../lib/resolved-navigation';

class HomePage {}
class FeaturePage {}

describe('ResolvedNavigationState', () => {
  it('merges delivered routes into the authored registry', () => {
    const state = new ResolvedNavigationState(
      [route('/home', HomePage, { name: 'home' })] as const,
    );

    expect(state.matchesPath('/feature')).toBeFalse();

    expect(
      state.merge([
        route('/feature', FeaturePage, {
          name: 'feature',
        }),
      ]),
    ).toBeTrue();

    expect(state.matchesPath('/home')).toBeTrue();
    expect(state.matchesPath('/feature')).toBeTrue();
  });

  it('rejects delivered contributions that collide with authored ids', () => {
    const authored = defineRouteContribution(
      'features',
      'feature-a',
      [route('/authored', FeaturePage)],
    );
    const state = new ResolvedNavigationState(
      [routeSlot('features')] as const,
      [authored],
    );

    const conflicting = defineRouteContribution(
      'features',
      'feature-a',
      [route('/delivered', FeaturePage)],
    );

    expect(() =>
      state.merge({
        contributions: [conflicting],
      }),
    ).toThrowError(
      /conflicts with an authored contribution/,
    );

    expect(state.matchesPath('/authored')).toBeTrue();
    expect(state.matchesPath('/delivered')).toBeFalse();
  });

  it('tracks authoritative contribution identity and provenance', () => {
    const state = new ResolvedNavigationState(
      [routeSlot('features')] as const,
    );
    const first = defineRouteContribution(
      'features',
      'feature-a',
      [route('/feature', FeaturePage)],
    );

    state.replace({
      contributions: [first],
      contributionIdentities: {
        'feature-a': 'artifact-1',
      },
    });

    expect(
      state.contributionIdentity('feature-a'),
    ).toBe('artifact-1');
    expect(
      state.contributionIdForPath('/feature'),
    ).toBe('feature-a');
  });

  it('reset revokes delivered routes and keeps authored routes', () => {
    const state = new ResolvedNavigationState(
      [route('/home', HomePage)] as const,
    );

    state.merge({
      routes: [route('/feature', FeaturePage)],
    });

    expect(state.matchesPath('/feature')).toBeTrue();

    state.reset();

    expect(state.matchesPath('/home')).toBeTrue();
    expect(state.matchesPath('/feature')).toBeFalse();
  });
});