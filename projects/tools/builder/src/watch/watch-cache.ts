import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import type {
  PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';

export interface CachedWaypointGeneration {
  readonly fingerprint: string;
  readonly analysis: WaypointAnalysis;
  readonly build: PreparedWaypointBuild;
}

export class WaypointWatchCache {
  #current: CachedWaypointGeneration | undefined;

  get(
    fingerprint: string,
  ): CachedWaypointGeneration | undefined {
    return this.#current?.fingerprint === fingerprint
      ? this.#current
      : undefined;
  }

  replace(
    next: CachedWaypointGeneration,
  ): CachedWaypointGeneration | undefined {
    const previous = this.#current;
    this.#current = next;
    return previous;
  }

  take(): CachedWaypointGeneration | undefined {
    const current = this.#current;
    this.#current = undefined;
    return current;
  }
}
