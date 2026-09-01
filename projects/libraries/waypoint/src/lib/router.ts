import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  InjectionToken,
  PendingTasks,
  inject,
  runInInjectionContext,
  type Provider,
  type Type,
} from '@angular/core';

import { runWithInjector, unwrapDefault } from './adapter-utils';

import type { NamedNavigationTarget, NavigationTarget } from './navigation-targets';

import {
  type CompiledRoute,
  type CompiledRouteGroup,
  createRouteRegistry,
} from './route-compiler';

import {
  composeAngularLeafRouteView,
  composeAngularRouteView,
  type ResolvedRouteView,
} from './route-renderer';

import type {
  FramePrepareFn,
  FrameAfterEnterFn,
  FrameBeforeLeaveFn,
  MaybePromise,
  FrameView,
  LayoutDefinition,
  LayoutOptions,
  RenderableRoute,
  RedirectRouteDefinition,
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
  parseParamsRecord,
  parseQueryRecord,
  serializeParams,
  serializeQuery,
  type InferParamType,
  type ParamSchemaRecord,
  type QuerySchemaRecord,
} from './query-schema';

import {
  type CanActivateFn,
  type CanDeactivateFn,
  createRouter,
  type ActivatedRoute,
  type NavigationTransitionFn,
  type NavigationContext,
  type NavigationOptions,
  type NavigationTransitionDefinition,
  type ParseRouteParams,
  type ParseRouteQuery,
  type PrepareRouteDataFn,
  type PreloadingStrategy,
  type Route,
  type RedirectRoute as RuntimeRedirectRoute,
  type RenderableRoute as RuntimeRenderableRoute,
  type RouteRenderContext,
  type Router as VanillaRouter,
  type RouterState,
  type ScrollRestorationMode,
  type ViewTransitionsOption,
} from './vanilla-router';

export interface ResolvedNavigationConfiguration {
  readonly routes?: NavigationTree;
  readonly contributions?: readonly RouteContributionDefinition[];
  /** Opaque executable identity for each delivered contribution. */
  readonly contributionIdentities?: Readonly<Record<string, string>>;
  /** Optional full-configuration revision supplied by server delivery. */
  readonly revision?: string;
  readonly landing?: string;
}

interface RouteConfigurationResolver {
  resolveConfiguration?: () => Promise<ResolvedNavigationConfiguration>;
}

export type RouteResolution =
  | NavigationTree
  | ResolvedNavigationConfiguration
  | null
  | undefined;

function isNavigationTreeResolution(
  value: Exclude<RouteResolution, null | undefined>,
): value is NavigationTree {
  return Array.isArray(value);
}

export interface RouteResolutionContext {
  readonly signal: AbortSignal;
}

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

const lazyComponents = new WeakMap<object, Promise<Type<unknown>>>();

function loadComponent(owner: LayoutDefinition | RenderableRoute): Promise<Type<unknown>> {
  if (owner.component) {
    return Promise.resolve(owner.component);
  }

  if (!owner.loadComponent) {
    return Promise.reject(new Error('A route view must define component or loadComponent.'));
  }

  let pending = lazyComponents.get(owner);

  if (!pending) {
    pending = Promise.resolve(owner.loadComponent())
      .then((value) =>
        unwrapDefault<Type<unknown>>(value as Type<unknown> | { readonly default: Type<unknown> }),
      )
      .then((component) => {
        if (!component) {
          throw new Error('Lazy component loader returned no component.');
        }

        return component;
      })
      .catch((error) => {
        lazyComponents.delete(owner);

        throw error;
      });

    lazyComponents.set(owner, pending);
  }

  return pending;
}

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

function execute<TContext, TResult>(
  injector: EnvironmentInjector,
  handler: (context: TContext) => MaybePromise<TResult>,
  context: TContext,
): Promise<TResult> {
  return runWithInjector(injector, handler, context);
}

function adaptFrameBeforeEnter(
  handler: CanActivateFn,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) =>
    execute(injector, handler, {
      ...transition.to,
      signal: transition.signal,
    });
}

function adaptFrameBeforeLeave(
  handler: FrameBeforeLeaveFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) => {
    if (!transition.from) {
      return true;
    }

    return execute(injector, handler, {
      ...transition.from,
      nextUrl: transition.to.url,
      signal: transition.signal,
    });
  };
}

function adaptFramePrepare(
  handler: FramePrepareFn,
  injector: EnvironmentInjector,
): PrepareRouteDataFn {
  return (route) => execute(injector, handler, route);
}

function adaptFrameAfterEnter(
  handler: FrameAfterEnterFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) => execute(injector, handler, transition.to);
}

function collectEnterFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  return Object.freeze([
    ...layouts.map((layout) => layout.frame).filter((frame): frame is FrameView<any> => !!frame),
    ...(route.frame ? [route.frame] : []),
  ]);
}

function collectLeaveFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  const routeFrames = route.frame ? [route.frame] : [];
  const layoutFrames = layouts
    .map((layout) => layout.frame)
    .filter((frame): frame is FrameView<any> => !!frame)
    .reverse();

  return Object.freeze([...routeFrames, ...layoutFrames]);
}

function adaptFramePreparers(
  frames: readonly FrameView<any>[],
  injector: EnvironmentInjector,
): readonly PrepareRouteDataFn[] | undefined {
  const handlers = frames.flatMap(
    (frame) => frame.prepare?.map((handler) => adaptFramePrepare(handler, injector)) ?? [],
  );

  return handlers.length > 0 ? Object.freeze(handlers) : undefined;
}

function adaptFrameTransitions(
  groups: readonly CompiledRouteGroup[],
  injector: EnvironmentInjector,
): readonly NavigationTransitionDefinition[] {
  const transitions: NavigationTransitionDefinition[] = [];

  for (const group of groups) {
    const primaryRoute = group.primary.route;

    if (primaryRoute.kind === 'redirect') {
      continue;
    }

    const renderableRoute = primaryRoute;
    const enterFrames = collectEnterFrames(group.primary.layouts, renderableRoute);
    const leaveFrames = collectLeaveFrames(group.primary.layouts, renderableRoute);

    for (const current of enterFrames) {
      if (!current.beforeEnter?.length && !current.afterEnter?.length) {
        continue;
      }

      transitions.push({
        to: (route) => route?.config.sourceRoute === primaryRoute,
        beforeEnter: current.beforeEnter?.map((handler) =>
          adaptFrameBeforeEnter(handler, injector),
        ),
        afterEnter: current.afterEnter?.map((handler) => adaptFrameAfterEnter(handler, injector)),
      });
    }

    for (const current of leaveFrames) {
      if (!current.beforeLeave?.length) {
        continue;
      }

      transitions.push({
        from: (route) => route?.config.sourceRoute === primaryRoute,
        beforeLeave: current.beforeLeave.map((handler) => adaptFrameBeforeLeave(handler, injector)),
      });
    }
  }

  return transitions;
}

function adaptParamsParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): ParseRouteParams | undefined {
  const schema = route.paramsSchema;
  if (!schema) return undefined;

  return (params, _url, _signal) =>
    runInInjectionContext(injector, () => Promise.resolve(parseParamsRecord(schema, params)));
}

function adaptQueryParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): ParseRouteQuery | undefined {
  const schema = route.querySchema;
  if (!schema) return undefined;

  return (url, _signal) =>
    runInInjectionContext(injector, () => Promise.resolve(parseQueryRecord(schema, url)));
}

async function resolveViews(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): Promise<readonly ResolvedRouteView[]> {
  const resolvedLayouts = await Promise.all(
    layouts.map(async (layout, index) => ({
      component: await loadComponent(layout),
      providers: (layout.providers ?? []).flat().filter((p) => p),
      label: `LayoutDefinition(${layout.path || index})`,
    })),
  );

  const page = await loadComponent(route);

  return Object.freeze([
    ...resolvedLayouts,
    {
      component: page,
      providers: (route.providers ?? []).flat().filter((p) => p),
      label: `RouteDefinition(${route.path})`,
    },
  ]);
}

function adaptRoute(
  route: RedirectRouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): RuntimeRedirectRoute;
function adaptRoute(
  route: RenderableRoute,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): RuntimeRenderableRoute;
