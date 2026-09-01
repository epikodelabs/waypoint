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
  adaptFrameTransitions,
  adaptRoutes,
} from './angular-route-adapter';

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

type CompiledRoute =
  RouteRegistry['groups'][number]['primary'];

interface RouteConfigurationResolver {
  resolveConfiguration?: () =>
    Promise<ResolvedNavigationConfiguration>;
}

import type {
  LayoutOptions,
  RenderableRoute,
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

import { OUTLET_ACTIVATE_EVENT, dispatchOutletLifecycleEvent } from './router-events';

import { getRouterLocation, isPathInsideBase, resolveRouterUrl, routerHref, stripBaseHref } from './router-url';

import {
  serializeParams,
  serializeQuery,
  type InferParamType,
  type ParamSchemaRecord,
  type QuerySchemaRecord,
} from './query-schema';

import {
  type CanDeactivateFn,
  createRouter,
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

export interface NamedRouteDefinition {
  readonly name: string;
  readonly path: string;
  readonly paramsSchema?: ParamSchemaRecord;
  readonly querySchema?: QuerySchemaRecord;
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

function replaceChildNodes(
  target: Node & {
    replaceChildren?: (...nodes: Node[]) => void;
    firstChild: ChildNode | null;
    removeChild(node: ChildNode): void;
    appendChild<T extends Node>(node: T): T;
  },
  ...nodes: Node[]
): void {
  if (typeof target.replaceChildren === 'function') {
    target.replaceChildren(...nodes);
    return;
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  for (const node of nodes) {
    target.appendChild(node);
  }
}

function interpolateNamedPath(
  template: string,
  params: Readonly<Record<string, unknown>>,
  schema: ParamSchemaRecord | undefined,
): string | null {
  const serialized = schema
    ? serializeParams(schema, params as unknown as InferParamType<ParamSchemaRecord>)
    : Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)]),
      );

  const missing = new Set<string>();

  const path = template.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, key: string) => {
    const value = serialized[key];

    if (value === undefined) {
      missing.add(key);
      return `:${key}`;
    }

    return encodeURIComponent(value);
  });

  if (missing.size > 0) {
    return null;
  }

  return path;
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
  private readonly namedRouteCatalog =
    new Map<string, NamedRouteDefinition>();
  private readonly resolvingRouteKeys = new Map<string, Promise<boolean>>();
  private readonly resolvingRouteControllers = new Map<string, AbortController>();
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private readonly unresolvedRouteKeys = new Set<string>();
  private resolutionGeneration = 0;
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
    for (const route of this.configuration.namedRoutes ?? []) {
      this.namedRouteCatalog.set(route.name, route);
    }
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
    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.resolvedNavigation.reset();
    this.unresolvedRouteKeys.clear();
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();

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
    const generation = ++this.resolutionGeneration;
    this.navigationRequestId++;
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.unresolvedRouteKeys.clear();

    const activeContributionId = this.currentContributionId();
    const activeIdentity = activeContributionId
      ? this.resolvedNavigation.contributionIdentity(activeContributionId)
      : undefined;

    try {
      const resolved = await resolveConfiguration();
      if (generation !== this.resolutionGeneration) {
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

    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
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

  private generateNamedHref(target: NamedNavigationTarget): string | null {
    const record = this.readNamedRouteRecord(target.name);

    if (!record) {
      return null;
    }

    if ('kind' in record.route && record.route.kind === 'redirect') {
      return null;
    }

    const path = interpolateNamedPath(
      record.path,
      target.params ?? {},
      record.route.paramsSchema,
    );

    if (!path) {
      return null;
    }

    const query =
      record.route.querySchema && target.query
        ? serializeQuery(record.route.querySchema, target.query)
        : '';

    return this.resolveHref(`${path}${query}`);
  }

  private async navigateResolved(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean> {
    this.preResolvingNavigationCount++;
    try {
      const requestId = ++this.navigationRequestId;
      const resolutionGeneration = this.resolutionGeneration;
      const href = this.href(target);

      if (href === null) {
        return false;
      }

      const location = getRouterLocation(this.document);
      const url = resolveRouterUrl(href, this.baseHref, location, 'navigate');
      const key = stripBaseHref(url.pathname, this.baseHref);

      let resolved = false;

      if (url.origin === location.origin && isPathInsideBase(url.pathname, this.baseHref)) {
        this.abortResolvedRouteRequests(key);
        resolved = await this.resolveRoutesForUrl(url, { install: false });
      }

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.resolutionGeneration
      ) {
        return false;
      }

      const engine = await this.requireStartedEngine();

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.resolutionGeneration
      ) {
        return false;
      }

      if (resolved) {
        await this.installCurrentRegistry({ revalidate: false });

        if (
          requestId !== this.navigationRequestId
          || resolutionGeneration !== this.resolutionGeneration
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

  private readNamedRouteRecord(name: string):
    | CompiledRoute
    | {
        readonly route: Pick<RenderableRoute, 'paramsSchema' | 'querySchema'>;
        readonly path: string;
      }
    | undefined {
    const existing = this.registry.namedRoutes.get(name);

    if (existing) {
      return existing;
    }

    const deferred = this.namedRouteCatalog.get(name);

    if (!deferred) {
      return undefined;
    }

    return {
      path: deferred.path,
      route: {
        paramsSchema: deferred.paramsSchema,
        querySchema: deferred.querySchema,
      },
    };
  }

  private matchesRegisteredRoute(url: URL): boolean {
    const path = stripBaseHref(url.pathname, this.baseHref);

    return this.resolvedNavigation.matchesPath(path);
  }

  private async resolveRoutesForUrl(
    url: URL,
    options: Readonly<{ force?: boolean; install?: boolean }> = {},
  ): Promise<boolean> {
    if (!this.configuration.resolveRoutes) {
      return false;
    }

    if (!options.force && this.matchesRegisteredRoute(url)) {
      return false;
    }

    const key = stripBaseHref(url.pathname, this.baseHref);

    if (!options.force && this.unresolvedRouteKeys.has(key)) {
      return false;
    }

    const pending = this.resolvingRouteKeys.get(key);

    if (pending && !options.force) {
      return pending;
    }

    if (options.force) {
      this.resolvingRouteControllers.get(key)?.abort();
    }

    const controller = new AbortController();
    this.resolvingRouteControllers.set(key, controller);
    const generation = this.resolutionGeneration;
    let resolution!: Promise<boolean>;
    resolution = Promise.resolve(this.configuration.resolveRoutes(url, {
      signal: controller.signal,
    }))
      .then(async (resolved) => {
        if (
          controller.signal.aborted
          || generation !== this.resolutionGeneration
        ) {
          return false;
        }

        if (!resolved || !this.resolvedNavigation.merge(resolved)) {
          this.unresolvedRouteKeys.add(key);
          return false;
        }

        this.unresolvedRouteKeys.delete(key);
        if (options.install !== false) {
          await this.installCurrentRegistry();
        }
        return true;
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        // A transport/import failure is not evidence that the route does not
        // exist. Do not poison the negative-resolution cache; a later
        // navigation should be allowed to retry without an authorization reset.
        throw error;
      })
      .finally(() => {
        if (this.resolvingRouteKeys.get(key) === resolution) {
          this.resolvingRouteKeys.delete(key);
        }
        if (this.resolvingRouteControllers.get(key) === controller) {
          this.resolvingRouteControllers.delete(key);
        }
      });

    this.resolvingRouteKeys.set(key, resolution);

    return resolution;
  }


  private abortResolvedRouteRequests(exceptKey?: string): void {
    for (const [key, controller] of this.resolvingRouteControllers) {
      if (key === exceptKey) continue;
      controller.abort();
      this.resolvingRouteControllers.delete(key);
    }
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

    engine.replaceConfiguration({
      routes: adaptRoutes(
        this.registry.groups,
        this.appRef,
        this.document,
        this.injector,
      ),
      transitions: adaptFrameTransitions(
        this.registry.groups,
        this.injector,
      ),
    });

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
          this.renderStartupError(error);
        }
      })
      .finally(() => {
        if (this.engineStartupTask === task) {
          this.engineStartupTask = null;
        }
      });
  }

  private renderStartupError(error: unknown): void {
    console.error('Waypoint router startup failed.', error);

    const target = this.getOutlet('');
    if (!target) {
      return;
    }

    const container = this.document.createElement('section');
    container.setAttribute('data-waypoint-startup-error', '');

    const heading = this.document.createElement('h1');
    heading.textContent = 'Page failed to load';

    const details = this.document.createElement('pre');
    details.textContent =
      error instanceof Error
        ? error.message
        : String(error);

    container.append(heading, details);
    replaceChildNodes(target, container);
  }

  private createEngine(): VanillaRouter {
    return createRouter({
      routes: adaptRoutes(this.registry.groups, this.appRef, this.document, this.injector),

      baseHref: this.baseHref,

      enableTracing: this.configuration.enableTracing,

      maxRedirects: this.configuration.maxRedirects,

      onSameUrlNavigation: this.configuration.onSameUrlNavigation,

      scrollRestoration: this.configuration.scrollRestoration,

      preloading: this.configuration.preloading,

      transitions: [...adaptFrameTransitions(this.registry.groups, this.injector)],

      viewTransitions: this.configuration.viewTransitions,

      render: (targetName, node) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          throw new Error(`Router outlet "${targetName}" is not connected.`);
        }

        replaceChildNodes(target, node);
      },

      commit: (outlets) => {
        for (const outlet of outlets) {
          if (!this.outlets.has(outlet.name)) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }
        }

        for (const outlet of outlets) {
          const target = this.getOutlet(outlet.name);

          if (!target) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }

          replaceChildNodes(target, outlet.node);
          dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, outlet.component);
        }
      },

      renderNotFound: (targetName, url, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = '404 — Page Not Found';

        replaceChildNodes(target, heading);

        if (this.shouldResolveNotFoundUrl(url)) {
          this.scheduleNotFoundRecovery(url);
        }
      },

      renderError: (targetName, _error, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = 'Page failed to load';

        replaceChildNodes(target, heading);
      },

      onStateChange: (state) => {
        this.currentState = snapshotRouterState(state);
        this.requestTick();
      },

      onOutletActivate: (target, component) => {
        dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, component);
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
