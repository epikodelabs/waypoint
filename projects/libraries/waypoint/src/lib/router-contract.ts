import { InjectionToken } from '@angular/core';

import type { NavigationTarget } from './navigation-targets';
import type { NavigationTree } from './navigation-definitions';
import type { TypedHref, TypedNavigate } from './typed-navigation';
import type {
  ActivatedRoute,
  NavigationOptions,
  RouteRenderContext,
  RouterState,
} from './vanilla-router';

export interface RouterRevalidationOptions {
  /**
   * Removes every route and contribution previously installed through
   * server-driven resolution before revalidating the current URL.
   */
  readonly resetResolvedRoutes?: boolean;
}

export type RouterReloadReason =
  | 'reset'
  | 'principal-change';

export interface RouterReloadOptions {
  readonly reason?: RouterReloadReason;
  readonly target?: string;
}

export class RouterReloadError extends Error {
  constructor(public readonly status: number) {
    super(`Failed to reload the current Waypoint realm: ${status}.`);
    this.name = 'RouterReloadError';
  }
}

export const ROUTE = new InjectionToken<ActivatedRoute>('ROUTE');

export const ROUTE_CONTEXT = new InjectionToken<RouteRenderContext>('ROUTE_CONTEXT');

export abstract class Router<TRoutes extends NavigationTree = any> {
  abstract get active(): boolean;
  abstract get state(): RouterState;
  abstract get displayUrl(): string;

  abstract readonly navigateTo: TypedNavigate<TRoutes>;
  abstract readonly hrefTo: TypedHref<TRoutes>;

  abstract connect(name: string, outlet: HTMLElement): void;
  abstract disconnect(name: string, outlet: HTMLElement): void;
  abstract navigate(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean>;
  abstract href(target: NavigationTarget | null | undefined): string | null;
  abstract revalidate(options?: RouterRevalidationOptions): Promise<boolean>;
  abstract reload(options?: RouterReloadOptions): Promise<never>;
  abstract updateHistoryState(state: unknown): void;
  abstract preload(): Promise<void>;
  abstract dispose(): void;
}