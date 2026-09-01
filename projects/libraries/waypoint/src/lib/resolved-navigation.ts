import type {
  NavigationTree,
  RouteContributionDefinition,
} from './navigation-definitions';

import { createRouteRegistry } from './route-compiler';

export interface ResolvedNavigationConfiguration {
  readonly routes?: NavigationTree;
  readonly contributions?: readonly RouteContributionDefinition[];
  /** Opaque executable identity for each delivered contribution. */
  readonly contributionIdentities?: Readonly<Record<string, string>>;
  /** Optional full-configuration revision supplied by server delivery. */
  readonly revision?: string;
  readonly landing?: string;
}

export type RouteResolution =
  | NavigationTree
  | ResolvedNavigationConfiguration
  | null
  | undefined;

export interface RouteResolutionContext {
  readonly signal: AbortSignal;
}

export type RouteRegistry = ReturnType<typeof createRouteRegistry>;

export function isNavigationTreeResolution(
  value: Exclude<RouteResolution, null | undefined>,
): value is NavigationTree {
  return Array.isArray(value);
}

export class ResolvedNavigationState<
  TRoutes extends NavigationTree = NavigationTree,
> {
  private readonly authoredContributionIds: ReadonlySet<string>;
  private resolvedRoutes: NavigationTree = Object.freeze([]);
  private readonly resolvedContributionsById =
    new Map<string, RouteContributionDefinition>();
  private readonly resolvedContributionIdentitiesById =
    new Map<string, string>();
  private currentRegistry: RouteRegistry;

  constructor(
    private readonly authoredRoutes: TRoutes,
    private readonly authoredContributions:
      readonly RouteContributionDefinition[] = Object.freeze([]),
  ) {
    this.authoredContributionIds = new Set(
      authoredContributions.map((contribution) => contribution.id),
    );
    this.currentRegistry = createRouteRegistry(
      authoredRoutes,
      authoredContributions,
    );
  }

  get registry(): RouteRegistry {
    return this.currentRegistry;
  }

  reset(): void {
    this.resolvedRoutes = Object.freeze([]);
    this.resolvedContributionsById.clear();
    this.resolvedContributionIdentitiesById.clear();
    this.rebuild();
  }

  contributionIdentity(id: string): string | undefined {
    return this.resolvedContributionIdentitiesById.get(id);
  }

  contributionIdForPath(path: string): string | undefined {
    return this.currentRegistry.groups.find((group) =>
      matchesCompiledPath(group.primary.path, path),
    )?.primary.contributionId;
  }

  matchesPath(path: string): boolean {
    return this.currentRegistry.groups.some((group) =>
      matchesCompiledPath(group.primary.path, path),
    );
  }

  merge(
    resolved: Exclude<RouteResolution, null | undefined>,
  ): boolean {
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
    const nextContributions =
      new Map(this.resolvedContributionsById);

    for (const contribution of incomingContributions) {
      this.assertResolvedContribution(contribution);
      nextContributions.set(
        contribution.id,
        contribution,
      );
    }

    const nextRegistry = this.createRegistry(
      nextRoutes,
      nextContributions,
    );

    this.resolvedRoutes = nextRoutes;
    replaceMap(
      this.resolvedContributionsById,
      nextContributions,
    );

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

    this.currentRegistry = nextRegistry;
    return true;
  }

  replace(
    resolved: ResolvedNavigationConfiguration,
  ): void {
    const routes = resolved.routes ?? Object.freeze([]);
    const identities =
      resolved.contributionIdentities ?? {};
    const nextContributions =
      new Map<string, RouteContributionDefinition>();
    const nextIdentities =
      new Map<string, string>();

    for (const incoming of resolved.contributions ?? []) {
      this.assertResolvedContribution(incoming);

      const identity = identities[incoming.id];
      const previousIdentity =
        this.resolvedContributionIdentitiesById.get(
          incoming.id,
        );
      const previous =
        this.resolvedContributionsById.get(incoming.id);

      nextContributions.set(
        incoming.id,
        identity
          && previous
          && previousIdentity === identity
          ? previous
          : incoming,
      );

      if (identity) {
        nextIdentities.set(incoming.id, identity);
      }
    }

    const nextRegistry = this.createRegistry(
      routes,
      nextContributions,
    );

    this.resolvedRoutes = routes;
    replaceMap(
      this.resolvedContributionsById,
      nextContributions,
    );
    replaceMap(
      this.resolvedContributionIdentitiesById,
      nextIdentities,
    );
    this.currentRegistry = nextRegistry;
  }

  private rebuild(): void {
    this.currentRegistry = this.createRegistry(
      this.resolvedRoutes,
      this.resolvedContributionsById,
    );
  }

  private assertResolvedContribution(
    contribution: RouteContributionDefinition,
  ): void {
    if (this.authoredContributionIds.has(contribution.id)) {
      throw new Error(
        `Resolved route contribution "${contribution.id}" ` +
        'conflicts with an authored contribution.',
      );
    }
  }

  private createRegistry(
    resolvedRoutes: NavigationTree,
    resolvedContributions:
      ReadonlyMap<string, RouteContributionDefinition>,
  ): RouteRegistry {
    const routes = Object.freeze([
      ...this.authoredRoutes,
      ...resolvedRoutes,
    ]) as TRoutes;

    const contributionsById = new Map(
      this.authoredContributions.map(
        (contribution) => [
          contribution.id,
          contribution,
        ] as const,
      ),
    );

    for (const [id, contribution] of resolvedContributions) {
      contributionsById.set(id, contribution);
    }

    return createRouteRegistry(
      routes,
      Object.freeze([
        ...contributionsById.values(),
      ]),
    );
  }
}

function replaceMap<K, V>(
  target: Map<K, V>,
  source: ReadonlyMap<K, V>,
): void {
  target.clear();

  for (const [key, value] of source) {
    target.set(key, value);
  }
}

function matchesCompiledPath(
  pattern: string,
  pathname: string,
): boolean {
  const regex = new RegExp(
    `^${pattern
      .split('/')
      .map((segment) => {
        if (!segment) {
          return '';
        }

        return segment.startsWith(':')
          ? '[^/]+'
          : segment.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&',
            );
      })
      .join('/')}$`,
  );

  return regex.test(pathname);
}
