import type {
  RouteResolution,
} from './resolved-navigation';

import {
  ResolvedNavigationState,
} from './resolved-navigation';

export type RouteResolver = (
  url: URL,
  context: Readonly<{
    signal: AbortSignal;
  }>,
) => Promise<RouteResolution>;

export interface ResolveRouteOptions {
  readonly force?: boolean;
}

export class RouteResolutionCoordinator {
  private readonly pending =
    new Map<string, Promise<boolean>>();
  private readonly controllers =
    new Map<string, AbortController>();
  private readonly unresolved =
    new Set<string>();
  private currentGeneration = 0;

  constructor(
    private readonly state: ResolvedNavigationState,
    private readonly resolveRoute?: RouteResolver,
  ) {}

  get generation(): number {
    return this.currentGeneration;
  }

  hasResolver(): boolean {
    return !!this.resolveRoute;
  }

  invalidate(options: Readonly<{
    resetState?: boolean;
  }> = {}): void {
    this.currentGeneration++;

    if (options.resetState) {
      this.state.reset();
    }

    this.unresolved.clear();
    this.abort();
    this.pending.clear();
  }

  abort(exceptKey?: string): void {
    for (const [key, controller] of this.controllers) {
      if (key === exceptKey) {
        continue;
      }

      controller.abort();
      this.controllers.delete(key);
    }
  }

  async resolve(
    url: URL,
    key: string,
    options: ResolveRouteOptions = {},
  ): Promise<boolean> {
    const resolver = this.resolveRoute;

    if (!resolver) {
      return false;
    }

    if (!options.force && this.state.matchesPath(key)) {
      return false;
    }

    if (!options.force && this.unresolved.has(key)) {
      return false;
    }

    const existing = this.pending.get(key);

    if (existing && !options.force) {
      return existing;
    }

    if (options.force) {
      this.controllers.get(key)?.abort();
    }

    const controller = new AbortController();
    this.controllers.set(key, controller);
    const generation = this.currentGeneration;

    let task!: Promise<boolean>;
    task = Promise.resolve(
      resolver(url, {
        signal: controller.signal,
      }),
    )
      .then((resolved) => {
        if (
          controller.signal.aborted
          || generation !== this.currentGeneration
        ) {
          return false;
        }

        if (!resolved || !this.state.merge(resolved)) {
          this.unresolved.add(key);
          return false;
        }

        this.unresolved.delete(key);
        return true;
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }

        // Transport/import failure is not proof that a route is absent.
        // Do not poison the negative cache.
        throw error;
      })
      .finally(() => {
        if (this.pending.get(key) === task) {
          this.pending.delete(key);
        }

        if (this.controllers.get(key) === controller) {
          this.controllers.delete(key);
        }
      });

    this.pending.set(key, task);
    return task;
  }
}
