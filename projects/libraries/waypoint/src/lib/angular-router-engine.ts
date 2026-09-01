import type {
  ApplicationRef,
  EnvironmentInjector,
} from '@angular/core';

import {
  adaptFrameTransitions,
  adaptRoutes,
} from './angular-route-adapter';

import type {
  RouteRegistry,
} from './resolved-navigation';

import {
  OUTLET_ACTIVATE_EVENT,
  dispatchOutletLifecycleEvent,
} from './router-events';

import {
  createRouter,
  type PreloadingStrategy,
  type Router as VanillaRouter,
  type RouterState,
  type ScrollRestorationMode,
  type ViewTransitionsOption,
} from './vanilla-router';

export interface AngularRouterEngineOptions {
  readonly registry: RouteRegistry;
  readonly appRef: ApplicationRef;
  readonly injector: EnvironmentInjector;
  readonly document: Document;
  readonly baseHref: string;
  readonly enableTracing?: boolean;
  readonly maxRedirects?: number;
  readonly onSameUrlNavigation?: 'ignore';
  readonly scrollRestoration?: ScrollRestorationMode;
  readonly preloading?: PreloadingStrategy;
  readonly viewTransitions?: ViewTransitionsOption;
  readonly getOutlet: (
    name: string,
  ) => HTMLElement | null;
  readonly hasOutlet: (
    name: string,
  ) => boolean;
  readonly shouldRecoverNotFound: (
    url: URL,
  ) => boolean;
  readonly recoverNotFound: (
    url: URL,
  ) => void;
  readonly onStateChange: (
    state: RouterState,
  ) => void;
}

export function createAngularRouterEngine(
  options: AngularRouterEngineOptions,
): VanillaRouter {
  return createRouter({
    routes: adaptRoutes(
      options.registry.groups,
      options.appRef,
      options.document,
      options.injector,
    ),

    baseHref: options.baseHref,
    enableTracing: options.enableTracing,
    maxRedirects: options.maxRedirects,
    onSameUrlNavigation: options.onSameUrlNavigation,
    scrollRestoration: options.scrollRestoration,
    preloading: options.preloading,

    transitions: [
      ...adaptFrameTransitions(
        options.registry.groups,
        options.injector,
      ),
    ],

    viewTransitions: options.viewTransitions,

    render: (targetName, node) => {
      const target = options.getOutlet(targetName);

      if (!target) {
        throw new Error(
          `Router outlet "${targetName}" is not connected.`,
        );
      }

      replaceChildNodes(target, node);
    },

    commit: (outlets) => {
      for (const outlet of outlets) {
        if (!options.hasOutlet(outlet.name)) {
          throw new Error(
            `Router outlet "${outlet.name}" is not connected.`,
          );
        }
      }

      for (const outlet of outlets) {
        const target = options.getOutlet(outlet.name);

        if (!target) {
          throw new Error(
            `Router outlet "${outlet.name}" is not connected.`,
          );
        }

        replaceChildNodes(target, outlet.node);
        dispatchOutletLifecycleEvent(
          target,
          OUTLET_ACTIVATE_EVENT,
          outlet.component,
        );
      }
    },

    renderNotFound: (targetName, url) => {
      const target = options.getOutlet(targetName);

      if (!target) {
        return;
      }

      const heading =
        options.document.createElement('h1');
      heading.textContent = '404 — Page Not Found';
      replaceChildNodes(target, heading);

      if (options.shouldRecoverNotFound(url)) {
        options.recoverNotFound(url);
      }
    },

    renderError: (targetName) => {
      const target = options.getOutlet(targetName);

      if (!target) {
        return;
      }

      const heading =
        options.document.createElement('h1');
      heading.textContent = 'Page failed to load';
      replaceChildNodes(target, heading);
    },

    onStateChange: options.onStateChange,

    onOutletActivate: (target, component) => {
      dispatchOutletLifecycleEvent(
        target,
        OUTLET_ACTIVATE_EVENT,
        component,
      );
    },
  });
}

export function replaceAngularRouterConfiguration(
  engine: VanillaRouter,
  registry: RouteRegistry,
  appRef: ApplicationRef,
  document: Document,
  injector: EnvironmentInjector,
): void {
  engine.replaceConfiguration({
    routes: adaptRoutes(
      registry.groups,
      appRef,
      document,
      injector,
    ),
    transitions: adaptFrameTransitions(
      registry.groups,
      injector,
    ),
  });
}

export function renderRouterStartupError(
  document: Document,
  outlet: HTMLElement | null,
  error: unknown,
): void {
  console.error(
    'Waypoint router startup failed.',
    error,
  );

  if (!outlet) {
    return;
  }

  const container =
    document.createElement('section');
  container.setAttribute(
    'data-waypoint-startup-error',
    '',
  );

  const heading = document.createElement('h1');
  heading.textContent = 'Page failed to load';

  const details = document.createElement('pre');
  details.textContent =
    error instanceof Error
      ? error.message
      : String(error);

  container.append(heading, details);
  replaceChildNodes(outlet, container);
}

function replaceChildNodes(
  target: Node & {
    replaceChildren?: (
      ...nodes: Node[]
    ) => void;
    firstChild: ChildNode | null;
    removeChild(node: ChildNode): void;
    appendChild<T extends Node>(node: T): T;
  },
  ...nodes: Node[]
): void {
  if (typeof target.replaceChildren === 'function') {
    target.replaceChildren(...nodes);
    return;
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  for (const node of nodes) {
    target.appendChild(node);
  }
}
