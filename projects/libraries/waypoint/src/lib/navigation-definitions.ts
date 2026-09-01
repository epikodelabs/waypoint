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
export type View = Type<unknown> | Lazy<Type<unknown>>;

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
> = (context: NavigationContext) => MaybePromise<TResult>;

type AwaitedPrepareResult<TPrepare> =
  TPrepare extends (...args: never[]) => infer TResult
    ? Exclude<Awaited<TResult>, void>
    : never;

type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends
    (value: infer TIntersection) => void ? TIntersection : never;

type Simplify<T> = { readonly [TKey in keyof T]: T[TKey] };

export type HookList<T> = T | readonly T[];

export type InferPreparedData<
  TPrepare extends HookList<FramePrepareFn> | undefined,
> = [TPrepare] extends [HookList<FramePrepareFn>]
  ? [AwaitedPrepareResult<
      TPrepare extends readonly FramePrepareFn[] ? TPrepare[number] : TPrepare
    >] extends [never]
    ? EmptyRouteData
    : Simplify<UnionToIntersection<AwaitedPrepareResult<
        TPrepare extends readonly FramePrepareFn[] ? TPrepare[number] : TPrepare
      >>>
  : EmptyRouteData;

export type FrameAfterEnterFn<TData extends RouteData = RouteData> =
  (route: ActivatedRoute<TData>) => MaybePromise<void>;

export type FrameBeforeLeaveFn<TData extends RouteData = RouteData> =
  (route: DeactivationContext<TData>) => MaybePromise<GuardResult>;

export interface FrameHooks<
  TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
> {
  readonly beforeEnter?: HookList<RouterCanActivateFn>;
  readonly beforeLeave?: HookList<FrameBeforeLeaveFn<InferPreparedData<TPrepare>>>;
  readonly prepare?: TPrepare;
  readonly afterEnter?: HookList<FrameAfterEnterFn<InferPreparedData<TPrepare>>>;
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

export type FrameView<TData extends RouteData = EmptyRouteData> =
  ViewDefinition & {
    readonly kind: 'frame';
    readonly beforeEnter?: readonly RouterCanActivateFn[];
    readonly beforeLeave?: readonly FrameBeforeLeaveFn<TData>[];
    readonly prepare?: readonly FramePrepareFn[];
    readonly afterEnter?: readonly FrameAfterEnterFn<TData>[];
  };

export type InferFrameData<TFrame> =
  TFrame extends FrameView<infer TData> ? TData : EmptyRouteData;

export interface RouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
> {
  readonly path: TPath;
  readonly name?: TName;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly providers?: NavigationProviders;
  readonly policy?: RoutePolicy;
}

export type RouteOutlets = Readonly<Record<string, View | FrameView<any>>>;

export interface RenderableRouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParams extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuery extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
> extends RouteDefinitionBase<TPath, TName> {
  readonly kind: 'route';
  /** Internal compiled outlet identity. Use `outlets` when authoring routes. */
  readonly outlet?: string;
  readonly preload?: boolean;
  readonly viewTransition?: boolean;
  readonly params?: TParams;
  readonly query?: TQuery;
  readonly outlets?: RouteOutlets;
}

export type RouteOptions<
  TName extends string | undefined = string | undefined,
  TParams extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuery extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
> = Omit<
  RenderableRouteDefinitionBase<string, TName, TParams, TQuery>,
  'kind' | 'path'
> & FrameHooks<TPrepare>;

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
  TParams extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuery extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = RenderableRouteDefinitionBase<TPath, TName, TParams, TQuery> &
  ViewDefinition & {
    readonly frame?: TFrame;
    readonly redirectTo?: never;
  };

export type RouteDefinition<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParams extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuery extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> =
  | RedirectRouteDefinition<TPath, TName>
  | RenderableRoute<TPath, TName, TParams, TQuery, TFrame>;

export type InferRoutePreparedData<TRoute> =
  TRoute extends RenderableRoute<string, string | undefined, any, any, infer TFrame>
    ? TFrame extends FrameView<any> ? InferFrameData<TFrame> : EmptyRouteData
    : EmptyRouteData;

export interface LayoutDefinitionBase<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
> {
  readonly kind: 'layout';
  readonly path: TPath;
  readonly entries: TEntries;
  readonly providers?: NavigationProviders;
  readonly policy?: RoutePolicy;
}

export type LayoutOptions<
  TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
> = Omit<LayoutDefinitionBase, 'kind' | 'path' | 'entries'> & FrameHooks<TPrepare>;

export type LayoutDefinition<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = LayoutDefinitionBase<TPath, TEntries> &
  ViewDefinition & { readonly frame?: TFrame };

export type RouteContributionLoader<
  TContribution extends RouteContributionDefinition = RouteContributionDefinition,
> = Lazy<TContribution>;

export interface RouteSlotDefinition<
  TId extends string = string,
  TContribution extends RouteContributionDefinition = RouteContributionDefinition,
> {
  readonly kind: 'route-slot';
  readonly id: TId;
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
