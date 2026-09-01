import {
  type ApplicationRef,
  type EnvironmentInjector,
  type PendingTasks,
} from '@angular/core';

import {
  createAngularRouterEngine,
  renderRouterStartupError,
  replaceAngularRouterConfiguration,
} from './angular-router-engine';

import type {
  RouteRegistry,
} from './resolved-navigation';

import {
  getRouterLocation,
} from './router-url';

import type {
  PreloadingStrategy,
  Router as VanillaRouter,
  RouterState,
  ScrollRestorationMode,
  ViewTransitionsOption,
} from './vanilla-router';

const EMPTY_ROUTER_STATE: RouterState = Object.freeze({
  current: null,
  pending: false,
  phase: null,
  error: null,
  path: '',
  params: Object.freeze({}),
  query: Object.freeze({}),
  data: Object.freeze({}),
  historyState: null,
  routeConfig: null,
});

export interface AngularRouterRuntimeOptions {
  readonly appRef: ApplicationRef;
  readonly injector: EnvironmentInjector;
  readonly document: Document;
  readonly pendingTasks: PendingTasks;
  readonly baseHref: string;
  readonly enableTracing?: boolean;
  readonly maxRedirects?: number;
  readonly onSameUrlNavigation?: 'ignore';
  readonly scrollRestoration?: ScrollRestorationMode;
  readonly preloading?: PreloadingStrategy;
  readonly viewTransitions?: ViewTransitionsOption;
  readonly registry: () => RouteRegistry;
  readonly prepareStartup: (url: URL) => Promise<void>;
  readonly shouldRecoverNotFound: (url: URL) => boolean;
  readonly recoverNotFound: (url: URL) => Promise<void>;
}

export class AngularRouterRuntime {
  private engine: VanillaRouter | null = null;
  private startupTask: Promise<void> | null = null;
  private currentState: RouterState = EMPTY_ROUTER_STATE;
  private readonly outlets =
    new Map<string, HTMLElement[]>();
  private readonly notFoundRecoveryTasks =
    new Map<string, Promise<void>>();
  private tickQueued = false;

  constructor(
    private readonly options:
      AngularRouterRuntimeOptions,
  ) {}

  get active(): boolean {
    return this.engine !== null;
  }

  get state(): RouterState {
    return this.currentState;
  }

  connect(
    name: string,
    outlet: HTMLElement,
  ): void {
    const outletName = name.trim();
    const registered =
      this.outlets.get(outletName) ?? [];

    if (registered.includes(outlet)) {
      return;
    }

    registered.push(outlet);
    this.outlets.set(outletName, registered);

    if (this.engine || this.startupTask) {
      return;
    }

    this.start();
  }

  disconnect(
    name: string,
    outlet: HTMLElement,
  ): boolean {
    const outletName = name.trim();
    const registered =
      this.outlets.get(outletName);

    if (!registered) {
      return false;
    }

    const index =
      registered.lastIndexOf(outlet);

    if (index < 0) {
      return false;
    }

    registered.splice(index, 1);

    if (registered.length === 0) {
      this.outlets.delete(outletName);
    }

    return this.outlets.size === 0;
  }

  requireEngine(): VanillaRouter {
    if (!this.engine) {
      throw new Error(
        'Router has no active outlet.',
      );
    }

    return this.engine;
  }

  async requireStartedEngine():
    Promise<VanillaRouter> {
    if (!this.engine && this.startupTask) {
      await this.startupTask;
    }

    return this.requireEngine();
  }

  async install(
    registry: RouteRegistry,
    options: Readonly<{
      revalidate?: boolean;
    }> = {},
  ): Promise<boolean> {
    const engine = this.engine;

    if (!engine) {
      return false;
    }

    replaceAngularRouterConfiguration(
      engine,
      registry,
      this.options.appRef,
      this.options.document,
      this.options.injector,
    );

    if (options.revalidate === false) {
      return true;
    }

    return engine.revalidate();
  }

  recordError(error: unknown): void {
    const state = this.engine
      ? snapshotRouterState(this.engine.state)
      : this.currentState;

    this.currentState = Object.freeze({
      ...state,
      error,
    });

    this.requestTick();
  }

