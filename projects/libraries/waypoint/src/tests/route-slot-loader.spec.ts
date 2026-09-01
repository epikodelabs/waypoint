import {
  route,
  routeSlot,
  routesFor,
} from '@epikodelabs/waypoint';
import { defineRouteContribution } from '../lib/route-slots';

describe('routeSlot contribution loader', () => {
  it('retains an authored lazy contribution edge without executing it', () => {
    let loads = 0;

    const slot = routeSlot(
      'feature',
      async () => {
        loads++;
        return defineRouteContribution(
      'feature',
      'feature-core',
      [
            route('/feature', class FeaturePage {}),
          ],
    );
      },
    );

    expect(slot.id).toBe('feature');
    expect(slot.loadContribution).toBeDefined();
    expect(loads).toBe(0);
  });

  it('keeps loader-less slots valid for externally supplied server roots', () => {
    const slot = routeSlot('application');

    expect(slot.id).toBe('application');
    expect(slot.loadContribution)
      .toBeUndefined();
  });
});