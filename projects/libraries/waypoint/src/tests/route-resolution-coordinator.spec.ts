import { route } from '@epikodelabs/waypoint';

import { ResolvedNavigationState } from '../lib/resolved-navigation';
import { RouteResolutionCoordinator } from '../lib/route-resolution-coordinator';

class HomePage {}
class FeaturePage {}

describe('RouteResolutionCoordinator', () => {
  it('deduplicates concurrent resolution for the same route key', async () => {
    const state = new ResolvedNavigationState(
      [route('/home', HomePage)] as const,
    );

    let calls = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const coordinator = new RouteResolutionCoordinator(
      state,
      async () => {
        calls++;
        await gate;
        return [route('/feature', FeaturePage)];
      },
    );

    const url = new URL('https://example.test/feature');
    const first = coordinator.resolve(url, '/feature');
    const second = coordinator.resolve(url, '/feature');

    release();

    expect(await first).toBeTrue();
    expect(await second).toBeTrue();
    expect(calls).toBe(1);
  });

  it('caches negative resolutions but not resolver failures', async () => {
    const state = new ResolvedNavigationState([] as const);
    let calls = 0;

    const coordinator = new RouteResolutionCoordinator(
      state,
      async () => {
        calls++;
        if (calls === 1) {
          throw new Error('transport');
        }
        return null;
      },
    );

    const url = new URL('https://example.test/missing');

    await expectAsync(
      coordinator.resolve(url, '/missing'),
    ).toBeRejectedWithError('transport');

    expect(await coordinator.resolve(url, '/missing')).toBeFalse();
    expect(await coordinator.resolve(url, '/missing')).toBeFalse();
    expect(calls).toBe(2);
  });

  it('invalidate aborts stale work and advances generation', async () => {
    const state = new ResolvedNavigationState([] as const);

    const coordinator = new RouteResolutionCoordinator(
      state,
      (_url, context) =>
        new Promise((resolve) => {
          context.signal.addEventListener(
            'abort',
            () => resolve(null),
            { once: true },
          );
        }),
    );

    const generation = coordinator.generation;
    const pending = coordinator.resolve(
      new URL('https://example.test/feature'),
      '/feature',
    );

    coordinator.invalidate();

    expect(coordinator.generation).toBe(generation + 1);
    expect(await pending).toBeFalse();
  });
});