  dispose(): void {
    const engine = this.engine;

    this.startupTask = null;
    this.notFoundRecoveryTasks.clear();
    this.engine = null;
    this.outlets.clear();

    engine?.dispose();

    this.currentState = EMPTY_ROUTER_STATE;
    this.requestTick();
  }

  private start(): void {
    let task!: Promise<void>;

    const startup = async (): Promise<void> => {
      const location =
        getRouterLocation(
          this.options.document,
        );
      const url = new URL(location.href);

      await this.options.prepareStartup(url);

      if (
        this.startupTask !== task
        || this.engine
        || this.outlets.size === 0
      ) {
        return;
      }

      const engine = this.createEngine();

      try {
        engine.start();
      } catch (error) {
        engine.dispose();
        throw error;
      }

      if (this.startupTask !== task) {
        engine.dispose();
        return;
      }

      this.engine = engine;
      this.currentState =
        snapshotRouterState(engine.state);
      this.requestTick();
    };

    const completePendingTask =
      this.options.pendingTasks.add();

    task = Promise.resolve()
      .then(startup)
      .finally(completePendingTask);

    this.startupTask = task;

    void task
      .catch((error) => {
        if (this.startupTask !== task) {
          return;
        }

        this.recordError(error);

        renderRouterStartupError(
          this.options.document,
          this.getOutlet(''),
          error,
        );
      })
      .finally(() => {
        if (this.startupTask === task) {
          this.startupTask = null;
        }
      });
  }

  private createEngine(): VanillaRouter {
    return createAngularRouterEngine({
      registry: this.options.registry(),
      appRef: this.options.appRef,
      injector: this.options.injector,
      document: this.options.document,
      baseHref: this.options.baseHref,
      enableTracing:
        this.options.enableTracing,
      maxRedirects:
        this.options.maxRedirects,
      onSameUrlNavigation:
        this.options.onSameUrlNavigation,
      scrollRestoration:
        this.options.scrollRestoration,
      preloading:
        this.options.preloading,
      viewTransitions:
        this.options.viewTransitions,
      getOutlet: (name) =>
        this.getOutlet(name),
      hasOutlet: (name) =>
        this.outlets.has(name.trim()),
      shouldRecoverNotFound: (url) =>
        this.options.shouldRecoverNotFound(url),
      recoverNotFound: (url) =>
        this.scheduleNotFoundRecovery(url),
      onStateChange: (state) => {
        this.currentState =
          snapshotRouterState(state);
        this.requestTick();
      },
    });
  }

  private scheduleNotFoundRecovery(
    url: URL,
  ): void {
    const key = url.href;

    if (
      this.notFoundRecoveryTasks.has(key)
    ) {
      return;
    }

    let task!: Promise<void>;

    task = Promise.resolve()
      .then(() =>
        this.options.recoverNotFound(url),
      )
      .catch((error) => {
        this.recordError(error);
      })
      .finally(() => {
        if (
          this.notFoundRecoveryTasks.get(key)
          === task
        ) {
          this.notFoundRecoveryTasks.delete(
            key,
          );
        }
      });

    this.notFoundRecoveryTasks.set(
      key,
      task,
    );
  }

  private getOutlet(
    name: string,
  ): HTMLElement | null {
    const registered =
      this.outlets.get(name.trim());

    return registered?.[
      registered.length - 1
    ] ?? null;
  }

  private requestTick(): void {
    if (this.tickQueued) {
      return;
    }

    this.tickQueued = true;

    queueMicrotask(() => {
      this.tickQueued = false;

      if (!this.engine) {
        return;
      }

      this.options.appRef.tick();
    });
  }
}

function snapshotRouterState(
  state: RouterState,
): RouterState {
  return Object.freeze({
    current: state.current ?? null,
    pending: state.pending ?? false,
    phase: state.phase ?? null,
    error: state.error ?? null,
    path: state.path ?? '',
    params: state.params
      ? Object.freeze({
          ...state.params,
        })
      : Object.freeze({}),
    query: state.query
      ? Object.freeze({
          ...state.query,
        })
      : Object.freeze({}),
    data: state.data
      ? Object.freeze({
          ...state.data,
        })
      : Object.freeze({}),
    historyState:
      state.historyState ?? null,
    routeConfig:
      state.routeConfig ?? null,
  });
}
