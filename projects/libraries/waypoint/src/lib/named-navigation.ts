import type {
  NamedNavigationTarget,
} from './navigation-targets';

import type {
  InferParamType,
  ParamSchemaRecord,
  QuerySchemaRecord,
} from './query-schema';

import {
  serializeParams,
  serializeQuery,
} from './query-schema';

export interface NamedRouteDefinition {
  readonly name: string;
  readonly path: string;
  readonly params?: ParamSchemaRecord;
  readonly query?: QuerySchemaRecord;
}

export interface NamedRouteRecord {
  readonly path: string;
  readonly route: {
    readonly kind?: 'route' | 'redirect';
    readonly params?: ParamSchemaRecord;
    readonly query?: QuerySchemaRecord;
  };
}

export interface NamedRouteSource {
  readonly namedRoutes: ReadonlyMap<
    string,
    NamedRouteRecord
  >;
}

export class NamedNavigationCatalog {
  private readonly deferred =
    new Map<string, NamedRouteDefinition>();

  constructor(
    routes: readonly NamedRouteDefinition[] = [],
  ) {
    for (const route of routes) {
      this.deferred.set(route.name, route);
    }
  }

  href(
    target: NamedNavigationTarget,
    registry: NamedRouteSource,
    resolveHref: (target: string) => string,
  ): string | null {
    const record = this.read(target.name, registry);

    if (!record) {
      return null;
    }

    if (
      'kind' in record.route
      && record.route.kind === 'redirect'
    ) {
      return null;
    }

    const path = interpolateNamedPath(
      record.path,
      target.params ?? {},
      record.route.params,
    );

    if (!path) {
      return null;
    }

    const query =
      record.route.query && target.query
        ? serializeQuery(
            record.route.query,
            target.query,
          )
        : '';

    return resolveHref(`${path}${query}`);
  }

  private read(
    name: string,
    registry: NamedRouteSource,
  ): NamedRouteRecord | undefined {
    const existing = registry.namedRoutes.get(name);

    if (existing) {
      return existing;
    }

    const deferred = this.deferred.get(name);

    if (!deferred) {
      return undefined;
    }

    return {
      path: deferred.path,
      route: {
        params: deferred.params,
        query: deferred.query,
      },
    };
  }
}

function interpolateNamedPath(
  template: string,
  params: Readonly<Record<string, unknown>>,
  schema: ParamSchemaRecord | undefined,
): string | null {
  const serialized = schema
    ? serializeParams(
        schema,
        params as unknown as InferParamType<ParamSchemaRecord>,
      )
    : Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) =>
            value !== undefined && value !== null
          )
          .map(([key, value]) => [
            key,
            String(value),
          ]),
      );

  const missing = new Set<string>();

  const path = template.replace(
    /:([A-Za-z_][A-Za-z0-9_]*)/g,
    (_match, key: string) => {
      const value = serialized[key];

      if (value === undefined) {
        missing.add(key);
        return `:${key}`;
      }

      return encodeURIComponent(value);
    },
  );

  return missing.size > 0 ? null : path;
}