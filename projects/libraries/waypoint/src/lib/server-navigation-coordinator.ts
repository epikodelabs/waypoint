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

export interface ServerNavigationOptions {
  readonly document: Document;
  readonly baseHref: string;
  readonly resolvedNavigation:
    ResolvedNavigationState;
  readonly routeResolution:
    RouteResolutionCoordinator;
  readonly runtime: AngularRouterRuntime;
  readonly href: (
    target: NavigationTarget,
  ) => string | null;
  readonly resolveConfiguration?: () =>
    Promise<ResolvedNavigationConfiguration>;
}

export class ServerNavigationCoordinator {
  private readonly preResolvedKeys =
    new Set<string>();
  private resolvingNavigationCount = 0;
  private requestId = 0;

  constructor(
    private readonly options:
      ServerNavigationOptions,
  ) {}

  navigate(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean> {
    return this.navigateResolved(
      target,
      options,
    );
  }

  async revalidate(
    options:
      RouterRevalidationOptions = {},
  ): Promise<boolean> {
    const resolver =
      this.options.resolveConfiguration;

    if (
      !this.options.routeResolution
        .hasResolver()
    ) {
      return this.captureError(
        () =>
          this.options.runtime
            .requireEngine()
            .revalidate(),
      );
    }

    if (
      !options.resetResolvedRoutes
      && resolver
    ) {
      return this.revalidateConfiguration(
        resolver,
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
      this.options.routeResolution
        .hasResolver()
      && url.origin === location.origin
      && isPathInsideBase(
        url.pathname,
        this.options.baseHref,
      )
    ) {
      await this.resolveUrl(
        url,
        { install: false },
      );
    }
  }

  async recoverNotFound(
    url: URL,
  ): Promise<void> {
    const resolved =
      await this.resolveUrl(
        url,
        { install: false },
      );

    if (resolved) {
      await this.installRegistry();
    }
  }

  shouldRecoverNotFound(
    url: URL,
  ): boolean {
    if (
      this.resolvingNavigationCount > 0
      || this.preResolvedKeys.size > 0
    ) {
      return false;
    }

    const path = stripBaseHref(
      url.pathname,
      this.options.baseHref,
    );

    return this.requestId > 0
      || path !== '/'
      || url.search.length > 0
      || url.hash.length > 0;
  }

  dispose(): void {
    this.requestId++;
    this.options.routeResolution
      .invalidate();
    this.options.runtime.dispose();
  }

  private async navigateResolved(
    target: NavigationTarget,
    navigationOptions?: NavigationOptions,
  ): Promise<boolean> {
    this.resolvingNavigationCount++;

    try {
      const requestId = ++this.requestId;
      const generation =
        this.options.routeResolution
          .generation;
      const href =
        this.options.href(target);

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
        this.options.routeResolution
          .abort(key);

        resolved = await this.resolveUrl(
          url,
          { install: false },
        );
      }

      if (
        !this.isCurrent(
          requestId,
          generation,
        )
      ) {
        return false;
      }

      const engine =
        await this.options.runtime
          .requireStartedEngine();

      if (
        !this.isCurrent(
          requestId,
          generation,
        )
      ) {
        return false;
      }

      if (resolved) {
        await this.installRegistry({
          revalidate: false,
        });

        if (
          !this.isCurrent(
            requestId,
            generation,
          )
        ) {
          return false;
        }

        this.preResolvedKeys.add(key);
      }

      try {
        return await engine.navigate(
          href,
          navigationOptions,
        );
      } finally {
        this.preResolvedKeys.delete(key);
      }
    } catch (error) {
      this.options.runtime
        .recordError(error);
      throw error;
    } finally {
      this.resolvingNavigationCount--;
    }
  }

  private async revalidateByRevocation():
    Promise<boolean> {
    this.requestId++;
    this.options.routeResolution
      .invalidate({
        resetState: true,
      });

    const location =
      getRouterLocation(
        this.options.document,
      );
    const url = resolveRouterUrl(
      `${location.pathname}` +
        `${location.search}` +
        `${location.hash}`,
      this.options.baseHref,
      location,
      'navigate',
    );

    try {
      if (
        this.options.routeResolution
          .hasResolver()
        && url.origin === location.origin
        && isPathInsideBase(
          url.pathname,
          this.options.baseHref,
        )
      ) {
        await this.resolveUrl(
          url,
          {
            force: true,
            install: false,
          },
        );
      }

      return await this.installRegistry();
    } catch (error) {
      try {
        await this.installRegistry();
      } catch {
        // Preserve the authorization or
        // transport failure as the cause.
      }

      this.options.runtime
        .recordError(error);
      throw error;
    }
  }

  private async revalidateConfiguration(
    resolveConfiguration: () =>
      Promise<ResolvedNavigationConfiguration>,
  ): Promise<boolean> {
    this.requestId++;
    this.options.routeResolution
      .invalidate();

    const generation =
      this.options.routeResolution
        .generation;
    const contributionId =
      this.currentContributionId();
    const identity = contributionId
      ? this.options.resolvedNavigation
          .contributionIdentity(
            contributionId,
          )
      : undefined;

    try {
      const resolved =
        await resolveConfiguration();

      if (
        generation !==
        this.options.routeResolution
          .generation
      ) {
        return false;
      }

      this.options.resolvedNavigation
        .replace(resolved);

      const sameArtifact =
        !!contributionId
        && !!identity
        && this.options
          .resolvedNavigation
          .contributionIdentity(
            contributionId,
          ) === identity;

      await this.installRegistry({
        revalidate: false,
      });

      if (sameArtifact) {
        return true;
      }

      return await this.options.runtime
        .requireEngine()
        .revalidate();
    } catch (error) {
      this.options.runtime
        .recordError(error);
      throw error;
    }
  }

  private async resolveUrl(
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
      await this.options.routeResolution
        .resolve(
          url,
          key,
          {
            force: options.force,
          },
        );

    if (
      resolved
      && options.install !== false
    ) {
      await this.installRegistry();
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

    return this.options
      .resolvedNavigation
      .contributionIdForPath(path);
  }

  private installRegistry(
    options: Readonly<{
      revalidate?: boolean;
    }> = {},
  ): Promise<boolean> {
    return this.options.runtime.install(
      this.options.resolvedNavigation
        .registry,
      options,
    );
  }

  private isCurrent(
    requestId: number,
    generation: number,
  ): boolean {
    return requestId === this.requestId
      && generation ===
        this.options.routeResolution
          .generation;
  }

  private async captureError(
    action: () => Promise<boolean>,
  ): Promise<boolean> {
    try {
      return await action();
    } catch (error) {
      this.options.runtime
        .recordError(error);
      throw error;
    }
  }
}
