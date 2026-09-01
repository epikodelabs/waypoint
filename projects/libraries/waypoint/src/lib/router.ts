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
  ServerNavigationCoordinator,
} from './server-navigation-coordinator';

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
  private readonly runtime: AngularRouterRuntime;
  private readonly navigation: ServerNavigationCoordinator;

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
    const routeResolution =
      new RouteResolutionCoordinator(
        this.resolvedNavigation,
        this.configuration.resolveRoutes,
      );

    const configurationResolver =
      this.configuration.resolveRoutes as
        | (
            typeof this.configuration.resolveRoutes
            & RouteConfigurationResolver
          )
        | undefined;

    this.navigation =
      new ServerNavigationCoordinator({
        document: this.document,
        baseHref: this.baseHref,
        resolvedNavigation:
          this.resolvedNavigation,
        routeResolution,
        runtime: () => this.runtime,
        href: (target) => this.href(target),
        resolveConfiguration:
          configurationResolver
            ?.resolveConfiguration,
      });

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
        this.navigation.prepareStartup(url),
      shouldRecoverNotFound: (url) =>
        this.navigation.shouldResolveNotFoundUrl(
          url,
        ),
      recoverNotFound: (url) =>
        this.navigation.recoverNotFound(url),
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

  navigate(
    target: NavigationTarget,
    options?: Parameters<
      ServerNavigationCoordinator['navigate']
    >[1],
  ): Promise<boolean> {
    return this.navigation.navigate(
      target,
      options,
    );
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

  revalidate(
    options: RouterRevalidationOptions = {},
  ): Promise<boolean> {
    return this.navigation.revalidate(
      options,
    );
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
    this.navigation.dispose();
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


}
