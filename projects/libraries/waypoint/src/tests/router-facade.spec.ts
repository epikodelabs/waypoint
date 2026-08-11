import { ensureAngularTestEnvironment } from './angular-testbed.init';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  frame,
  layout,
  lazyLayout,
  lazyRoute,
  provideRouter,
  RouterOutlet,
  route,
  routeSlot,
  routesFor,
  type RouterOptions,
  Router,
  type NavigationTree,
} from '@epikodelabs/waypoint';

ensureAngularTestEnvironment();

@Component({ standalone: true, template: '<h1>Home</h1>' })
class HomeComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Parent</h2><router-outlet />',
  host: { 'parent-cmp': '' },
})
class ParentComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Shell</h2><router-outlet />',
  host: { 'shell-cmp': '' },
})
class ShellComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Shell</h2><router-outlet name="sidebar" /><router-outlet />',
  host: { 'shell-sidebar-cmp': '' },
})
class ShellWithSidebarComponent {}

@Component({
  standalone: true,
  template: '<h3>Child</h3>',
  host: { 'child-cmp': '' },
})
class ChildComponent {}

@Component({
  standalone: true,
  template: '<h3>Settings</h3>',
  host: { 'settings-cmp': '' },
})
class SettingsComponent {}

describe('Router: flat routes and layouts', () => {
  let outlet: HTMLElement;
  let router: Router;

  function bootstrap(routes: NavigationTree, options: RouterOptions = {}): void {
    TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        ParentComponent,
        ShellComponent,
        ShellWithSidebarComponent,
        ChildComponent,
        SettingsComponent,
      ],
      providers: [...provideRouter(routes, options)],
    });

    outlet = document.createElement('div');
    router = TestBed.inject(Router);
    router.connect('', outlet);
  }

  function getOutletContent(): string {
    return outlet.innerHTML;
  }

  async function navigate(path: string): Promise<void> {
    await router.navigate({ path });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    spyOn(window.history, 'pushState').and.callThrough();
    spyOn(window.history, 'replaceState').and.callThrough();
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    router?.dispose();
    outlet?.remove();
  });

  it('renders a leaf route without a layout', async () => {
    const routes = [route('/', HomeComponent)] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/');

    expect(getOutletContent()).toContain('<h1>Home</h1>');
  });

  it('supports a layout index route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('', HomeComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h1>Home</h1>');
  });

  it('renders an eager layout around an eager leaf route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('/child', ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('inherits the layout path prefix', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('/settings', SettingsComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/settings');

    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/admin/settings');
  });

  it('renders an eager layout around a lazy leaf route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [lazyRoute('/lazy-child', async () => ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/lazy-child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('renders a lazy layout around an eager leaf route', async () => {
    const routes = [
      lazyLayout('/admin', async () => ParentComponent, [route('/child', ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('renders a lazy layout around a lazy leaf route', async () => {
    const routes = [
      lazyLayout('/admin', async () => ParentComponent, [
        lazyRoute('/lazy-child', async () => ChildComponent),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/lazy-child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('composes multiple layouts without creating a route hierarchy', async () => {
    const routes = [
      layout('/app', ShellComponent, [
        layout('/admin', ParentComponent, [route('/child', ChildComponent)]),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/app/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Shell</h2>');
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('supports multiple leaf routes inside one prefixed layout', async () => {
    const routes = [
      layout('/admin', ParentComponent, [
        route('/child', ChildComponent),
        route('/settings', SettingsComponent),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/admin/child');
    expect(getOutletContent()).toContain('<h3>Child</h3>');

    await navigate('/admin/settings');
    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Settings</h3>');
    expect(content).not.toContain('<h3>Child</h3>');
  });

  it('supports named outlets', async () => {
    const routes = [
      layout('/', ParentComponent, [
        route('', HomeComponent),
        route('', SettingsComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    const sidebarOutlet = document.createElement('div');
    sidebarOutlet.id = 'sidebar-outlet';

    bootstrap(routes);
    router.connect('sidebar', sidebarOutlet);

    await navigate('/');
    const content = getOutletContent();
    expect(content).toContain('<h1>Home</h1>');
    expect(sidebarOutlet.innerHTML).toContain('<h3>Settings</h3>');

    router.disconnect('sidebar', sidebarOutlet);
  });

  it('connects named outlets declared inside a layout component', async () => {
    const routes = [
      layout('/app', ShellWithSidebarComponent, [
        route('/child', ChildComponent),
        route('/child', SettingsComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/app/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Shell</h2>');
    expect(content).toContain('<h3>Child</h3>');
    expect(content).toContain('<h3>Settings</h3>');
  });

  it('keeps named outlet navigation working across layout re-renders', async () => {
    const routes = [
      layout('/app', ShellWithSidebarComponent, [
        route('/child', ChildComponent),
        route('/child', SettingsComponent, { outlet: 'sidebar' }),
        route('/settings', SettingsComponent),
        route('/settings', HomeComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/app/child');
    expect(getOutletContent()).toContain('<h3>Child</h3>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');

    await navigate('/app/settings');

    const content = getOutletContent();
    expect(content).toContain('<h3>Settings</h3>');
    expect(content).toContain('<h1>Home</h1>');
    expect(router.state.path).toBe('/app/settings');
    expect(router.displayUrl).toBe('/app/settings');
  });


  it('resolves a protected direct deep link during initial bootstrap', async () => {
    const deepRoutes = routesFor(
      'application',
      'deep-link-routes',
      [route('/app/deep', SettingsComponent, { name: 'deep' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) =>
      url.pathname === '/app/deep' ? { contributions: [deepRoutes] } : null,
    );

    window.history.replaceState(null, '', '/app/deep');
    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(resolveRoutes).toHaveBeenCalled();
    expect(router.state.path).toBe('/app/deep');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('composes a missing route branch before named navigation', async () => {
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/app/settings') {
        return null;
      }

      return [
        layout('/app', ParentComponent, [
          route('/settings', SettingsComponent, {
            name: 'settings',
          }),
        ]),
      ] as const satisfies NavigationTree;
    });

    bootstrap([route('/', HomeComponent)] as const satisfies NavigationTree, {
      namedRoutes: [
        {
          name: 'settings',
          path: '/app/settings',
        },
      ],
      resolveRoutes,
    });

    expect(
      router.href({
        name: 'settings',
      }),
    ).toBe('/app/settings');

    await router.navigate({
      name: 'settings',
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(resolveRoutes).toHaveBeenCalled();
    expect(getOutletContent()).toContain('<h2>Parent</h2>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/app/settings');
    expect(router.displayUrl).toBe('/app/settings');
  });

  it('attaches server-resolved route contributions to existing route slots', async () => {
    const applicationRoutes = routesFor(
      'application',
      'application-core',
      [
        layout('/app', ParentComponent, [
          route('/settings', SettingsComponent),
        ]),
      ] as const satisfies NavigationTree,
    );

    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.resolveTo({
      contributions: [applicationRoutes],
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/app/settings');

    expect(resolveRoutes).toHaveBeenCalled();
    expect(getOutletContent()).toContain('<h2>Parent</h2>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/app/settings');
  });


  it('revokes resolved contributions at an explicit authorization boundary', async () => {
    let allowed = true;
    const protectedRoutes = routesFor(
      'application',
      'protected',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin' || !allowed) return null;
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.href({ name: 'admin' })).toBe('/admin');

    allowed = false;
    await router.revalidate({ resetResolvedRoutes: true });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
    expect(resolveRoutes.calls.count()).toBeGreaterThan(1);
  });

  it('restores a revoked contribution when the current destination becomes authorized again', async () => {
    let allowed = true;
    const protectedRoutes = routesFor(
      'application',
      'protected',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin' || !allowed) return null;
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    allowed = false;
    await router.revalidate({ resetResolvedRoutes: true });

    allowed = true;
    await router.revalidate({ resetResolvedRoutes: true });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBe('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('discards stale resolver results that complete after revocation starts', async () => {
    let release!: (value: ReturnType<typeof routesFor>) => void;
    const stale = new Promise<ReturnType<typeof routesFor>>(resolve => {
      release = resolve;
    });
    const staleContribution = routesFor(
      'application',
      'stale',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    let first = true;
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin') return null;
      if (first) {
        first = false;
        return { contributions: [await stale] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const navigation = router.navigate({ path: '/admin' });
    await Promise.resolve();

    const revocation = router.revalidate({ resetResolvedRoutes: true });
    release(staleContribution);

    await navigation;
    await revocation;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
  });

  it('fails closed when reauthorization fails after resolved routes are revoked', async () => {
    let fail = false;
    const protectedRoutes = routesFor(
      'application',
      'protected-fail-closed',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin') return null;
      if (fail) throw new Error('authorization service unavailable');
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');

    fail = true;
    await expectAsync(
      router.revalidate({ resetResolvedRoutes: true }),
    ).toBeRejectedWithError(/authorization service unavailable/);

    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
  });

  it('retries transient route-resolution failures instead of negative-caching them', async () => {
    let attempts = 0;
    const retryRoutes = routesFor(
      'application',
      'retry-routes',
      [route('/retry', SettingsComponent, { name: 'retry' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/retry') return null;
      attempts++;
      if (attempts === 1) throw new Error('temporary network failure');
      return { contributions: [retryRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await expectAsync(
      router.navigate({ path: '/retry' }),
    ).toBeRejectedWithError(/temporary network failure/);

    expect(await router.navigate({ path: '/retry' })).toBeTrue();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(attempts).toBe(2);
    expect(router.state.path).toBe('/retry');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('does not let an older slow server resolution navigate after a newer request', async () => {
    let releaseSlow!: () => void;
    const slowGate = new Promise<void>(resolve => {
      releaseSlow = resolve;
    });
    const slowRoutes = routesFor(
      'application',
      'slow-routes',
      [route('/slow', ChildComponent, { name: 'slow' })],
    );
    const fastRoutes = routesFor(
      'application',
      'fast-routes',
      [route('/fast', SettingsComponent, { name: 'fast' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname === '/slow') {
        await slowGate;
        return { contributions: [slowRoutes] };
      }
      if (url.pathname === '/fast') {
        return { contributions: [fastRoutes] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const slowNavigation = router.navigate({ path: '/slow' });
    await Promise.resolve();
    const fastNavigation = router.navigate({ path: '/fast' });

    expect(await fastNavigation).toBeTrue();
    releaseSlow();
    expect(await slowNavigation).toBeFalse();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.state.path).toBe('/fast');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(getOutletContent()).not.toContain('<h3>Child</h3>');
  });

  it('keeps resolved state transactional when a malformed contribution is rejected', async () => {
    let attempt = 0;
    const malformed = routesFor(
      'missing-slot',
      'malformed',
      [route('/dynamic', ChildComponent)],
    );
    const valid = routesFor(
      'application',
      'valid-dynamic',
      [route('/dynamic', SettingsComponent, { name: 'dynamic' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/dynamic') return null;
      attempt++;
      return attempt === 1
        ? { contributions: [malformed] }
        : { contributions: [valid] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await expectAsync(
      router.navigate({ path: '/dynamic' }),
    ).toBeRejectedWithError(/unknown route slot/i);

    expect(await router.navigate({ path: '/dynamic' })).toBeTrue();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'dynamic' })).toBe('/dynamic');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('rejects resolved contributions that collide with authored contribution identity', async () => {
    const authored = routesFor(
      'application',
      'authored-core',
      [route('/static', ChildComponent, { name: 'static' })],
    );
    const conflicting = routesFor(
      'application',
      'authored-core',
      [route('/dynamic', SettingsComponent, { name: 'dynamic' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.resolveTo({
      contributions: [conflicting],
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes, contributions: [authored] },
    );

    await expectAsync(
      router.navigate({ path: '/dynamic' }),
    ).toBeRejectedWithError(/conflicts with an authored contribution/i);

    expect(router.href({ name: 'static' })).toBe('/static');
    expect(router.href({ name: 'dynamic' })).toBeNull();
  });


  it('aborts superseded server route resolution work', async () => {
    let slowSignal: AbortSignal | undefined;
    let releaseSlow!: () => void;
    const slowGate = new Promise<void>(resolve => {
      releaseSlow = resolve;
    });
    const slowRoutes = routesFor(
      'application',
      'abort-slow-routes',
      [route('/abort-slow', ChildComponent)],
    );
    const fastRoutes = routesFor(
      'application',
      'abort-fast-routes',
      [route('/abort-fast', SettingsComponent)],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (
      url: URL,
      context: { signal: AbortSignal },
    ) => {
      if (url.pathname === '/abort-slow') {
        slowSignal = context.signal;
        await slowGate;
        return { contributions: [slowRoutes] };
      }
      if (url.pathname === '/abort-fast') {
        return { contributions: [fastRoutes] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const slowNavigation = router.navigate({ path: '/abort-slow' });
    await Promise.resolve();
    const fastNavigation = router.navigate({ path: '/abort-fast' });

    expect(slowSignal?.aborted).toBeTrue();
    expect(await fastNavigation).toBeTrue();
    releaseSlow();
    expect(await slowNavigation).toBeFalse();
  });

  it('uses frame hooks as the route lifecycle API', async () => {
    const events: string[] = [];

    const routes = [
      route(
        '/home',
        frame(HomeComponent, {
          beforeEnter: [() => {
            events.push('beforeEnter');
            return true;
          }],
          prepare: [() => {
            events.push('prepare');
            return { prepared: true };
          }],
          afterEnter: [() => {
            events.push('afterEnter');
          }],
          beforeLeave: [() => {
            events.push('beforeLeave');
            return true;
          }],
        }),
      ),
      route('/settings', SettingsComponent),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/home');
    expect(events).toEqual([
      'beforeEnter',
      'prepare',
      'afterEnter',
    ]);

    await navigate('/settings');
    expect(events).toEqual([
      'beforeEnter',
      'prepare',
      'afterEnter',
      'beforeLeave',
    ]);
  });

  it('blocks navigation when a frame beforeEnter hook returns false', async () => {
    const routes = [
      route(
        '/protected',
        frame(HomeComponent, {
          beforeEnter: [() => false],
        }),
      ),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/protected');

    expect(getOutletContent()).not.toContain('<h1>Home</h1>');
    expect(router.state.path).toBe('');
  });

});