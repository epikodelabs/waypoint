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
  AngularRouterRuntime,
} from './angular-router-runtime';

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
  createTypedHrefProxy,
  createTypedNavigateProxy,
} from './typed-navigation-proxy';

import {
  reloadRouterApplication,
} from './router-reload';

import {
  ROUTE,
  ROUTE_CONTEXT,
  Router as RouterContract,
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

export class ServerRouter<TRoutes extends NavigationTree = any>
  extends RouterContract<TRoutes> {
  private readonly document: Document;
  private readonly appBaseHref: string;
  private readonly resolvedNavigation:
    ResolvedNavigationState<TRoutes>;
  private readonly namedNavigation: NamedNavigationCatalog;
  private readonly routeResolution: RouteResolutionCoordinator;
  private readonly runtime: AngularRouterRuntime;
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private navigationRequestId = 0;

  public readonly navigateTo: TypedNavigate<TRoutes>;
  public readonly hrefTo: TypedHref<TRoutes>;

  constructor(private configuration: RouterConfiguration<TRoutes>) {
    super();
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);
    const destroyRef = inject(DestroyRef);
    const pendingTasks = inject(PendingTasks);
    this.document = inject(DOCUMENT);
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
    this.runtime = new AngularRouterRuntime({
      appRef,
      injector,
      document: this.document,
      pendingTasks,
      baseHref: this.baseHref,
      enableTracing:
        this.configuration.enableTracing,
      maxRedirects:
        this.configuration.maxRedirects,
      onSameUrlNavigation:
        this.configuration.onSameUrlNavigation,
      scrollRestoration:
        this.configuration.scrollRestoration,
      preloading:
        this.configuration.preloading,
      viewTransitions:
        this.configuration.viewTransitions,
      registry: () => this.registry,
      prepareStartup: (url) =>
        this.prepareRuntimeStartup(url),
      shouldRecoverNotFound: (url) =>
        this.shouldResolveNotFoundUrl(url),
      recoverNotFound: (url) =>
        this.recoverNotFound(url),
    });

    this.navigateTo =
      createTypedNavigateProxy(
        (target) =>
          this.navigate(target),
      );

    this.hrefTo =
      createTypedHrefProxy(
        (target) =>
          this.href(target),
      );

    destroyRef.onDestroy(() => this.dispose());
  }

  get active(): boolean {
    return this.runtime.active;
  }

  get state() {
    return this.runtime.state;
  }

  get displayUrl(): string {
    const location = getRouterLocation(this.document);

    return `${location.pathname}${location.search}${location.hash}`;
  }

  connect(
    name: string,
    outlet: HTMLElement,
  ): void {
    this.runtime.connect(name, outlet);
  }

  disconnect(
    name: string,
    outlet: HTMLElement,
  ): void {
    if (
      this.runtime.disconnect(
        name,
        outlet,
      )
    ) {
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
        return await this.runtime.requireEngine().revalidate();
      } catch (error) {
        this.runtime.recordError(error);
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
      this.runtime.recordError(error);
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

      return await this.runtime.requireEngine().revalidate();
    } catch (error) {
      this.runtime.recordError(error);
      throw error;
    }
  }

  reload(
    options: RouterReloadOptions = {},
  ): Promise<never> {
    return reloadRouterApplication(
      options,
      this.displayUrl,
    );
  }

  updateHistoryState(state: unknown): void {
    this.runtime.requireEngine().updateHistoryState(state);
  }

  preload(): Promise<void> {
    return this.runtime.requireEngine().preload();
  }

  dispose(): void {
    this.navigationRequestId++;
    this.routeResolution.invalidate();
    this.runtime.dispose();
  }

  private get baseHref(): string {
    return this.configuration.baseHref ?? this.appBaseHref;
  }

  private get registry(): RouteRegistry {
    return this.resolvedNavigation.registry;
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

      const engine = await this.runtime.requireStartedEngine();

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
      this.runtime.recordError(error);
      throw error;
    } finally {
      this.preResolvingNavigationCount--;
    }
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

  private installCurrentRegistry(
    options: Readonly<{
      revalidate?: boolean;
    }> = {},
  ): Promise<boolean> {
    return this.runtime.install(
      this.registry,
      options,
    );
  }

  private async prepareRuntimeStartup(
    url: URL,
  ): Promise<void> {
    const location =
      getRouterLocation(this.document);

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
        { install: false },
      );
    }
  }

  private async recoverNotFound(
    url: URL,
  ): Promise<void> {
    const resolved =
      await this.resolveRoutesForUrl(
        url,
        { install: false },
      );

    if (resolved) {
      await this.installCurrentRegistry();
    }
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
