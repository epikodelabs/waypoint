import type { EnvironmentProviders, Provider, Type } from '@angular/core';
import type { ParamSchemaRecord, QuerySchemaRecord } from './query-schema';
import type {
  ActivatedRoute,
  CanActivateFn as RouterCanActivateFn,
  DeactivationContext,
  GuardResult,
  NavigationContext,
  RouteData,
} from './vanilla-router';

export type MaybePromise<T> = T | PromiseLike<T>;
export type Lazy<T> = () => MaybePromise<T | { readonly default: T }>;

export type NavigationProvider = Provider | EnvironmentProviders;
export type NavigationProviders = readonly NavigationProvider[];

export interface RoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export type RouteRedirect = {
  readonly redirectTo: string | URL;
  readonly replace?: boolean;
};

export type EmptyRouteData = Readonly<Record<string, never>>;

export type FramePrepareResult = void | RouteData;

export type FramePrepareFn<
  TResult extends FramePrepareResult = FramePrepareResult,
> = (
  context: NavigationContext,
) => MaybePromise<TResult>;

type AwaitedPrepareResult<TPrepare> =
  TPrepare extends (...args: never[]) => infer TResult
    ? Exclude<Awaited<TResult>, void>
    : never;

type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends
    (value: infer TIntersection) => void
      ? TIntersection
      : never;

type Simplify<T> = {
  readonly [TKey in keyof T]: T[TKey];
};

/**
 * Merges the object results of all prepare handlers in a frame.
 * A handler returning void contributes no keys.
 */
export type InferPreparedData<
  TPrepare extends readonly FramePrepareFn[] | undefined,
> = [TPrepare] extends [readonly FramePrepareFn[]]
  ? [AwaitedPrepareResult<TPrepare[number]>] extends [never]
    ? Readonly<Record<string, never>>
    : Simplify<UnionToIntersection<AwaitedPrepareResult<TPrepare[number]>>>
  : EmptyRouteData;

export type FrameAfterEnterFn<
  TData extends RouteData = RouteData,
> = (
  route: ActivatedRoute<TData>,
) => MaybePromise<void>;

export type FrameBeforeLeaveFn<
  TData extends RouteData = RouteData,
> = (
  route: DeactivationContext<TData>,
) => MaybePromise<GuardResult>;

export interface FrameHooks<
  TPrepare extends readonly FramePrepareFn[] | undefined =
    readonly FramePrepareFn[] | undefined,
> {
  readonly beforeEnter?: readonly RouterCanActivateFn[];
  readonly beforeLeave?: readonly FrameBeforeLeaveFn<InferPreparedData<TPrepare>>[];
  readonly prepare?: TPrepare;
  readonly afterEnter?: readonly FrameAfterEnterFn<InferPreparedData<TPrepare>>[];
}

export interface EagerViewDefinition {
  readonly component: Type<unknown>;
  readonly loadComponent?: never;
}

export interface LazyViewDefinition {
  readonly component?: never;
  readonly loadComponent: Lazy<Type<unknown>>;
}

export type ViewDefinition = EagerViewDefinition | LazyViewDefinition;

export type FrameView<
  TData extends RouteData = EmptyRouteData,
> = ViewDefinition & {
  readonly kind: 'frame';
  readonly beforeEnter?: readonly RouterCanActivateFn[];
  readonly beforeLeave?: readonly FrameBeforeLeaveFn<TData>[];
  readonly prepare?: readonly FramePrepareFn[];
  readonly afterEnter?: readonly FrameAfterEnterFn<TData>[];
};

export type InferFrameData<TFrame> =
  TFrame extends FrameView<infer TData>
    ? TData
    : EmptyRouteData;

export interface RouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
> {
  readonly path: TPath;
  readonly name?: TName;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly providers?: NavigationProviders;
  /** Server authorization metadata consumed by the Waypoint compiler. */
  readonly policy?: RoutePolicy;
}

export interface RenderableRouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
> extends RouteDefinitionBase<TPath, TName> {
  readonly kind: 'route';
  readonly outlet?: string;
  readonly preload?: boolean;
  readonly viewTransition?: boolean;
  readonly paramsSchema?: TParamsSchema;
  readonly querySchema?: TQuerySchema;
}

export type RouteOptions<
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
> = Omit<
  RenderableRouteDefinitionBase<string, TName, TParamsSchema, TQuerySchema>,
  'kind' | 'path'
>;

export interface RedirectRouteDefinition<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
> extends RouteDefinitionBase<TPath, TName> {
  readonly kind: 'redirect';
  readonly redirectTo: string;
}

export type RenderableRoute<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = RenderableRouteDefinitionBase<TPath, TName, TParamsSchema, TQuerySchema> &
  ViewDefinition & {
    readonly frame?: TFrame;
    readonly redirectTo?: never;
  };

export type RouteDefinition<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> =
  | RedirectRouteDefinition<TPath, TName>
  | RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, TFrame>;

export type InferRoutePreparedData<TRoute> =
  TRoute extends RenderableRoute<string, string | undefined, any, any, infer TFrame>
    ? TFrame extends FrameView<any>
      ? InferFrameData<TFrame>
      : Readonly<Record<string, never>>
    : EmptyRouteData;

export interface LayoutDefinitionBase<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
> {
  readonly kind: 'layout';
  readonly path: TPath;
  readonly entries: TEntries;
  readonly providers?: NavigationProviders;
  /** Server authorization metadata inherited by descendant navigation. */
  readonly policy?: RoutePolicy;
}

export type LayoutOptions = Omit<
  LayoutDefinitionBase,
  'kind' | 'path' | 'entries'
>;

export type LayoutDefinition<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = LayoutDefinitionBase<TPath, TEntries> &
  ViewDefinition & {
    readonly frame?: TFrame;
  };

export type RouteContributionLoader<
  TContribution extends RouteContributionDefinition =
    RouteContributionDefinition,
> = Lazy<TContribution>;

export interface RouteSlotDefinition<
  TId extends string = string,
  TContribution extends RouteContributionDefinition =
    RouteContributionDefinition,
> {
  readonly kind: 'route-slot';
  readonly id: TId;

  /**
   * Authored ownership edge for a separately defined routesFor() contribution.
   *
   * In server-delivery builds the compiler consumes this loader as source
   * metadata. The protected parent artifact does not bundle the child route set;
   * the server remains responsible for authorizing and delivering it.
   */
  readonly loadContribution?: RouteContributionLoader<TContribution>;
}

export interface RouteContributionDefinition<
  TSlotId extends string = string,
  TId extends string = string,
  TEntries extends NavigationTree = NavigationTree,
> {
  readonly kind: 'route-contribution';
  readonly slotId: TSlotId;
  readonly id: TId;
  readonly entries: TEntries;
}

export type AnyRouteDefinition = RouteDefinition<any, any, any, any, any>;
export type AnyLayoutDefinition = LayoutDefinition<any, any, any>;
export type AnyRouteSlotDefinition = RouteSlotDefinition<any, any>;
export type AnyRouteContributionDefinition = RouteContributionDefinition<any, any, any>;

export type NavigationEntry =
  | AnyRouteDefinition
  | AnyLayoutDefinition
  | AnyRouteSlotDefinition;
export type NavigationTree = readonly NavigationEntry[];