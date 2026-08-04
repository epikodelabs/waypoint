import type {
  InferParamType,
  InferQueryInputType,
  InferQueryType,
  ParamSchemaRecord,
  QuerySchemaRecord,
} from './query-schema';
import type {
  RouteDefinition, NavigationTree
} from './navigation-definitions';

/**
 * Extracts named parameter tokens from path string templates (e.g. "/users/:id")
 */
export type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

/**
 * Recursively flattens all routes and layout entries into a union of leaf routes.
 */
export type LeafRouteDefinitions<TRoutes extends NavigationTree> =
  TRoutes[number] extends infer TEntry ? TEntry extends { kind: 'route' } ? TEntry : TEntry extends { kind: 'layout', entries: infer TEntries extends NavigationTree } ? LeafRouteDefinitions<TEntries> : never : never;

type RouteName<TRoute> = TRoute extends RouteDefinition<
  string,
  infer TName,
  ParamSchemaRecord | undefined,
  QuerySchemaRecord | undefined
>
  ? Extract<TName, string>
  : never;

/**
 * Extracts route names safely across layout entries without deep recursion.
 */
export type ExtractRouteNames<TRoutes extends NavigationTree> =
  RouteName<LeafRouteDefinitions<TRoutes>>;

/**
 * Infers route path parameter types from paramsSchema or path template tokens.
 */
export type InferRouteParams<TRoute> =
  TRoute extends RouteDefinition<
    infer TPath extends string,
    string | undefined,
    infer TParamsSchema,
    QuerySchemaRecord | undefined
  >
    ? [TParamsSchema] extends [ParamSchemaRecord]
      ? InferParamType<TParamsSchema>
      : [ExtractPathParams<TPath>] extends [never]
        ? Record<string, never>
        : Readonly<Record<ExtractPathParams<TPath>, string>>
    : Record<string, unknown>;

/**
 * Infers route query parameter types from querySchema or searchSchema.
 */
export type InferRouteQuery<TRoute> =
  TRoute extends RouteDefinition<
    string,
    string | undefined,
    ParamSchemaRecord | undefined,
    infer TQuerySchema
  >
    ? [TQuerySchema] extends [QuerySchemaRecord]
      ? InferQueryType<TQuerySchema>
      : Record<string, unknown>
    : Record<string, unknown>;

export type InferRouteQueryInput<TRoute> =
  TRoute extends RouteDefinition<
    string,
    string | undefined,
    ParamSchemaRecord | undefined,
    infer TQuerySchema
  >
    ? [TQuerySchema] extends [QuerySchemaRecord]
      ? InferQueryInputType<TQuerySchema>
      : Record<string, unknown>
    : Record<string, unknown>;

type HasRequiredParams<TRoute> =
  InferRouteParams<TRoute> extends infer TParams
    ? keyof TParams extends never
      ? false
      : TParams extends Record<string, never>
      ? false
      : true
    : false;

/**
 * Maps options (params, query, search, navigation state) for a target route name.
 */
export type RouteOptionsByName<
  TRoutes extends NavigationTree,
  TName extends string,
> = LeafRouteDefinitions<TRoutes> extends infer TRoute
  ? TRoute extends RouteDefinition<string, TName, any, any>
    ? HasRequiredParams<TRoute> extends true
      ? {
          readonly params: InferRouteParams<TRoute>;
          readonly query?: InferRouteQueryInput<TRoute>;
          readonly state?: unknown;
          readonly replace?: boolean;
        }
      : {
          readonly params?: InferRouteParams<TRoute>;
          readonly query?: InferRouteQueryInput<TRoute>;
          readonly state?: unknown;
          readonly replace?: boolean;
        }
    : never
  : never;

/**
 * Strongly-typed navigation proxy for Router.
 */
export type TypedNavigate<TRoutes extends NavigationTree> = {
  [K in ExtractRouteNames<TRoutes>]: (
    options?: RouteOptionsByName<TRoutes, K>,
  ) => Promise<boolean>;
};

/**
 * Strongly-typed href generator proxy for Router.
 */
export type TypedHref<TRoutes extends NavigationTree> = {
  [K in ExtractRouteNames<TRoutes>]: (
    options?: RouteOptionsByName<TRoutes, K>,
  ) => string | null;
};

type Simplify<T> = { readonly [K in keyof T]: T[K] };
type MergeData<TLeft, TRight> = Simplify<TLeft & TRight>;

type StaticRouteData<TEntry> =
  TEntry extends { readonly data?: infer TData }
    ? TData extends Readonly<Record<string, unknown>>
      ? TData
      : Readonly<Record<string, never>>
    : Readonly<Record<string, never>>;

type FrameData<TEntry> =
  TEntry extends { readonly frame?: infer TFrame }
    ? import('./navigation-definitions').InferFrameData<TFrame>
    : Readonly<Record<string, never>>;

type PreparedDataForName<
  TEntries extends NavigationTree,
  TName extends string,
  TInherited = Readonly<Record<string, never>>,
> =
  TEntries[number] extends infer TEntry
    ? TEntry extends {
        readonly kind: 'layout';
        readonly entries: infer TChildren extends NavigationTree;
      }
      ? PreparedDataForName<
          TChildren,
          TName,
          MergeData<TInherited, MergeData<StaticRouteData<TEntry>, FrameData<TEntry>>>
        >
      : TEntry extends {
          readonly kind: 'route';
          readonly name?: infer TRouteName;
        }
        ? TRouteName extends TName
          ? MergeData<TInherited, MergeData<StaticRouteData<TEntry>, FrameData<TEntry>>>
          : never
        : never
    : never;

/**
 * Infers the complete activated data for a named route, including enclosing
 * layout data and all frame prepare results. Unknown names resolve to never.
 */
export type InferNavigationPreparedData<
  TEntries extends NavigationTree,
  TName extends string,
> = PreparedDataForName<TEntries, TName>;
