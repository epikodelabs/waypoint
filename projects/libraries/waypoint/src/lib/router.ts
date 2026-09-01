import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  InjectionToken,
  PendingTasks,
  inject,
  type Provider,
} from '@angular/core';

import type { NamedNavigationTarget, NavigationTarget } from './navigation-targets';

import {
  NamedNavigationCatalog,
  type NamedRouteDefinition,
} from './named-navigation';

export type { NamedRouteDefinition } from './named-navigation';

import { RouteResolutionCoordinator } from './route-resolution-coordinator';

import {
  createAngularRouterEngine,
  renderRouterStartupError,
  replaceAngularRouterConfiguration,
} from './angular-router-engine';

import {
  ResolvedNavigationState,
  type ResolvedNavigationConfiguration,
  type RouteRegistry,
  type RouteResolution,
  type RouteResolutionContext,
} from './resolved-navigation';

export type {
  ResolvedNavigationConfiguration,
  RouteResolution,
  RouteResolutionContext,
} from './resolved-navigation';

interface RouteConfigurationResolver {
  resolveConfiguration?: () =>
    Promise<ResolvedNavigationConfiguration>;
}

import type {
  LayoutOptions,
  RouteDefinition,
  RouteOptions,
  NavigationTree,
  RouteContributionDefinition,
} from './navigation-definitions';

import type { TypedHref, TypedNavigate } from './typed-navigation';

import {
  ROUTE,
  ROUTE_CONTEXT,
  Router as RouterContract,
  RouterReloadError,
  type RouterReloadOptions,
  type RouterRevalidationOptions,
} from './router-contract';

import { getRouterLocation, isPathInsideBase, resolveRouterUrl, routerHref, stripBaseHref } from './router-url';

import {
  type CanDeactivateFn,
  type ActivatedRoute,
  type NavigationContext,
  type NavigationOptions,
  type PreloadingStrategy,
  type RouteRenderContext,
  type Router as VanillaRouter,
  type RouterState,
  type ScrollRestorationMode,
  type ViewTransitionsOption,
} from './vanilla-router';

export interface RouterOptions {
  readonly baseHref?: string;
  readonly enableTracing?: boolean;
  readonly maxRedirects?: number;
  readonly onSameUrlNavigation?: 'ignore';
  readonly scrollRestoration?: ScrollRestorationMode;
  readonly preloading?: PreloadingStrategy;
  readonly viewTransitions?: ViewTransitionsOption;
  readonly namedRoutes?: readonly NamedRouteDefinition[];
  readonly resolveRoutes?: (url: URL, context: RouteResolutionContext) => Promise<RouteResolution>;
  readonly contributions?: readonly RouteContributionDefinition[];
}


interface RouterConfiguration<
  TRoutes extends NavigationTree = NavigationTree,
> extends RouterOptions {
  routes: TRoutes;
}

const ROUTER_CONFIGURATION = new InjectionToken<RouterConfiguration>('ROUTER_CONFIGURATION');

const EMPTY_ROUTER_STATE: RouterState = Object.freeze({
  current: null,
  pending: false,
  phase: null,
  error: null,
  path: '',
  params: Object.freeze({}),
  query: Object.freeze({}),
  data: Object.freeze({}),
  historyState: null,
  routeConfig: null,
});

function snapshotRouterState(state: RouterState): RouterState {
  return Object.freeze({
    current: state.current ?? null,
    pending: state.pending ?? false,
    phase: state.phase ?? null,
    error: state.error ?? null,
    path: state.path ?? '',
    params: state.params ? Object.freeze({ ...state.params }) : Object.freeze({}),
    query: state.query ? Object.freeze({ ...state.query }) : Object.freeze({}),
    data: state.data ? Object.freeze({ ...state.data }) : Object.freeze({}),
    historyState: state.historyState ?? null,
    routeConfig: state.routeConfig ?? null,
  });
}

function readReloadLocation(payload: unknown): string {
  if (
    !payload
    || typeof payload !== 'object'
    || typeof (payload as { location?: unknown }).location !== 'string'
  ) {
    throw new Error('Server returned an invalid Waypoint reload response.');
  }

  const location = (payload as { location: string }).location;
  if (!location.startsWith('/') || location.startsWith('//')) {
    throw new Error('Server returned an unsafe Waypoint reload location.');
  }

  return location;
}

