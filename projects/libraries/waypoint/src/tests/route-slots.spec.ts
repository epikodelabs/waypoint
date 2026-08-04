import { Component } from '@angular/core';

import {
  routesFor,
  routeSlot,
} from '../lib/route-slots';
import { layout, route } from '../lib/route-builders';
import {
  compileNavigation,
  createRouteRegistry,
} from '../lib/route-compiler';

@Component({ template: '' })
class AppLayout {}

@Component({ template: '' })
class AdminLayout {}

@Component({ template: '' })
class HomePage {}

@Component({ template: '' })
class UsersPage {}

@Component({ template: '' })
class RolesPage {}

describe('Waypoint retained route slots', () => {
  it('compiles contributions relative to the declared slot position', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage),
        layout('/admin', AdminLayout, [
          routeSlot('administration'),
        ]),
      ]),
    ] as const;

    const administration = routesFor(
      'administration',
      'admin-core',
      [
        route('/users', UsersPage, { name: 'adminUsers' }),
        route('/roles', RolesPage, { name: 'adminRoles' }),
      ],
    );

    const registry = createRouteRegistry(routes, [administration]);

    expect(registry.namedRoutes.get('adminUsers')?.fullPath)
      .toBe('/app/admin/users');
    expect(registry.namedRoutes.get('adminRoles')?.fullPath)
      .toBe('/app/admin/roles');
  });

  it('retains empty slots in the registry', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage, { name: 'home' }),
        routeSlot('optional-features'),
      ]),
    ] as const;

    const registry = createRouteRegistry(routes);
    const slot = registry.slots.get('optional-features');

    expect(registry.namedRoutes.get('home')?.fullPath).toBe('/app/home');
    expect(registry.groups.length).toBe(1);
    expect(slot?.parentPath).toBe('/app');
    expect(slot?.layouts.map(layout => layout.path)).toEqual(['/app']);
  });

  it('retains contribution identity and compiled route provenance', () => {
    const routes = [
      layout('/app', AppLayout, [
        routeSlot('administration'),
      ]),
    ] as const;
    const contribution = routesFor(
      'administration',
      'admin-users',
      [route('/users', UsersPage, { name: 'adminUsers' })],
    );

    const registry = createRouteRegistry(routes, [contribution]);
    const compiledContribution = registry.contributions.get('admin-users');
    const namedRoute = registry.namedRoutes.get('adminUsers');

    expect(compiledContribution?.slotId).toBe('administration');
    expect(compiledContribution?.routes.length).toBe(1);
    expect(compiledContribution?.routes[0].path).toBe('/app/users');
    expect(compiledContribution?.routes[0].slotId).toBe('administration');
    expect(compiledContribution?.routes[0].contributionId).toBe('admin-users');
    expect(namedRoute?.slotId).toBe('administration');
    expect(namedRoute?.contributionId).toBe('admin-users');
  });

  it('exposes retained identities through compileNavigation', () => {
    const routes = [routeSlot('features')] as const;
    const contribution = routesFor(
      'features',
      'feature-a',
      [route('/feature', UsersPage)],
    );

    const compiled = compileNavigation(routes, [contribution]);

    expect(compiled.slots.has('features')).toBeTrue();
    expect(compiled.contributions.has('feature-a')).toBeTrue();
    expect(compiled.routes[0].path).toBe('/feature');
  });

  it('rejects duplicate slot ids', () => {
    const routes = [
      routeSlot('features'),
      layout('/app', AppLayout, [routeSlot('features')]),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /Duplicate route slot id "features"/,
    );
  });

  it('rejects unknown contribution slots', () => {
    const contribution = routesFor(
      'missing',
      'missing-feature',
      [route('/feature', UsersPage)],
    );

    expect(() => createRouteRegistry([], [contribution])).toThrowError(
      /targets unknown route slot "missing"/,
    );
  });

  it('rejects duplicate contribution ids', () => {
    const routes = [
      routeSlot('first'),
      routeSlot('second'),
    ] as const;
    const first = routesFor('first', 'feature', []);
    const second = routesFor('second', 'feature', []);

    expect(() => createRouteRegistry(routes, [first, second])).toThrowError(
      /Duplicate route contribution id "feature"/,
    );
  });

  it('validates inherited parameter collisions in contributed routes', () => {
    const routes = [
      layout('/devices/:id', AppLayout, [
        routeSlot('device-features'),
      ]),
    ] as const;
    const contribution = routesFor(
      'device-features',
      'boards',
      [route('/boards/:id', UsersPage)],
    );

    expect(() => createRouteRegistry(routes, [contribution])).toThrowError(
      /Duplicate path parameter ":id"/,
    );
  });
});