function adaptRoute(
  route: RouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route;
function adaptRoute(
  route: RouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route {
  if (route.kind === 'redirect') {
    if (!redirectTo) {
      throw new Error(`Compiled redirect route "${path}" has no redirect target.`);
    }

    const runtimeRedirect: RuntimeRedirectRoute = {
      kind: 'redirect',
      name: route.name,
      path,
      sourceRoute: route,
      redirectTo,
      data: route.data ? { ...route.data } : undefined,
    };

    return runtimeRedirect;
  }

  const tokens = {
    routeToken: ROUTE,
    contextToken: ROUTE_CONTEXT,
  } as const;

  const runtimeRoute: RuntimeRenderableRoute = {
    kind: 'route',
    name: route.name,
    path,
    outlet: route.outlet,
    sourceRoute: route,
    data: route.data ? { ...route.data } : undefined,
    preload: route.preload,
    viewTransition: route.viewTransition,

    load: async () => {
      const views = await resolveViews(layouts, route);

      return {
        component: route.outlet
          ? composeAngularLeafRouteView(appRef, documentRef, injector, tokens, views)
          : composeAngularRouteView(appRef, documentRef, injector, tokens, views),
        prepare: [
          ...(sharedPreparers ?? []),
          ...(adaptFramePreparers(
            route.frame ? [route.frame] : [],
            injector,
          ) ?? []),
        ],
        parseParams: adaptParamsParser(route, injector),
        parseQuery: adaptQueryParser(route, injector),
      };
    },
  };

  return runtimeRoute;
}

function adaptRoutes(
  groups: readonly CompiledRouteGroup[],
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route[] {
  return groups.map((group): Route => {
    const sharedPreparers = adaptFramePreparers(
      group.primary.layouts
        .map(layout => layout.frame)
        .filter((frame): frame is FrameView<any> => !!frame),
      injector,
    );

    const authoredPrimary =
      group.primary.route;

    if (authoredPrimary.kind === 'redirect') {
      return adaptRoute(
        authoredPrimary,
        group.primary.path,
        group.primary.redirectTo,
        group.primary.layouts,
        sharedPreparers,
        appRef,
        documentRef,
        injector,
      );
    }

    const primary = adaptRoute(
      authoredPrimary,
      group.primary.path,
      group.primary.redirectTo,
      group.primary.layouts,
      sharedPreparers,
      appRef,
      documentRef,
      injector,
    );

    const outlets = group.outlets.map(
      (compiled): RuntimeRenderableRoute =>
        adaptRoute(
          compiled.route as RenderableRoute,
          group.primary.path,
          compiled.redirectTo,
          group.primary.layouts,
          sharedPreparers,
          appRef,
          documentRef,
          injector,
        ),
    );

    return outlets.length === 0
      ? primary
      : {
          ...primary,
          outlets: Object.freeze(outlets),
        };
  });
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
  private registry: ReturnType<typeof createRouteRegistry>;
  private readonly namedRouteCatalog = new Map<string, NamedRouteDefinition>();
  private readonly resolvingRouteKeys = new Map<string, Promise<boolean>>();
  private readonly resolvingRouteControllers = new Map<string, AbortController>();
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private readonly unresolvedRouteKeys = new Set<string>();
  private resolvedRoutes: NavigationTree = Object.freeze([]);
  private readonly resolvedContributionsById = new Map<string, RouteContributionDefinition>();
  private readonly resolvedContributionIdentitiesById = new Map<string, string>();
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

    this.registry = createRouteRegistry(
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
    this.resolvedRoutes = Object.freeze([]);
    this.resolvedContributionsById.clear();
    this.resolvedContributionIdentitiesById.clear();
    this.unresolvedRouteKeys.clear();
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.rebuildResolvedRegistry();

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
      ? this.resolvedContributionIdentitiesById.get(activeContributionId)
      : undefined;

    try {
      const resolved = await resolveConfiguration();
      if (generation !== this.resolutionGeneration) {
        return false;
      }

      this.replaceResolvedNavigation(resolved);

      const activeStillEquivalent = !!activeContributionId
        && !!activeIdentity
        && this.resolvedContributionIdentitiesById.get(activeContributionId)
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

    return this.registry.groups.some((group) => matchesCompiledPath(group.primary.path, path));
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

        if (!resolved || !this.mergeResolvedNavigation(resolved)) {
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

  private mergeResolvedNavigation(resolved: Exclude<RouteResolution, null | undefined>): boolean {
    const routes = isNavigationTreeResolution(resolved)
      ? resolved
      : resolved.routes ?? Object.freeze([]);
    const incomingContributions = isNavigationTreeResolution(resolved)
      ? Object.freeze([] as RouteContributionDefinition[])
      : resolved.contributions ?? Object.freeze([]);
    const incomingIdentities = isNavigationTreeResolution(resolved)
      ? undefined
      : resolved.contributionIdentities;

    if (routes.length === 0 && incomingContributions.length === 0) {
      return false;
    }

    const nextRoutes = routes.length > 0
      ? Object.freeze([
          ...this.resolvedRoutes,
          ...routes,
        ]) as NavigationTree
      : this.resolvedRoutes;
    const nextContributions = new Map(this.resolvedContributionsById);
    const authoredContributionIds = new Set(
      (this.configuration.contributions ?? []).map(contribution => contribution.id),
    );

    for (const contribution of incomingContributions) {
      if (authoredContributionIds.has(contribution.id)) {
        throw new Error(
          `Resolved route contribution "${contribution.id}" conflicts with an authored contribution.`,
        );
      }
      nextContributions.set(contribution.id, contribution);
    }

    // Build and validate the complete candidate registry before mutating any
    // resolved state. Malformed or conflicting artifacts therefore cannot leave
    // a half-installed dynamic configuration behind.
    const nextRegistry = this.createResolvedRegistry(
      nextRoutes,
      nextContributions,
    );

    this.resolvedRoutes = nextRoutes;
    this.resolvedContributionsById.clear();
    for (const [id, contribution] of nextContributions) {
      this.resolvedContributionsById.set(id, contribution);
    }
    if (incomingIdentities) {
      for (const contribution of incomingContributions) {
        const identity = incomingIdentities[contribution.id];
        if (identity) {
          this.resolvedContributionIdentitiesById.set(
            contribution.id,
            identity,
          );
        }
      }
    }
    this.registry = nextRegistry;
    return true;
  }

  private replaceResolvedNavigation(
    resolved: ResolvedNavigationConfiguration,
  ): void {
    const routes = resolved.routes ?? Object.freeze([]);
    const identities = resolved.contributionIdentities ?? {};
    const nextContributions = new Map<string, RouteContributionDefinition>();
    const nextIdentities = new Map<string, string>();
    const authoredContributionIds = new Set(
      (this.configuration.contributions ?? []).map(contribution => contribution.id),
    );

    for (const incoming of resolved.contributions ?? []) {
      if (authoredContributionIds.has(incoming.id)) {
        throw new Error(
          `Resolved route contribution "${incoming.id}" conflicts with an authored contribution.`,
        );
      }

      const identity = identities[incoming.id];
      const previousIdentity =
        this.resolvedContributionIdentitiesById.get(incoming.id);
      const previous = this.resolvedContributionsById.get(incoming.id);

      nextContributions.set(
        incoming.id,
        identity && previous && previousIdentity === identity
          ? previous
          : incoming,
      );

      if (identity) {
        nextIdentities.set(incoming.id, identity);
      }
    }

    const nextRegistry = this.createResolvedRegistry(
      routes,
      nextContributions,
    );

    this.resolvedRoutes = routes;
    this.resolvedContributionsById.clear();
    for (const [id, contribution] of nextContributions) {
      this.resolvedContributionsById.set(id, contribution);
    }
    this.resolvedContributionIdentitiesById.clear();
    for (const [id, identity] of nextIdentities) {
      this.resolvedContributionIdentitiesById.set(id, identity);
    }
    this.registry = nextRegistry;
  }

  private currentContributionId(): string | undefined {
    const location = getRouterLocation(this.document);
    const path = stripBaseHref(location.pathname, this.baseHref);
    return this.registry.groups.find(group =>
      matchesCompiledPath(group.primary.path, path),
    )?.primary.contributionId;
  }

  private rebuildResolvedRegistry(): void {
    this.registry = this.createResolvedRegistry(
      this.resolvedRoutes,
      this.resolvedContributionsById,
    );
  }

  private createResolvedRegistry(
    resolvedRoutes: NavigationTree,
    resolvedContributions: ReadonlyMap<string, RouteContributionDefinition>,
  ): ReturnType<typeof createRouteRegistry> {
    const routes = Object.freeze([
      ...this.configuration.routes,
      ...resolvedRoutes,
    ]) as TRoutes;
    const contributionsById = new Map(
      (this.configuration.contributions ?? []).map(contribution => [
        contribution.id,
        contribution,
      ] as const),
    );

    for (const [id, contribution] of resolvedContributions) {
      contributionsById.set(id, contribution);
    }

    return createRouteRegistry(
      routes,
      Object.freeze([...contributionsById.values()]),
    );
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

function matchesCompiledPath(pattern: string, pathname: string): boolean {
  const regex = new RegExp(
    `^${pattern
      .split('/')
      .map((segment) => {
        if (!segment) {
          return '';
        }

        return segment.startsWith(':') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/')}$`,
  );

  return regex.test(pathname);
}

export function provideRouter<const TRoutes extends NavigationTree>(
  routes: TRoutes,
  options: RouterOptions = {},
): Provider[] {
  const config: RouterConfiguration<TRoutes> = {
    ...options,
    routes,
  };

  return [
    {
      provide: ROUTER_CONFIGURATION,
      useValue: config,
    },
    {
      provide: ServerRouter,
      useFactory: (configuration: RouterConfiguration<TRoutes>) =>
        new ServerRouter<TRoutes>(configuration),
      deps: [ROUTER_CONFIGURATION],
    },
    {
      provide: RouterContract,
      useExisting: ServerRouter,
    },
  ];
}

export const provideServerRouter = provideRouter;

export { type LayoutOptions, type RouteOptions };

export { layout, lazyLayout, lazyRoute, redirectRoute, route } from './route-builders';