export class ServerRouter<TRoutes extends NavigationTree = any>
  extends RouterContract<TRoutes> {
  private readonly appRef: ApplicationRef;
  private readonly injector: EnvironmentInjector;
  private readonly destroyRef: DestroyRef;
  private readonly document: Document;
  private readonly pendingTasks: PendingTasks;
  private readonly appBaseHref: string;
  private readonly resolvedNavigation:
    ResolvedNavigationState<TRoutes>;
  private readonly namedNavigation: NamedNavigationCatalog;
  private readonly routeResolution: RouteResolutionCoordinator;
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private navigationRequestId = 0;
  private engine: VanillaRouter | null = null;
  private engineStartupTask: Promise<void> | null = null;
  private currentState: RouterState = EMPTY_ROUTER_STATE;
  private readonly outlets = new Map<string, HTMLElement[]>();
  private readonly notFoundRecoveryTasks = new Map<string, Promise<void>>();
  private tickQueued = false;

  public readonly navigateTo: TypedNavigate<TRoutes>;
  public readonly hrefTo: TypedHref<TRoutes>;

  constructor(private configuration: RouterConfiguration<TRoutes>) {
    super();
    this.appRef = inject(ApplicationRef);
    this.injector = inject(EnvironmentInjector);
    this.destroyRef = inject(DestroyRef);
    this.document = inject(DOCUMENT);
    this.pendingTasks = inject(PendingTasks);
    this.appBaseHref =
      inject(APP_BASE_HREF, {
        optional: true,
      }) ?? '/';

    this.resolvedNavigation =
      new ResolvedNavigationState(
        this.configuration.routes,
        this.configuration.contributions,
      );
    this.namedNavigation = new NamedNavigationCatalog(
      this.configuration.namedRoutes,
    );
    this.routeResolution = new RouteResolutionCoordinator(
      this.resolvedNavigation,
      this.configuration.resolveRoutes,
    );
    this.navigateTo = this.createNavigateProxy();

    this.hrefTo = this.createHrefProxy();

    this.destroyRef.onDestroy(() => this.dispose());
  }

  get active(): boolean {
    return this.engine !== null;
  }

  get state(): RouterState {
    return this.currentState;
  }

  get displayUrl(): string {
    const location = getRouterLocation(this.document);

    return `${location.pathname}${location.search}${location.hash}`;
  }

  connect(name: string, outlet: HTMLElement): void {
    const outletName = name.trim();

    const registered = this.outlets.get(outletName) ?? [];

    if (registered.includes(outlet)) {
      return;
    }

    registered.push(outlet);

    this.outlets.set(outletName, registered);

    if (this.engine || this.engineStartupTask) {
      return;
    }

    this.startEngine();
  }

  disconnect(name: string, outlet: HTMLElement): void {
    const outletName = name.trim();

    const registered = this.outlets.get(outletName);

    if (!registered) {
      return;
    }

    const index = registered.lastIndexOf(outlet);

    if (index < 0) {
      return;
    }

    registered.splice(index, 1);

    if (registered.length === 0) {
      this.outlets.delete(outletName);
    }

    if (this.outlets.size === 0) {
      this.dispose();
    }
  }

  navigate(target: NavigationTarget, options?: NavigationOptions): Promise<boolean> {
    return this.navigateResolved(target, options);
  }

  href(target: NavigationTarget | null | undefined): string | null {
    if (target === null || target === undefined) {
      return null;
    }

    if (typeof target === 'string' || target instanceof URL) {
      return this.resolveHref(target);
    }

    if ('path' in target) {
      return this.resolveHref(target.path);
    }

    if ('name' in target) {
      return this.generateNamedHref(target);
    }

    return null;
  }

  async revalidate(options: RouterRevalidationOptions = {}): Promise<boolean> {
    const resolveRoutes = this.configuration.resolveRoutes;

    // Static/authored-only routers can delegate directly to the active engine.
    if (!resolveRoutes) {
      try {
        return await this.requireEngine().revalidate();
      } catch (error) {
        this.recordNavigationError(error);
        throw error;
      }
    }

    const configurationResolver =
      resolveRoutes as typeof resolveRoutes & RouteConfigurationResolver;

    // A complete server configuration lets us preserve the active component
    // when its executable artifact identity is unchanged while still replacing
    // revoked/changed branches authoritatively.
    if (!options.resetResolvedRoutes && configurationResolver.resolveConfiguration) {
      return this.revalidateResolvedConfiguration(
        configurationResolver.resolveConfiguration,
      );
    }

    // Without a complete configuration endpoint, revalidation is an explicit
    // authorization boundary: revoke delivered routes first, then resolve the
    // current URL again. This is deliberately fail-closed.
    return this.revalidateByRevocation();
  }

  private async revalidateByRevocation(): Promise<boolean> {
    this.navigationRequestId++;
    this.routeResolution.invalidate({ resetState: true });

    const location = getRouterLocation(this.document);
    const url = resolveRouterUrl(
      `${location.pathname}${location.search}${location.hash}`,
      this.baseHref,
      location,
      'navigate',
    );

    try {
      if (
        this.configuration.resolveRoutes
        && url.origin === location.origin
        && isPathInsideBase(url.pathname, this.baseHref)
      ) {
        await this.resolveRoutesForUrl(url, { force: true, install: false });
      }

      return await this.installCurrentRegistry();
    } catch (error) {
      try {
        await this.installCurrentRegistry();
      } catch {
        // Preserve the authorization/transport failure as the actionable error.
      }
      this.recordNavigationError(error);
      throw error;
    }
  }

  private async revalidateResolvedConfiguration(
    resolveConfiguration: () => Promise<ResolvedNavigationConfiguration>,
  ): Promise<boolean> {
    this.navigationRequestId++;
    this.routeResolution.invalidate();
    const generation = this.routeResolution.generation;

    const activeContributionId = this.currentContributionId();
    const activeIdentity = activeContributionId
      ? this.resolvedNavigation.contributionIdentity(activeContributionId)
      : undefined;

    try {
      const resolved = await resolveConfiguration();
      if (generation !== this.routeResolution.generation) {
        return false;
      }

      this.resolvedNavigation.replace(resolved);

      const activeStillEquivalent = !!activeContributionId
        && !!activeIdentity
        && this.resolvedNavigation.contributionIdentity(activeContributionId)
          === activeIdentity;

      await this.installCurrentRegistry({ revalidate: false });

      if (activeStillEquivalent) {
        return true;
      }

      return await this.requireEngine().revalidate();
    } catch (error) {
      this.recordNavigationError(error);
      throw error;
    }
  }

  async reload(options: RouterReloadOptions = {}): Promise<never> {
    const response = await fetch('/api/navigation/reload', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: options.reason ?? 'reset',
        target: options.target ?? this.displayUrl,
      }),
    });

    if (!response.ok) {
      throw new RouterReloadError(response.status);
    }

    const payload: unknown = await response.json();
    window.location.replace(readReloadLocation(payload));

    return new Promise<never>(() => {});
  }

  updateHistoryState(state: unknown): void {
    this.requireEngine().updateHistoryState(state);
  }

  preload(): Promise<void> {
    return this.requireEngine().preload();
  }

  dispose(): void {
    const engine = this.engine;

    this.navigationRequestId++;
    this.routeResolution.invalidate();
    this.engineStartupTask = null;
    this.notFoundRecoveryTasks.clear();
    this.engine = null;
    this.outlets.clear();

    engine?.dispose();

    this.currentState = EMPTY_ROUTER_STATE;
    this.requestTick();
  }

  private get baseHref(): string {
    return this.configuration.baseHref ?? this.appBaseHref;
  }

  private get registry(): RouteRegistry {
    return this.resolvedNavigation.registry;
  }

  private recordNavigationError(error: unknown): void {
    const state = this.engine
      ? snapshotRouterState(this.engine.state)
      : this.currentState;

    this.currentState = Object.freeze({
      ...state,
      error,
    });
    this.requestTick();
  }

  private requireEngine(): VanillaRouter {
    if (!this.engine) {
      throw new Error('Router has no active outlet.');
    }

    return this.engine;
  }

  private resolveHref(target: string | URL): string {
    return routerHref(resolveRouterUrl(target, this.baseHref, getRouterLocation(this.document), 'href'));
  }

  private generateNamedHref(
    target: NamedNavigationTarget,
  ): string | null {
    return this.namedNavigation.href(
      target,
      this.registry,
      (href) => this.resolveHref(href),
    );
  }

  private async navigateResolved(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean> {
    this.preResolvingNavigationCount++;
    try {
      const requestId = ++this.navigationRequestId;
      const resolutionGeneration = this.routeResolution.generation;
      const href = this.href(target);

      if (href === null) {
        return false;
      }

      const location = getRouterLocation(this.document);
      const url = resolveRouterUrl(href, this.baseHref, location, 'navigate');
      const key = stripBaseHref(url.pathname, this.baseHref);

      let resolved = false;

      if (url.origin === location.origin && isPathInsideBase(url.pathname, this.baseHref)) {
        this.routeResolution.abort(key);
        resolved = await this.resolveRoutesForUrl(url, { install: false });
      }

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.routeResolution.generation
      ) {
        return false;
      }

      const engine = await this.requireStartedEngine();

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.routeResolution.generation
      ) {
        return false;
      }

      if (resolved) {
        await this.installCurrentRegistry({ revalidate: false });

        if (
          requestId !== this.navigationRequestId
          || resolutionGeneration !== this.routeResolution.generation
        ) {
          return false;
        }

        this.preResolvedNavigationKeys.add(key);
      }

      try {
        return await engine.navigate(href, options);
      } finally {
        this.preResolvedNavigationKeys.delete(key);
      }
    } catch (error) {
      this.recordNavigationError(error);
      throw error;
    } finally {
      this.preResolvingNavigationCount--;
    }
  }

  private async requireStartedEngine(): Promise<VanillaRouter> {
    if (!this.engine && this.engineStartupTask) {
      await this.engineStartupTask;
    }

    return this.requireEngine();
  }

  private async resolveRoutesForUrl(
    url: URL,
    options: Readonly<{ force?: boolean; install?: boolean }> = {},
  ): Promise<boolean> {
    const key = stripBaseHref(url.pathname, this.baseHref);
    const resolved = await this.routeResolution.resolve(
      url,
      key,
      { force: options.force },
    );

    if (resolved && options.install !== false) {
      await this.installCurrentRegistry();
    }

    return resolved;
  }

  private currentContributionId(): string | undefined {
    const location = getRouterLocation(this.document);
    const path = stripBaseHref(
      location.pathname,
      this.baseHref,
    );

    return this.resolvedNavigation
      .contributionIdForPath(path);
  }

  private async installCurrentRegistry(
    options: Readonly<{ revalidate?: boolean }> = {},
  ): Promise<boolean> {
    const engine = this.engine;

    if (!engine) {
      return false;
    }

    replaceAngularRouterConfiguration(
      engine,
      this.registry,
      this.appRef,
      this.document,
      this.injector,
    );

    if (options.revalidate === false) {
      return true;
    }

    return engine.revalidate();
  }

  private scheduleNotFoundRecovery(url: URL): void {
    const key = url.href;

    if (this.notFoundRecoveryTasks.has(key)) {
      return;
    }

    let task!: Promise<void>;
    task = Promise.resolve()
      .then(async () => {
        const resolved = await this.resolveRoutesForUrl(url, { install: false });

        if (!resolved) {
          return;
        }

        await this.installCurrentRegistry();
      })
      .catch((error) => {
        this.recordNavigationError(error);
      })
      .finally(() => {
        if (this.notFoundRecoveryTasks.get(key) === task) {
          this.notFoundRecoveryTasks.delete(key);
        }
      });

    this.notFoundRecoveryTasks.set(key, task);
  }

  private startEngine(): void {
    let task!: Promise<void>;

    // Keep engine creation deferred. connect() can run while Angular is still
    // constructing the outlet tree, and the task identity must be assigned
    // before startup checks whether it is still the current attempt.
    const startup = async (): Promise<void> => {
      const location = getRouterLocation(this.document);
      const url = new URL(location.href);

      if (
        this.configuration.resolveRoutes
        && url.origin === location.origin
        && isPathInsideBase(url.pathname, this.baseHref)
      ) {
        await this.resolveRoutesForUrl(url, { install: false });
      }

      if (
        this.engineStartupTask !== task
        || this.engine
        || this.outlets.size === 0
      ) {
        return;
      }

      const engine = this.createEngine();

      try {
        engine.start();
      } catch (error) {
        engine.dispose();
        throw error;
      }

      if (this.engineStartupTask !== task) {
        engine.dispose();
        return;
      }

      this.engine = engine;
      this.currentState = snapshotRouterState(engine.state);
      this.requestTick();
    };

    const completePendingTask = this.pendingTasks.add();
    task = Promise.resolve()
      .then(startup)
      .finally(completePendingTask);
    this.engineStartupTask = task;

    void task
      .catch((error) => {
        if (this.engineStartupTask === task) {
          this.recordNavigationError(error);
          renderRouterStartupError(
            this.document,
            this.getOutlet(''),
            error,
          );
        }
      })
      .finally(() => {
        if (this.engineStartupTask === task) {
          this.engineStartupTask = null;
        }
      });
  }

  private createEngine(): VanillaRouter {
    return createAngularRouterEngine({
      registry: this.registry,
      appRef: this.appRef,
      injector: this.injector,
      document: this.document,
      baseHref: this.baseHref,
      enableTracing: this.configuration.enableTracing,
      maxRedirects: this.configuration.maxRedirects,
      onSameUrlNavigation: this.configuration.onSameUrlNavigation,
      scrollRestoration: this.configuration.scrollRestoration,
      preloading: this.configuration.preloading,
      viewTransitions: this.configuration.viewTransitions,
      getOutlet: (name) => this.getOutlet(name),
      hasOutlet: (name) => this.outlets.has(name.trim()),
      shouldRecoverNotFound: (url) => this.shouldResolveNotFoundUrl(url),
      recoverNotFound: (url) => this.scheduleNotFoundRecovery(url),
      onStateChange: (state) => {
        this.currentState = snapshotRouterState(state);
        this.requestTick();
      },
    });
  }

  private createNavigateProxy(): TypedNavigate<TRoutes> {
    return new Proxy(Object.create(null), {
      get: (_target, property) => {
        if (typeof property !== 'string' || property === 'then') {
          return undefined;
        }

        return (options: Record<string, unknown> = {}) =>
          this.navigate({
            name: property,
            ...options,
          } as NamedNavigationTarget);
      },
    }) as TypedNavigate<TRoutes>;
  }

  private createHrefProxy(): TypedHref<TRoutes> {
    return new Proxy(Object.create(null), {
      get: (_target, property) => {
        if (typeof property !== 'string' || property === 'then') {
          return undefined;
        }

        return (options: Record<string, unknown> = {}) =>
          this.href({
            name: property,
            ...options,
          } as NamedNavigationTarget);
      },
    }) as TypedHref<TRoutes>;
  }

  private getOutlet(name: string): HTMLElement | null {
    const registered = this.outlets.get(name.trim());

    return registered?.[registered.length - 1] ?? null;
  }

  private requestTick(): void {
    if (this.tickQueued) {
      return;
    }

    this.tickQueued = true;

    queueMicrotask(() => {
      this.tickQueued = false;

      if (!this.engine) {
        return;
      }

      this.appRef.tick();
    });
  }

  private shouldResolveNotFoundUrl(url: URL): boolean {
    if (this.preResolvingNavigationCount > 0) {
      return false;
    }
    if (this.preResolvedNavigationKeys.size > 0) {
      return false;
    }
    const path = stripBaseHref(url.pathname, this.baseHref);
    return this.navigationRequestId > 0
      || path !== '/'
      || url.search.length > 0
      || url.hash.length > 0;
  }
}
