import type {
  NavigationTarget,
} from './navigation-targets';

import type {
  ResolvedNavigationConfiguration,
  ResolvedNavigationState,
} from './resolved-navigation';

import type {
  RouteResolutionCoordinator,
} from './route-resolution-coordinator';

import type {
  AngularRouterRuntime,
} from './angular-router-runtime';

import type {
  NavigationOptions,
} from './vanilla-router';

import type {
  RouterRevalidationOptions,
} from './router-contract';

import {
  getRouterLocation,
  isPathInsideBase,
  resolveRouterUrl,
  stripBaseHref,
} from './router-url';

export interface ServerNavigationCoordinatorOptions {
  readonly document: Document;
  readonly baseHref: string;
  readonly resolvedNavigation: ResolvedNavigationState;
  readonly routeResolution: RouteResolutionCoordinator;
  readonly runtime: () => AngularRouterRuntime;
  readonly href: (
    target: NavigationTarget,
  ) => string | null;
  readonly resolveConfiguration?: () =>
    Promise<ResolvedNavigationConfiguration>;
}

export class ServerNavigationCoordinator {
  private readonly preResolvedNavigationKeys =
    new Set<string>();
  private preResolvingNavigationCount = 0;
  private navigationRequestId = 0;

  constructor(
    private readonly options:
      ServerNavigationCoordinatorOptions,
  ) {}

  navigate(
    target: NavigationTarget,
    navigationOptions?: NavigationOptions,
  ): Promise<boolean> {
    return this.navigateResolved(
      target,
      navigationOptions,
    );
  }

  async revalidate(
    options: RouterRevalidationOptions = {},
  ): Promise<boolean> {
    if (
      !this.options.routeResolution.hasResolver()
    ) {
      try {
        return await this.options.runtime()
          .requireEngine()
          .revalidate();
      } catch (error) {
        this.options.runtime()
          .recordError(error);
        throw error;
      }
    }

    if (
      !options.resetResolvedRoutes
      && this.options.resolveConfiguration
    ) {
      return this.revalidateResolvedConfiguration(
        this.options.resolveConfiguration,
      );
    }

    return this.revalidateByRevocation();
  }

  async prepareStartup(
    url: URL,
  ): Promise<void> {
    const location =
      getRouterLocation(
        this.options.document,
      );

    if (
      this.options.routeResolution.hasResolver()
      && url.origin === location.origin
      && isPathInsideBase(
        url.pathname,
        this.options.baseHref,
      )
    ) {
      await this.resolveRoutesForUrl(
        url,
        { install: false },
      );
    }
  }

