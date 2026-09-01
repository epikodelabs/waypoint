import {
  createHostRoutesSource,
} from '../compiler/host-routes-entry.js';

describe('Waypoint generated host routes', () => {
  it('contains only public ownership slots', () => {
    const source = createHostRoutesSource();

    expect(source).toContain(
      `import { routeSlot } from '@epikodelabs/waypoint';`,
    );
    expect(source).toContain(
      `routeSlot('public')`,
    );
    expect(source).toContain(
      `routeSlot('application')`,
    );
    expect(source).not.toContain(
      'registerServerNavigationHostModules',
    );
  });
});
