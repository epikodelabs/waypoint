import { Component } from '@angular/core';

import {
  defineRouteContribution,
  routesFor,
  routeSlot,
} from '../lib/route-slots';
import { layout, route } from '../lib/route-builders';
import { createRouteRegistry } from '../lib/route-compiler';

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

describe('Waypoint route slots', () => {
  it('compiles contributions relative to the declared slot position', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage),
        layout('/admin', AdminLayout, [
          routeSlot('administration'),
        ]),
      ]),
    ] as const;

    const administration = defineRouteContribution(
      'administration',
      'admin-core',
      [
        route('/users', UsersPage, { name: 'adminUsers' }),
        route('/roles', RolesPage, { name: 'adminRoles' }),
      ],
    );

    const registry = createRouteRegistry(routes, [administration]);

    expect(registry.namedRoutes.get('adminUsers')?.path)
      .toBe('/app/admin/users');
    expect(registry.namedRoutes.get('adminRoles')?.path)
      .toBe('/app/admin/roles');
  });

  it('allows empty slots without adding runtime route state', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage, { name: 'home' }),
        routeSlot('optional-features'),
      ]),
    ] as const;

    const registry = createRouteRegistry(routes);
    expect(registry.namedRoutes.get('home')?.path).toBe('/app/home');
    expect(registry.groups.length).toBe(1);
  });

  it('retains contribution provenance on compiled routes', () => {
    const routes = [
      layout('/app', AppLayout, [
        routeSlot('administration'),
      ]),
    ] as const;
    const contribution = defineRouteContribution(
      'administration',
      'admin-users',
      [route('/users', UsersPage, { name: 'adminUsers' })],
    );

    const registry = createRouteRegistry(routes, [contribution]);
    const namedRoute = registry.namedRoutes.get('adminUsers');

    expect(namedRoute?.slotId).toBe('administration');
    expect(namedRoute?.contributionId).toBe('admin-users');
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
    const contribution = defineRouteContribution(
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
    const first = defineRouteContribution('first', 'feature', []);
    const second = defineRouteContribution('second', 'feature', []);

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
    const contribution = defineRouteContribution(
      'device-features',
      'boards',
      [route('/boards/:id', UsersPage)],
    );

    expect(() => createRouteRegistry(routes, [contribution])).toThrowError(
      /Duplicate path parameter ":id"/,
    );
  });
});