  async recoverNotFound(
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

  shouldResolveNotFoundUrl(
    url: URL,
  ): boolean {
    if (
      this.preResolvingNavigationCount > 0
      || this.preResolvedNavigationKeys.size > 0
    ) {
      return false;
    }

    const path = stripBaseHref(
      url.pathname,
      this.options.baseHref,
    );

    return this.navigationRequestId > 0
      || path !== '/'
      || url.search.length > 0
      || url.hash.length > 0;
  }

  dispose(): void {
    this.navigationRequestId++;
    this.options.routeResolution.invalidate();
    this.options.runtime().dispose();
  }

  private async navigateResolved(
    target: NavigationTarget,
    navigationOptions?: NavigationOptions,
  ): Promise<boolean> {
    this.preResolvingNavigationCount++;

    try {
      const requestId =
        ++this.navigationRequestId;
      const resolutionGeneration =
        this.options.routeResolution.generation;
      const href = this.options.href(target);

      if (href === null) {
        return false;
      }

      const location =
        getRouterLocation(
          this.options.document,
        );
      const url = resolveRouterUrl(
        href,
        this.options.baseHref,
        location,
        'navigate',
      );
      const key = stripBaseHref(
        url.pathname,
        this.options.baseHref,
      );

      let resolved = false;

      if (
        url.origin === location.origin
        && isPathInsideBase(
          url.pathname,
          this.options.baseHref,
        )
      ) {
        this.options.routeResolution.abort(
          key,
        );

        resolved =
          await this.resolveRoutesForUrl(
            url,
            { install: false },
          );
      }

      if (
        !this.isCurrent(
          requestId,
          resolutionGeneration,
        )
      ) {
        return false;
      }

      const engine =
        await this.options.runtime()
          .requireStartedEngine();

      if (
        !this.isCurrent(
          requestId,
          resolutionGeneration,
        )
      ) {
        return false;
      }

      if (resolved) {
        await this.installCurrentRegistry({
          revalidate: false,
        });

        if (
          !this.isCurrent(
            requestId,
            resolutionGeneration,
          )
        ) {
          return false;
        }

        this.preResolvedNavigationKeys.add(
          key,
        );
      }

      try {
        return await engine.navigate(
          href,
          navigationOptions,
        );
      } finally {
        this.preResolvedNavigationKeys.delete(
          key,
        );
      }
    } catch (error) {
      this.options.runtime()
        .recordError(error);
      throw error;
    } finally {
      this.preResolvingNavigationCount--;
    }
  }

  private async revalidateByRevocation():
    Promise<boolean> {
    this.navigationRequestId++;
    this.options.routeResolution.invalidate({
      resetState: true,
    });

    const location =
      getRouterLocation(
        this.options.document,
      );
    const url = resolveRouterUrl(
      `${location.pathname}${location.search}${location.hash}`,
      this.options.baseHref,
      location,
      'navigate',
    );

    try {
      if (
        this.options.routeResolution.hasResolver()
        && url.origin === location.origin
        && isPathInsideBase(
          url.pathname,
          this.options.baseHref,
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

      return await this.installCurrentRegistry();
    } catch (error) {
      try {
        await this.installCurrentRegistry();
      } catch {
        // Keep the authorization/transport
        // failure as the actionable error.
      }

      this.options.runtime()
        .recordError(error);
      throw error;
    }
  }

  private async revalidateResolvedConfiguration(
    resolveConfiguration: () =>
      Promise<ResolvedNavigationConfiguration>,
  ): Promise<boolean> {
    this.navigationRequestId++;
    this.options.routeResolution.invalidate();

    const generation =
      this.options.routeResolution.generation;
    const activeContributionId =
      this.currentContributionId();
    const activeIdentity =
      activeContributionId
        ? this.options.resolvedNavigation
            .contributionIdentity(
              activeContributionId,
            )
        : undefined;

    try {
      const resolved =
        await resolveConfiguration();

      if (
        generation !==
        this.options.routeResolution.generation
      ) {
        return false;
      }

      this.options.resolvedNavigation.replace(
        resolved,
      );

      const activeStillEquivalent =
        !!activeContributionId
        && !!activeIdentity
        && this.options.resolvedNavigation
          .contributionIdentity(
            activeContributionId,
          ) === activeIdentity;

      await this.installCurrentRegistry({
        revalidate: false,
      });

      if (activeStillEquivalent) {
        return true;
      }

      return await this.options.runtime()
        .requireEngine()
        .revalidate();
    } catch (error) {
      this.options.runtime()
        .recordError(error);
      throw error;
    }
  }

  private async resolveRoutesForUrl(
    url: URL,
    options: Readonly<{
      force?: boolean;
      install?: boolean;
    }> = {},
  ): Promise<boolean> {
    const key = stripBaseHref(
      url.pathname,
      this.options.baseHref,
    );
    const resolved =
      await this.options.routeResolution.resolve(
        url,
        key,
        { force: options.force },
      );

    if (
      resolved
      && options.install !== false
    ) {
      await this.installCurrentRegistry();
    }

    return resolved;
  }

  private currentContributionId():
    string | undefined {
    const location =
      getRouterLocation(
        this.options.document,
      );
    const path = stripBaseHref(
      location.pathname,
      this.options.baseHref,
    );

    return this.options.resolvedNavigation
      .contributionIdForPath(path);
  }

  private installCurrentRegistry(
    options: Readonly<{
      revalidate?: boolean;
    }> = {},
  ): Promise<boolean> {
    return this.options.runtime().install(
      this.options.resolvedNavigation.registry,
      options,
    );
  }

  private isCurrent(
    requestId: number,
    generation: number,
  ): boolean {
    return requestId === this.navigationRequestId
      && generation ===
        this.options.routeResolution.generation;
  }
}
