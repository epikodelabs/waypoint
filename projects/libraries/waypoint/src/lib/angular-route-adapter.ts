import {
  ApplicationRef,
  EnvironmentInjector,
  runInInjectionContext,
  type Type,
} from '@angular/core';

import { runWithInjector, unwrapDefault } from './adapter-utils';
import { createRouteRegistry } from './route-compiler';

import {
  composeAngularLeafRouteView,
  composeAngularRouteView,
  type ResolvedRouteView,
} from './route-renderer';

import type {
  FramePrepareFn,
  FrameAfterEnterFn,
  FrameBeforeLeaveFn,
  FrameView,
  LayoutDefinition,
  RenderableRoute,
} from './navigation-definitions';

import {
  ROUTE,
  ROUTE_CONTEXT,
} from './router-contract';

import {
  parseParamsRecord,
  parseQueryRecord,
} from './query-schema';

import {
  type CanActivateFn,
  type NavigationTransitionFn,
  type NavigationTransitionDefinition,
  type ParseRouteParams,
  type ParseRouteQuery,
  type PrepareRouteDataFn,
  type Route,
  type RenderableRoute as RuntimeRenderableRoute,
} from './vanilla-router';

type RouteRegistry = ReturnType<typeof createRouteRegistry>;
type CompiledRouteGroup = RouteRegistry['groups'][number];
type CompiledRoute = CompiledRouteGroup['primary'];

const lazyComponents = new WeakMap<object, Promise<Type<unknown>>>();

function loadComponent(
  owner: LayoutDefinition | RenderableRoute,
): Promise<Type<unknown>> {
  if (owner.component) {
    return Promise.resolve(owner.component);
  }

  if (!owner.loadComponent) {
    return Promise.reject(
      new Error('A route view must define component or loadComponent.'),
    );
  }

  let pending = lazyComponents.get(owner);

  if (!pending) {
    pending = Promise.resolve(owner.loadComponent())
      .then((value) =>
        unwrapDefault<Type<unknown>>(
          value as Type<unknown> | { readonly default: Type<unknown> },
        ),
      )
      .then((component) => {
        if (!component) {
          throw new Error('Lazy component loader returned no component.');
        }

        return component;
      })
      .catch((error) => {
        lazyComponents.delete(owner);
        throw error;
      });

    lazyComponents.set(owner, pending);
  }

  return pending;
}

function adaptFrameBeforeEnter(
  handler: CanActivateFn,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) =>
    runWithInjector(injector, handler, {
      ...transition.to,
      signal: transition.signal,
    });
}

function adaptFrameBeforeLeave(
  handler: FrameBeforeLeaveFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) => {
    if (!transition.from) {
      return true;
    }

    return runWithInjector(injector, handler, {
      ...transition.from,
      nextUrl: transition.to.url,
      signal: transition.signal,
    });
  };
}

function adaptFramePrepare(
  handler: FramePrepareFn,
  injector: EnvironmentInjector,
): PrepareRouteDataFn {
  return (route) => runWithInjector(injector, handler, route);
}

function adaptFrameAfterEnter(
  handler: FrameAfterEnterFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) =>
    runWithInjector(injector, handler, transition.to);
}

function collectLayoutFrames(
  layouts: readonly LayoutDefinition[],
): readonly FrameView<any>[] {
  return layouts
    .map((layout) => layout.frame)
    .filter((frame): frame is FrameView<any> => !!frame);
}

function collectEnterFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  return Object.freeze([
    ...collectLayoutFrames(layouts),
    ...(route.frame ? [route.frame] : []),
  ]);
}

function collectLeaveFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  return Object.freeze([
    ...(route.frame ? [route.frame] : []),
    ...[...collectLayoutFrames(layouts)].reverse(),
  ]);
}

function adaptFramePreparers(
  frames: readonly FrameView<any>[],
  injector: EnvironmentInjector,
): readonly PrepareRouteDataFn[] | undefined {
  const handlers = frames.flatMap(
    (frame) =>
      frame.prepare?.map((handler) =>
        adaptFramePrepare(handler, injector),
      ) ?? [],
  );

  return handlers.length > 0
    ? Object.freeze(handlers)
    : undefined;
}

