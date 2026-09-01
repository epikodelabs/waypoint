import type { Type } from '@angular/core';

import type { ParamSchemaRecord, QuerySchemaRecord } from './query-schema';
import type {
  FrameHooks,
  FramePrepareFn,
  FrameView,
  HookList,
  InferPreparedData,
  LayoutDefinition,
  LayoutOptions,
  Lazy,
  NavigationTree,
  RedirectRouteDefinition,
  RenderableRoute,
  RouteOptions,
  View,
  ViewDefinition,
} from './navigation-definitions';

function isFrame(value: unknown): value is FrameView<any> {
  return typeof value === 'object'
    && value !== null
    && 'kind' in value
    && value.kind === 'frame';
}

function isAngularType(value: unknown): value is Type<unknown> {
  return typeof value === 'function'
    && ('ɵcmp' in value || 'ɵdir' in value || /^class\s/.test(Function.prototype.toString.call(value)));
}

function asArray<T>(value: HookList<T> | undefined): readonly T[] | undefined {
  if (value === undefined) return undefined;
  return Object.freeze(Array.isArray(value) ? [...value] : [value]);
}

type ViewRecord<TFrame extends FrameView<any> | undefined = FrameView<any> | undefined> =
  ViewDefinition & { readonly frame?: TFrame };

function createViewRecord(view: View | FrameView<any>): ViewRecord {
  if (isFrame(view)) {
    return 'component' in view && view.component !== undefined
      ? { component: view.component, frame: view }
      : { loadComponent: view.loadComponent, frame: view };
  }

  return isAngularType(view)
    ? { component: view, frame: undefined }
    : { loadComponent: view as Lazy<Type<unknown>>, frame: undefined };
}

function normalizeFrame<TPrepare extends HookList<FramePrepareFn> | undefined>(
  view: View | FrameView<any>,
  hooks: FrameHooks<TPrepare>,
): ViewRecord<FrameView<InferPreparedData<TPrepare>> | undefined> {
  const existing = createViewRecord(view);
  const beforeEnter = asArray(hooks.beforeEnter);
  const beforeLeave = asArray(hooks.beforeLeave);
  const prepare = asArray(hooks.prepare);
  const afterEnter = asArray(hooks.afterEnter);
  const hasHooks = !!(beforeEnter?.length || beforeLeave?.length || prepare?.length || afterEnter?.length);

  if (!hasHooks) return existing as ViewRecord<undefined>;

  const hooksRecord = {
    beforeEnter,
    beforeLeave,
    prepare,
    afterEnter,
  };

  const frameView: FrameView<any> = existing.component !== undefined
    ? { kind: 'frame', component: existing.component, ...hooksRecord }
    : { kind: 'frame', loadComponent: existing.loadComponent!, ...hooksRecord };

  return {
    ...existing,
    frame: frameView,
  };
}

export function frame<
  const TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
>(
  view: View,
  hooks: FrameHooks<TPrepare> = {},
): FrameView<InferPreparedData<TPrepare>> {
  const record = createViewRecord(view);
  return {
    kind: 'frame',
    ...record,
    beforeEnter: asArray(hooks.beforeEnter),
    beforeLeave: asArray(hooks.beforeLeave) as any,
    prepare: asArray(hooks.prepare),
    afterEnter: asArray(hooks.afterEnter) as any,
  } as FrameView<InferPreparedData<TPrepare>>;
}

type AuthoredFrame<
  TView,
  TPrepare extends HookList<FramePrepareFn> | undefined,
> = TPrepare extends HookList<FramePrepareFn>
  ? FrameView<InferPreparedData<TPrepare>>
  : TView extends FrameView<any>
    ? TView
    : undefined;

export function route<
  const TPath extends string,
  const TView extends View | FrameView<any>,
  const TName extends string | undefined = undefined,
  const TParams extends ParamSchemaRecord | undefined = undefined,
  const TQuery extends QuerySchemaRecord | undefined = undefined,
  const TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
>(
  path: TPath,
  view: TView,
  options: RouteOptions<TName, TParams, TQuery, TPrepare> = {},
): RenderableRoute<TPath, TName, TParams, TQuery, AuthoredFrame<TView, TPrepare>> {
  const {
    beforeEnter,
    beforeLeave,
    prepare,
    afterEnter,
    ...routeOptions
  } = options;

  return {
    kind: 'route',
    path,
    ...normalizeFrame(view, { beforeEnter, beforeLeave, prepare, afterEnter }),
    ...routeOptions,
  } as RenderableRoute<TPath, TName, TParams, TQuery, AuthoredFrame<TView, TPrepare>>;
}

export function redirect<
  const TPath extends string,
  const TRedirectTo extends string,
  const TName extends string | undefined = undefined,
>(
  path: TPath,
  redirectTo: TRedirectTo,
  options: Pick<RouteOptions<TName, undefined, undefined>, 'name' | 'data' | 'providers' | 'policy'> = {},
): RedirectRouteDefinition<TPath, TName> {
  return { kind: 'redirect', path, redirectTo, ...options };
}

export function layout<
  const TPath extends string,
  const TView extends View | FrameView<any>,
  const TEntries extends NavigationTree,
  const TPrepare extends HookList<FramePrepareFn> | undefined =
    HookList<FramePrepareFn> | undefined,
>(
  path: TPath,
  view: TView,
  entries: TEntries,
  options: LayoutOptions<TPrepare> = {},
): LayoutDefinition<TPath, TEntries, AuthoredFrame<TView, TPrepare>> {
  const { beforeEnter, beforeLeave, prepare, afterEnter, ...layoutOptions } = options;
  return {
    kind: 'layout',
    path,
    ...normalizeFrame(view, { beforeEnter, beforeLeave, prepare, afterEnter }),
    entries,
    ...layoutOptions,
  } as LayoutDefinition<TPath, TEntries, AuthoredFrame<TView, TPrepare>>;
}
