import type {
  NamedNavigationTarget,
} from './navigation-targets';

import type {
  NavigationTree,
} from './navigation-definitions';

import type {
  TypedHref,
  TypedNavigate,
} from './typed-navigation';

export function createTypedNavigateProxy<
  TRoutes extends NavigationTree,
>(
  navigate: (
    target: NamedNavigationTarget,
  ) => Promise<boolean>,
): TypedNavigate<TRoutes> {
  return new Proxy(Object.create(null), {
    get: (_target, property) => {
      if (
        typeof property !== 'string'
        || property === 'then'
      ) {
        return undefined;
      }

      return (
        options:
          Record<string, unknown> = {},
      ) =>
        navigate({
          name: property,
          ...options,
        } as NamedNavigationTarget);
    },
  }) as TypedNavigate<TRoutes>;
}

export function createTypedHrefProxy<
  TRoutes extends NavigationTree,
>(
  href: (
    target: NamedNavigationTarget,
  ) => string | null,
): TypedHref<TRoutes> {
  return new Proxy(Object.create(null), {
    get: (_target, property) => {
      if (
        typeof property !== 'string'
        || property === 'then'
      ) {
        return undefined;
      }

      return (
        options:
          Record<string, unknown> = {},
      ) =>
        href({
          name: property,
          ...options,
        } as NamedNavigationTarget);
    },
  }) as TypedHref<TRoutes>;
}
