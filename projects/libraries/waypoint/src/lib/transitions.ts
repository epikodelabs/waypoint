import type { ActivatedRoute } from './vanilla-router';
import type {
  AnyStreamixRoute,
  MaybePromise,
} from './route-types';
import type {
  InferRouteParams,
  InferRouteQuery,
} from './typed-routes';

export type TransitionDecision =
  | void
  | boolean
  | string
  | URL
  | {
      readonly redirectTo: string | URL;
      readonly replace?: boolean;
    };

export interface RouteSnapshot<
  TRoute extends AnyStreamixRoute = AnyStreamixRoute,
> {
  readonly route: TRoute;
  readonly path: string;
  readonly params: InferRouteParams<TRoute>;
  readonly query: InferRouteQuery<TRoute>;
  readonly data: Readonly<Record<string, unknown>>;
  readonly historyState: unknown;
  readonly url: URL;
}

export type TransitionRouteTarget =
  | AnyStreamixRoute
  | '*';

type FromSnapshot<
  TFrom extends TransitionRouteTarget | undefined,
> =
  TFrom extends AnyStreamixRoute
    ? RouteSnapshot<TFrom>
    : RouteSnapshot<AnyStreamixRoute> | null;

type ToSnapshot<
  TTo extends TransitionRouteTarget | undefined,
> =
  TTo extends AnyStreamixRoute
    ? RouteSnapshot<TTo>
    : RouteSnapshot<AnyStreamixRoute>;

export interface RouteTransition<
  TFrom extends TransitionRouteTarget | undefined = undefined,
  TTo extends TransitionRouteTarget | undefined = undefined,
> {
  readonly from: FromSnapshot<TFrom>;
  readonly to: ToSnapshot<TTo>;
  readonly signal: AbortSignal;
}

export type TransitionFn<
  TFrom extends TransitionRouteTarget | undefined = undefined,
  TTo extends TransitionRouteTarget | undefined = undefined,
> = (
  transition: RouteTransition<
    TFrom,
    TTo
  >,
) => MaybePromise<TransitionDecision>;

export interface RouteTransitionDefinition<
  TFrom extends TransitionRouteTarget | undefined = undefined,
  TTo extends TransitionRouteTarget | undefined = undefined,
> {
  readonly from?: TFrom;
  readonly to?: TTo;
  readonly beforeEnter?: readonly TransitionFn<TFrom, TTo>[];
  readonly prepare?: readonly TransitionFn<TFrom, TTo>[];
  readonly beforeLeave?: readonly TransitionFn<TFrom, TTo>[];
  readonly afterEnter?: readonly TransitionFn<TFrom, TTo>[];
}

export type AnyRouteTransitionDefinition =
  RouteTransitionDefinition<any, any>;

export function transition<
  const TFrom extends TransitionRouteTarget | undefined = undefined,
  const TTo extends TransitionRouteTarget | undefined = undefined,
>(
  definition: RouteTransitionDefinition<
    TFrom,
    TTo
  >,
): RouteTransitionDefinition<
  TFrom,
  TTo
> {
  return definition;
}

export function defineTransitions<
  const TTransitions extends readonly AnyRouteTransitionDefinition[],
>(
  transitions: TTransitions,
): TTransitions {
  return transitions;
}

export function matchesTransitionTarget(
  target: TransitionRouteTarget | undefined,
  route: ActivatedRoute | null,
): boolean {
  if (!target || target === '*') {
    return true;
  }

  return route?.config.sourceRoute === target
    || route?.config.path === target.path;
}
