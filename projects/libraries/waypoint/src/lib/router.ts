import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  InjectionToken,
  inject,
  runInInjectionContext,
  type Provider,
  type Type,
} from '@angular/core';

import { runWithInjector, unwrapDefault } from './adapter-utils';

import type { NamedNavigationTarget, NavigationTarget } from './navigation-targets';

import {
  CompiledRoute,
  CompiledRouteGroup,
  createRouteRegistry,
  type RouteRegistryRecord,
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
import type { RouteRuntime } from './route-runtime';

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

  /**
   * Optional stable identity for server-delivered contributions.
   * Native Waypoint delivery uses `artifactKey + hash`.
   */
  readonly contributionIdentities?: Readonly<Record<string, string>>;

  /** Complete server-authorized configuration identity. */
  readonly revision?: string;

  readonly landing?: string;
}

export type RouteResolution =
  | NavigationTree
  | ResolvedNavigationConfiguration
  | null
  | undefined;

export interface RouteResolutionResolver {
  (
    url: URL,
    context: RouteResolutionContext,
  ): Promise<RouteResolution>;

  readonly resolveConfiguration?: (
    context: RouteResolutionContext,
  ) => Promise<RouteResolution>;
}

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
  readonly resolveRoutes?: RouteResolutionResolver;
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
    || (payload as { version?: unknown }).version !== 1
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
  cache?: AdaptedTransitionCache,
): readonly NavigationTransitionDefinition[] {
  const transitions:
    NavigationTransitionDefinition[] = [];

  const resolveTransition = (
    primaryRoute: RenderableRoute,
    frame: FrameView<any>,
    phase: 'enter' | 'leave',
    factory: () =>
      NavigationTransitionDefinition,
  ): NavigationTransitionDefinition => {
    const entries =
      cache?.get(frame) ?? [];

    const existing =
      entries.find(
        entry =>
          entry.primaryRoute
            === primaryRoute
          && entry.phase === phase,
      );

    if (existing) {
      return existing.transition;
    }

    const transition = factory();

    if (cache) {
      entries.push(
        Object.freeze({
          primaryRoute,
          frame,
          phase,
          transition,
        }),
      );

      cache.set(frame, entries);
    }

    return transition;
  };

  for (const group of groups) {
    const primaryRoute =
      group.primary.route;

    if (
      primaryRoute.kind
      === 'redirect'
    ) {
      continue;
    }

    const renderableRoute =
      primaryRoute;

    const enterFrames =
      collectEnterFrames(
        group.layouts,
        renderableRoute,
      );

    const leaveFrames =
      collectLeaveFrames(
        group.layouts,
        renderableRoute,
      );

    for (
      const current
      of enterFrames
    ) {
      if (
        !current.beforeEnter?.length
        && !current.afterEnter?.length
      ) {
        continue;
      }

      transitions.push(
        resolveTransition(
          renderableRoute,
          current,
          'enter',
          () => ({
            to:
              route =>
                route?.config
                  .sourceRoute
                === primaryRoute,
            beforeEnter:
              current.beforeEnter?.map(
                handler =>
                  adaptFrameBeforeEnter(
                    handler,
                    injector,
                  ),
              ),
            afterEnter:
              current.afterEnter?.map(
                handler =>
                  adaptFrameAfterEnter(
                    handler,
                    injector,
                  ),
              ),
          }),
        ),
      );
    }

    for (
      const current
      of leaveFrames
    ) {
      if (
        !current.beforeLeave?.length
      ) {
        continue;
      }

      transitions.push(
        resolveTransition(
          renderableRoute,
          current,
          'leave',
          () => ({
            from:
              route =>
                route?.config
                  .sourceRoute
                === primaryRoute,
            beforeLeave:
              current.beforeLeave.map(
                handler =>
                  adaptFrameBeforeLeave(
                    handler,
                    injector,
                  ),
              ),
          }),
        ),
      );
    }
  }

  return transitions;
}

function adaptParamsParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): RouteRuntime['parseParams'] {
  const schema = route.paramsSchema;
  if (!schema) return undefined;

  return (params, _url, _signal) =>
    runInInjectionContext(injector, () => Promise.resolve(parseParamsRecord(schema, params)));
}

function adaptQueryParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): RouteRuntime['parseQuery'] {
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


interface AdaptedRouteCacheEntry {
  readonly path: string;
  readonly redirectTo?: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly outletRoutes: readonly RouteDefinition[];
  readonly outletRedirects: readonly (string | undefined)[];
  readonly runtime: Route;
}

type AdaptedRouteCache =
  WeakMap<
    RouteDefinition,
    AdaptedRouteCacheEntry[]
  >;


interface AdaptedTransitionCacheEntry {
  readonly primaryRoute: RenderableRoute;
  readonly frame: FrameView<any>;
  readonly phase: 'enter' | 'leave';
  readonly transition: NavigationTransitionDefinition;
}

type AdaptedTransitionCache =
  WeakMap<
    FrameView<any>,
    AdaptedTransitionCacheEntry[]
  >;

function sameReferences<T>(
  left: readonly T[],
  right: readonly T[],
): boolean {
  return left.length === right.length
    && left.every(
      (value, index) =>
        value === right[index],
    );
}

function mapsHaveSameReferences<T>(
  left: ReadonlyMap<string, T>,
  right: ReadonlyMap<string, T>,
): boolean {
  if (left.size !== right.size) {
    return false;
  }

  for (const [key, value] of left) {
    if (right.get(key) !== value) {
      return false;
    }
  }

  return true;
}

function mapsHaveSameValues(
  left: ReadonlyMap<string, string>,
  right: ReadonlyMap<string, string>,
): boolean {
  if (left.size !== right.size) {
    return false;
  }

  for (const [key, value] of left) {
    if (right.get(key) !== value) {
      return false;
    }
  }

  return true;
}

function findAdaptedRoute(
  group: CompiledRouteGroup,
  cache: AdaptedRouteCache | undefined,
): Route | undefined {
  const authoredPrimary =
    group.primary.route;

  const entries =
    cache?.get(authoredPrimary);

  if (!entries) {
    return undefined;
  }

  const outletRoutes =
    group.outlets.map(
      outlet => outlet.route,
    );

  const outletRedirects =
    group.outlets.map(
      outlet => outlet.redirectTo,
    );

  return entries.find(
    entry =>
      entry.path === group.path
      && entry.redirectTo
        === group.primary.redirectTo
      && sameReferences(
        entry.layouts,
        group.layouts,
      )
      && sameReferences(
        entry.outletRoutes,
        outletRoutes,
      )
      && sameReferences(
        entry.outletRedirects,
        outletRedirects,
      ),
  )?.runtime;
}

function rememberAdaptedRoute(
  group: CompiledRouteGroup,
  runtime: Route,
  cache: AdaptedRouteCache | undefined,
): Route {
  if (!cache) {
    return runtime;
  }

  const authoredPrimary =
    group.primary.route;

  const entries =
    cache.get(authoredPrimary)
    ?? [];

  entries.push(
    Object.freeze({
      path: group.path,
      redirectTo:
        group.primary.redirectTo,
      layouts:
        Object.freeze([
          ...group.layouts,
        ]),
      outletRoutes:
        Object.freeze(
          group.outlets.map(
            outlet => outlet.route,
          ),
        ),
      outletRedirects:
        Object.freeze(
          group.outlets.map(
            outlet => outlet.redirectTo,
          ),
        ),
      runtime,
    }),
  );

  cache.set(
    authoredPrimary,
    entries,
  );

  return runtime;
}

function adaptRoutes(
  groups: readonly CompiledRouteGroup[],
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
  cache?: AdaptedRouteCache,
): Route[] {
  return groups.map((group): Route => {
    const cached =
      findAdaptedRoute(
        group,
        cache,
      );

    if (cached) {
      return cached;
    }
    const sharedPreparers = adaptFramePreparers(
      group.layouts
        .map(layout => layout.frame)
        .filter((frame): frame is FrameView<any> => !!frame),
      injector,
    );

    const authoredPrimary =
      group.primary.route;

    if (authoredPrimary.kind === 'redirect') {
      if (group.outlets.length > 0) {
        throw new Error(
          `A redirect route cannot have named outlets. Path: "${group.path}"`,
        );
      }

      return rememberAdaptedRoute(
        group,
        adaptRoute(
          authoredPrimary,
          group.path,
          group.primary.redirectTo,
          group.layouts,
          sharedPreparers,
          appRef,
          documentRef,
          injector,
        ),
        cache,
      );
    }

    const primary = adaptRoute(
      authoredPrimary,
      group.path,
      group.primary.redirectTo,
      group.layouts,
      sharedPreparers,
      appRef,
      documentRef,
      injector,
    );

    const outlets = group.outlets.map(
      (compiled): RuntimeRenderableRoute => {
        const authoredOutlet =
          compiled.route;

        if (authoredOutlet.kind === 'redirect') {
          throw new Error(
            `Named outlet routes cannot be redirects. Path: "${group.path}"`,
          );
        }

        return adaptRoute(
          authoredOutlet,
          group.path,
          compiled.redirectTo,
          group.layouts,
          sharedPreparers,
          appRef,
          documentRef,
          injector,
        );
      },
    );

    const runtime =
      outlets.length === 0
        ? primary
        : {
            ...primary,
            outlets:
              Object.freeze(outlets),
          };

    return rememberAdaptedRoute(
      group,
      runtime,
      cache,
    );
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
  private readonly appBaseHref: string;
  private registry: ReturnType<typeof createRouteRegistry>;
  private readonly namedRouteCatalog = new Map<string, NamedRouteDefinition>();
  private readonly resolvingRouteKeys = new Map<string, Promise<boolean>>();
  private readonly resolvingRouteControllers = new Map<string, AbortController>();
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private readonly unresolvedRouteKeys = new Set<string>();
  private resolvedRoutes: NavigationTree = Object.freeze([]);
  private readonly resolvedContributionsById =
    new Map<string, RouteContributionDefinition>();
  private readonly resolvedContributionIdentityById =
    new Map<string, string>();
  private readonly adaptedRouteCache:
    AdaptedRouteCache =
      new WeakMap();
  private readonly adaptedTransitionCache:
    AdaptedTransitionCache =
      new WeakMap();
  private resolvedConfigurationRevision:
    string | undefined;
  private configurationResolutionController: AbortController | null = null;
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
    return;

    const engine = createRouter({
      routes: adaptRoutes(
        this.registry.groups,
        this.appRef,
        this.document,
        this.injector,
        this.adaptedRouteCache,
      ),

      baseHref: this.baseHref,

      enableTracing: this.configuration.enableTracing,

      maxRedirects: this.configuration.maxRedirects,

      onSameUrlNavigation: this.configuration.onSameUrlNavigation,

      scrollRestoration: this.configuration.scrollRestoration,

      preloading: this.configuration.preloading,

      transitions: [...adaptFrameTransitions(
        this.registry.groups,
        this.injector,
        this.adaptedTransitionCache,
      )],

      viewTransitions: this.configuration.viewTransitions,

      render: (targetName, node) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          throw new Error(`Router outlet "${targetName}" is not connected.`);
        }

        replaceChildNodes(target, node);
      },

      commit: (outlets) => {
        // First phase: validate all outlets exist before any DOM mutation.
        for (const outlet of outlets) {
          if (!this.outlets.has(outlet.name)) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }
        }

        // Second phase: perform synchronous DOM mutations.
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

    try {
      engine.start();
    } catch (error) {
      this.outlets.delete(outletName);
      engine.dispose();
      throw error;
    }

    this.engine = engine;

    this.currentState = snapshotRouterState(engine.state);
    this.requestTick();
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

  async revalidate(
    options: RouterRevalidationOptions = {},
  ): Promise<boolean> {
    const resolveConfiguration =
      this.configuration.resolveRoutes
        ?.resolveConfiguration;

    /*
     * Compatibility path for pre-configuration-resolver integrations.
     *
     * Existing callers that explicitly requested resetResolvedRoutes must keep
     * the old fail-closed behavior until they migrate to the new full
     * configuration endpoint.
     */
    if (
      !resolveConfiguration
      && options.resetResolvedRoutes
    ) {
      return this.revalidateLegacyResolvedRoutes();
    }

    if (!resolveConfiguration) {
      try {
        return await this.requireEngine()
          .revalidate();
      } catch (error) {
        this.recordNavigationError(error);
        throw error;
      }
    }

    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.unresolvedRouteKeys.clear();
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.configurationResolutionController
      ?.abort();

    const controller =
      new AbortController();

    this.configurationResolutionController =
      controller;

    const generation =
      this.resolutionGeneration;

    try {
      const resolved =
        await resolveConfiguration({
          signal: controller.signal,
        });

      if (
        controller.signal.aborted
        || generation
          !== this.resolutionGeneration
      ) {
        return false;
      }

      if (
        resolved
        && !Array.isArray(resolved)
        && resolved.revision
        && resolved.revision
          === this.resolvedConfigurationRevision
      ) {
        return true;
      }

      const changed =
        this.replaceResolvedNavigation(
          resolved,
        );

      if (
        resolved
        && !Array.isArray(resolved)
      ) {
        this.resolvedConfigurationRevision =
          resolved.revision;
      }

      if (!changed) {
        /*
         * Strong no-op guarantee:
         * same authorized artifact identities means the active component,
         * layouts, providers, prepared data, scroll and history are untouched.
         */
        return true;
      }

      const rematched =
        await this.installCurrentRegistry();

      if (rematched) {
        return true;
      }

      const landing =
        resolved
        && !Array.isArray(resolved)
          ? resolved.landing
          : undefined;

      if (!landing) {
        return false;
      }

      return await this.navigateResolved(
        landing,
        {
          replace: true,
        },
      );
    } catch (error) {
      /*
       * An explicit authorization refresh fails closed. The fetch itself is
       * allowed to complete before mutation so an unchanged successful refresh
       * can be observationally invisible, but a failed refresh must not leave
       * previously delivered protected navigation active.
       */
      this.clearResolvedNavigation();

      try {
        await this.installCurrentRegistry();
      } catch {
        // Preserve the original actionable error.
      }

      this.recordNavigationError(error);
      throw error;
    } finally {
      if (
        this.configurationResolutionController
          === controller
      ) {
        this.configurationResolutionController =
          null;
      }
    }
  }

  private async revalidateLegacyResolvedRoutes(): Promise<boolean> {
    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.resolvedRoutes =
      Object.freeze([]);
    this.resolvedContributionsById.clear();
    this.resolvedContributionIdentityById.clear();
    this.resolvedConfigurationRevision =
      undefined;
    this.unresolvedRouteKeys.clear();
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.rebuildResolvedRegistry();

    const location =
      getRouterLocation(this.document);

    const url =
      resolveRouterUrl(
        `${location.pathname}${location.search}${location.hash}`,
        this.baseHref,
        location,
        'navigate',
      );

    try {
      if (
        this.configuration.resolveRoutes
        && url.origin === location.origin
        && isPathInsideBase(
          url.pathname,
          this.baseHref,
        )
      ) {
        await this.resolveRoutesForUrl(
          url,
          {
            force: true,
            install: false,
          },
        );
      }

      /*
       * The engine may not exist yet when revalidation races initial
       * server-resolution startup. The registry revocation/re-resolution above
       * is still valid; there is simply no active view to rematch.
       */
      if (!this.engine) {
        return false;
      }

      return await this.installCurrentRegistry();
    } catch (error) {
      try {
        if (this.engine) {
          await this.installCurrentRegistry();
        }
      } catch {
        // Preserve original authorization/resolution failure.
      }

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
    this.configurationResolutionController?.abort();
    this.configurationResolutionController = null;
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
      record.fullPath,
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

      if (url.origin === location.origin && isPathInsideBase(url.pathname, this.baseHref)) {
        this.abortResolvedRouteRequests(key);
        const resolved = await this.resolveRoutesForUrl(url, { install: false });
        if (resolved) {
          await this.installCurrentRegistry({ revalidate: false });
          this.preResolvedNavigationKeys.add(key);
        }
      }

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.resolutionGeneration
      ) {
        return false;
      }

      try {
        return await this.requireEngine().navigate(href, options);
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

  private readNamedRouteRecord(name: string):
    | RouteRegistryRecord
    | {
        readonly route: Pick<RenderableRoute, 'paramsSchema' | 'querySchema'>;
        readonly fullPath: string;
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
      fullPath: deferred.path,
      route: {
        paramsSchema: deferred.paramsSchema,
        querySchema: deferred.querySchema,
      },
    };
  }

  private matchesRegisteredRoute(url: URL): boolean {
    const path = stripBaseHref(url.pathname, this.baseHref);

    return this.registry.groups.some((group) => matchesCompiledPath(group.path, path));
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
        if (generation !== this.resolutionGeneration) {
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

  private clearResolvedNavigation(): void {
    this.resolvedRoutes =
      Object.freeze([]);

    this.resolvedContributionsById.clear();
    this.resolvedContributionIdentityById
      .clear();

    this.resolvedConfigurationRevision =
      undefined;

    this.rebuildResolvedRegistry();
  }

  private replaceResolvedNavigation(
    resolved: RouteResolution,
  ): boolean {
    const routes =
      !resolved
        ? Object.freeze(
            [] as RouteDefinition[],
          )
        : isNavigationTreeResolution(
            resolved,
          )
          ? resolved
          : resolved.routes
            ?? Object.freeze(
              [] as RouteDefinition[],
            );

    const incomingContributions =
      !resolved
        || isNavigationTreeResolution(
          resolved,
        )
        ? Object.freeze(
            [] as RouteContributionDefinition[],
          )
        : resolved.contributions
          ?? Object.freeze(
            [] as RouteContributionDefinition[],
          );

    const incomingIdentities =
      !resolved
        || isNavigationTreeResolution(
          resolved,
        )
        ? Object.freeze(
            {} as Record<string, string>,
          )
        : resolved
            .contributionIdentities
          ?? Object.freeze(
            {} as Record<string, string>,
          );

    const authoredContributionIds =
      new Set(
        (
          this.configuration
            .contributions ?? []
        ).map(
          contribution =>
            contribution.id,
        ),
      );

    const nextContributions =
      new Map<
        string,
        RouteContributionDefinition
      >();

    const nextIdentities =
      new Map<string, string>();

    for (
      const contribution
      of incomingContributions
    ) {
      if (
        authoredContributionIds.has(
          contribution.id,
        )
      ) {
        throw new Error(
          `Resolved route contribution "${contribution.id}" conflicts with an authored contribution.`,
        );
      }

      const identity =
        incomingIdentities[
          contribution.id
        ];

      const previousIdentity =
        this.resolvedContributionIdentityById
          .get(contribution.id);

      const previousContribution =
        this.resolvedContributionsById
          .get(contribution.id);

      /*
       * Preserve the exact authored route/layout/component definition objects
       * when the server confirms the executable artifact identity is unchanged.
       */
      const selected =
        identity
        && identity
          === previousIdentity
        && previousContribution
          ? previousContribution
          : contribution;

      nextContributions.set(
        contribution.id,
        selected,
      );

      if (identity) {
        nextIdentities.set(
          contribution.id,
          identity,
        );
      }
    }

    const routesUnchanged =
      sameReferences(
        this.resolvedRoutes,
        routes,
      );

    const contributionsUnchanged =
      mapsHaveSameReferences(
        this.resolvedContributionsById,
        nextContributions,
      )
      && mapsHaveSameValues(
        this.resolvedContributionIdentityById,
        nextIdentities,
      );

    if (
      routesUnchanged
      && contributionsUnchanged
    ) {
      return false;
    }

    const nextRegistry =
      this.createResolvedRegistry(
        routes,
        nextContributions,
      );

    this.resolvedRoutes =
      routes as NavigationTree;

    this.resolvedContributionsById
      .clear();

    for (
      const [id, contribution]
      of nextContributions
    ) {
      this.resolvedContributionsById
        .set(id, contribution);
    }

    this.resolvedContributionIdentityById
      .clear();

    for (
      const [id, identity]
      of nextIdentities
    ) {
      this.resolvedContributionIdentityById
        .set(id, identity);
    }

    this.registry = nextRegistry;

    return true;
  }

  private mergeResolvedNavigation(resolved: Exclude<RouteResolution, null | undefined>): boolean {
    const routes = isNavigationTreeResolution(resolved)
      ? resolved
      : resolved.routes ?? Object.freeze([]);
    const incomingContributions = isNavigationTreeResolution(resolved)
      ? Object.freeze([] as RouteContributionDefinition[])
      : resolved.contributions ?? Object.freeze([]);
    const incomingIdentities = isNavigationTreeResolution(resolved)
      ? Object.freeze({} as Record<string, string>)
      : resolved.contributionIdentities ?? Object.freeze({} as Record<string, string>);

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
    const nextIdentities = new Map(this.resolvedContributionIdentityById);
    const authoredContributionIds = new Set(
      (this.configuration.contributions ?? []).map(contribution => contribution.id),
    );

    for (const contribution of incomingContributions) {
      if (authoredContributionIds.has(contribution.id)) {
        throw new Error(
          `Resolved route contribution "${contribution.id}" conflicts with an authored contribution.`,
        );
      }
      const identity =
        incomingIdentities[
          contribution.id
        ];

      const previousIdentity =
        nextIdentities.get(
          contribution.id,
        );

      const previousContribution =
        nextContributions.get(
          contribution.id,
        );

      nextContributions.set(
        contribution.id,
        identity
        && identity === previousIdentity
        && previousContribution
          ? previousContribution
          : contribution,
      );

      if (identity) {
        nextIdentities.set(
          contribution.id,
          identity,
        );
      }
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

    this.resolvedContributionIdentityById.clear();
    for (const [id, identity] of nextIdentities) {
      this.resolvedContributionIdentityById.set(id, identity);
    }

    this.registry = nextRegistry;
    return true;
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
    options: Readonly<{
      revalidate?: boolean;
    }> = {},
  ): Promise<boolean> {
    const engine = this.engine;

    if (!engine) {
      return false;
    }

    const routes =
      adaptRoutes(
        this.registry.groups,
        this.appRef,
        this.document,
        this.injector,
        this.adaptedRouteCache,
      );

    const activeRouteConfig =
      engine.state.routeConfig;

    engine.replaceConfiguration({
      routes,
      transitions:
        adaptFrameTransitions(
          this.registry.groups,
          this.injector,
          this.adaptedTransitionCache,
        ),
    });

    if (
      options.revalidate === false
    ) {
      return true;
    }

    /*
     * If the exact active runtime route survived reconciliation, none of the
     * route definition, inherited layout or outlet references affecting the
     * current page changed. Updating unrelated branches must therefore not
     * recreate the active view or rerun lifecycle/prepare work.
     */
    if (
      activeRouteConfig
      && routes.includes(
        activeRouteConfig,
      )
    ) {
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
    task = Promise.resolve()
      .then(async () => {
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
      })
      .catch((error) => {
        if (this.engineStartupTask === task) {
          this.recordNavigationError(error);
        }
      })
      .finally(() => {
        if (this.engineStartupTask === task) {
          this.engineStartupTask = null;
        }
      });

    this.engineStartupTask = task;
  }

  private createEngine(): VanillaRouter {
    return createRouter({
      routes: adaptRoutes(
        this.registry.groups,
        this.appRef,
        this.document,
        this.injector,
        this.adaptedRouteCache,
      ),

      baseHref: this.baseHref,

      enableTracing: this.configuration.enableTracing,

      maxRedirects: this.configuration.maxRedirects,

      onSameUrlNavigation: this.configuration.onSameUrlNavigation,

      scrollRestoration: this.configuration.scrollRestoration,

      preloading: this.configuration.preloading,

      transitions: [...adaptFrameTransitions(
        this.registry.groups,
        this.injector,
        this.adaptedTransitionCache,
      )],

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