import {
  createHostResolverSource,
} from '../compiler/host-resolver-entry.js';

describe('Waypoint generated resolver', () => {
  it('passes exact discovered namespace identities to the resolver', () => {
    const source = createHostResolverSource([
      '@angular/core',
    ]);

    expect(source).toContain(
      'import * as module0 from "@angular/core";',
    );
    expect(source).toContain(
      '"@angular/core": module0',
    );
    expect(source).toContain(
      '"@epikodelabs/waypoint": module1',
    );
    expect(source).toContain(
      'module1.createServerNavigationResolver({',
    );
    expect(source).toContain(
      'hostModules: {',
    );
  });
});
