import {
  layout,
  redirectRoute,
  route,
  s,
} from '@epikodelabs/waypoint';

import { createRouteRegistry } from '../lib/route-compiler';

class TestPage {}
class TestLayout {}

describe('route compiler parameter validation', () => {
  it('rejects duplicate parameter names across layouts and leaf routes', () => {
    const routes = [
      layout('/teams/:id', TestLayout, [
        route('/members/:id', TestPage),
      ]),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /Duplicate path parameter ":id" in compiled route "\/teams\/:id\/members\/:id"/,
    );
  });

  it('rejects paramsSchema keys that are absent from the compiled path', () => {
    const routes = [
      route('/users/:userId', TestPage, {
        paramsSchema: {
          id: s.number(),
        },
      }),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /paramsSchema declares "id".*does not contain ":id"/,
    );
  });

  it('requires every path parameter to be declared when paramsSchema is present', () => {
    const routes = [
      route('/teams/:teamId/users/:userId', TestPage, {
        paramsSchema: {
          teamId: s.number(),
        },
      }),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /contains ":userId", but paramsSchema does not declare it/,
    );
  });

  it('accepts an exact paramsSchema for the compiled path', () => {
    const routes = [
      layout('/teams/:teamId', TestLayout, [
        route('/users/:userId', TestPage, {
          paramsSchema: {
            teamId: s.number(),
            userId: s.number(),
          },
        }),
      ]),
    ] as const;

    expect(() => createRouteRegistry(routes)).not.toThrow();
  });
  it('preserves server policy metadata without changing runtime compilation', () => {
    const protectedRoute = route('/admin', TestPage, {
      policy: {
        roles: ['admin'],
        permissions: ['admin:read'],
      },
    });

    const registry = createRouteRegistry([protectedRoute]);

    expect(protectedRoute.policy).toEqual({
      roles: ['admin'],
      permissions: ['admin:read'],
    });
    expect(registry.groups[0]?.primary.route).toBe(protectedRoute);
  });

  it('compiles redirects into a complete discriminated runtime record', () => {
    const redirect = redirectRoute('/legacy', '/app/home');
    const registry = createRouteRegistry([redirect]);
    const compiled = registry.groups[0]?.primary;

    expect(compiled?.route).toBe(redirect);
    expect(compiled?.path).toBe('/legacy');
    expect(compiled?.redirectTo).toBe('/app/home');
  });

  it('rejects empty redirect targets during compilation', () => {
    const redirect = redirectRoute('/legacy', '');

    expect(() => createRouteRegistry([redirect])).toThrowError(
      /Redirect target must not be empty/,
    );
  });

  it('keeps named outlets on a renderable compiled route group', () => {
    const primary = route('/workspace', TestPage);
    const sidebar = route('/workspace', TestPage, { outlet: 'sidebar' });
    const registry = createRouteRegistry([primary, sidebar]);
    const group = registry.groups[0];

    expect(group?.primary.route).toBe(primary);
    expect(group?.outlets.length).toBe(1);
    expect(group?.outlets[0]?.route).toBe(sidebar);
  });

});