export function adaptFrameTransitions(
  groups: readonly CompiledRouteGroup[],
  injector: EnvironmentInjector,
): readonly NavigationTransitionDefinition[] {
  const transitions: NavigationTransitionDefinition[] = [];

  for (const group of groups) {
    const primaryRoute = group.primary.route;

    if (primaryRoute.kind === 'redirect') {
      continue;
    }

    const enterFrames = collectEnterFrames(
      group.primary.layouts,
      primaryRoute,
    );
    const leaveFrames = collectLeaveFrames(
      group.primary.layouts,
      primaryRoute,
    );

    for (const frame of enterFrames) {
      if (!frame.beforeEnter?.length && !frame.afterEnter?.length) {
        continue;
      }

      transitions.push({
        to: (route) => route?.config.sourceRoute === primaryRoute,
        beforeEnter: frame.beforeEnter?.map((handler) =>
          adaptFrameBeforeEnter(handler, injector),
        ),
        afterEnter: frame.afterEnter?.map((handler) =>
          adaptFrameAfterEnter(handler, injector),
        ),
      });
    }

    for (const frame of leaveFrames) {
      if (!frame.beforeLeave?.length) {
        continue;
      }

      transitions.push({
        from: (route) => route?.config.sourceRoute === primaryRoute,
        beforeLeave: frame.beforeLeave.map((handler) =>
          adaptFrameBeforeLeave(handler, injector),
        ),
      });
    }
  }

  return transitions;
}

function adaptParamsParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): ParseRouteParams | undefined {
  const schema = route.paramsSchema;
  if (!schema) return undefined;

  return (params, _url, _signal) =>
    runInInjectionContext(
      injector,
      () => Promise.resolve(parseParamsRecord(schema, params)),
    );
}

function adaptQueryParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): ParseRouteQuery | undefined {
  const schema = route.querySchema;
  if (!schema) return undefined;

  return (url, _signal) =>
    runInInjectionContext(
      injector,
      () => Promise.resolve(parseQueryRecord(schema, url)),
    );
}

async function resolveViews(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): Promise<readonly ResolvedRouteView[]> {
  const resolvedLayouts = await Promise.all(
    layouts.map(async (layout, index) => ({
      component: await loadComponent(layout),
      providers: (layout.providers ?? [])
        .flat()
        .filter((provider) => provider),
      label: `LayoutDefinition(${layout.path || index})`,
    })),
  );

  return Object.freeze([
    ...resolvedLayouts,
    {
      component: await loadComponent(route),
      providers: (route.providers ?? [])
        .flat()
        .filter((provider) => provider),
      label: `RouteDefinition(${route.path})`,
    },
  ]);
}

function adaptRenderableRoute(
  compiled: CompiledRoute,
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): RuntimeRenderableRoute {
  const { route, path, layouts } = compiled;

  if (route.kind !== 'route') {
    throw new Error(
      `Expected a renderable route for "${path}".`,
    );
  }
  const tokens = {
    routeToken: ROUTE,
    contextToken: ROUTE_CONTEXT,
  } as const;

  return {
    kind: 'route',
    name: route.name,
    path,
    outlet: route.outlet,
    sourceRoute: route,
    data: route.data ? { ...route.data } : undefined,
    preload: route.preload,
    viewTransition: route.viewTransition,

    load: async () => {
      const views = await resolveViews(layouts, route);

      return {
        component: route.outlet
          ? composeAngularLeafRouteView(
              appRef,
              documentRef,
              injector,
              tokens,
              views,
            )
          : composeAngularRouteView(
              appRef,
              documentRef,
              injector,
              tokens,
              views,
            ),
        prepare: [
          ...(sharedPreparers ?? []),
          ...(adaptFramePreparers(
            route.frame ? [route.frame] : [],
            injector,
          ) ?? []),
        ],
        parseParams: adaptParamsParser(route, injector),
        parseQuery: adaptQueryParser(route, injector),
      };
    },
  };
}

function adaptCompiledRoute(
  compiled: CompiledRoute,
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route {
  if (compiled.route.kind === 'route') {
    return adaptRenderableRoute(
      compiled,
      sharedPreparers,
      appRef,
      documentRef,
      injector,
    );
  }

  const redirectTo = compiled.redirectTo;

  if (redirectTo === undefined) {
    throw new Error(
      `Compiled redirect "${compiled.path}" has no target.`,
    );
  }

  return {
    kind: 'redirect',
    name: compiled.route.name,
    path: compiled.path,
    sourceRoute: compiled.route,
    redirectTo,
    data: compiled.route.data
      ? { ...compiled.route.data }
      : undefined,
  };
}

export function adaptRoutes(
  groups: readonly CompiledRouteGroup[],
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route[] {
  return groups.map((group): Route => {
    const sharedPreparers = adaptFramePreparers(
      collectLayoutFrames(group.primary.layouts),
      injector,
    );

    if (group.primary.route.kind === 'redirect') {
      return adaptCompiledRoute(
        group.primary,
        sharedPreparers,
        appRef,
        documentRef,
        injector,
      );
    }

    const primary = adaptRenderableRoute(
      group.primary,
      sharedPreparers,
      appRef,
      documentRef,
      injector,
    );

    if (group.outlets.length === 0) {
      return primary;
    }

    return {
      ...primary,
      outlets: Object.freeze(
        group.outlets.map((compiled) =>
          adaptRenderableRoute(
            compiled,
            sharedPreparers,
            appRef,
            documentRef,
            injector,
          ),
        ),
      ),
    };
  });
}
