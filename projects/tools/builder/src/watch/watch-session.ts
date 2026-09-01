import type {
  BuilderContext,
  BuilderOutput,
} from '@angular-devkit/architect';

import {
  analyze,
  type WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import {
  prepareBuild,
  type PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';
import {
  fingerprintFiles,
} from './dependency-fingerprint.js';
import {
  waypointAnalysisDependencies,
} from './watch-dependencies.js';
import {
  WaypointWatchCache,
} from './watch-cache.js';

export interface WaypointWatchOptions {
  readonly analysisOptions: Parameters<typeof analyze>[0];
  readonly metadataRoot: string;
}

export interface WatchGeneration {
  readonly number: number;
  readonly reused: boolean;
  readonly analysis: WaypointAnalysis;
  readonly build?: PreparedWaypointBuild;

  publish(): Promise<BuilderOutput>;
  dispose(): Promise<void>;
}

export interface WaypointWatchSession {
  nextGeneration(): Promise<WatchGeneration>;
  dispose(): Promise<void>;
}

/**
 * Persistent watch session with dependency-aware prepared-build reuse.
 *
 * After a successful analysis establishes Waypoint's authoritative dependency
 * set, host-only rebuilds can reuse the current prepared build instead of
 * repeating Angular AOT and protected-artifact preparation.
 */
export function createWaypointWatchSession(
  options: WaypointWatchOptions,
  _context: BuilderContext,
): WaypointWatchSession {
  const cache = new WaypointWatchCache();

  let generationNumber = 0;
  let disposed = false;
  let knownDependencies: readonly string[] | undefined;
  let knownFingerprint: string | undefined;

  async function nextGeneration(): Promise<WatchGeneration> {
    if (disposed) {
      throw new Error('Waypoint watch session is already disposed.');
    }

    const number = ++generationNumber;

    if (knownDependencies && knownFingerprint) {
      const current = await fingerprintFiles(knownDependencies);
      const reusable = cache.get(current.key);

      if (reusable) {
        return cachedGeneration(
          number,
          reusable.analysis,
          reusable.build,
        );
      }
    }

    const analysis = await analyze(options.analysisOptions);

    if (!analysis.success || !analysis.plan) {
      return failedGeneration(number, analysis);
    }

    knownDependencies = waypointAnalysisDependencies(analysis);

    const fingerprint = await fingerprintFiles(knownDependencies);
    const build = await prepareBuild(
      analysis,
      { metadataRoot: options.metadataRoot },
    );

    const previous = cache.replace({
      fingerprint: fingerprint.key,
      analysis,
      build,
    });

    knownFingerprint = fingerprint.key;

    if (previous && previous.build !== build) {
      await previous.build.dispose();
    }

    return Object.freeze({
      number,
      reused: false,
      analysis,
      build,

      async publish() {
        const result = await build.publish();

        return result.success
          ? { success: true }
          : {
              success: false,
              error:
                `Waypoint publication failed for generation ${number}.`,
            };
      },

      async dispose() {
        // The session cache owns the current prepared build.
      },
    });
  }

  function cachedGeneration(
    number: number,
    analysis: WaypointAnalysis,
    build: PreparedWaypointBuild,
  ): WatchGeneration {
    return Object.freeze({
      number,
      reused: true,
      analysis,
      build,

      async publish() {
        // Nothing in Waypoint's dependency graph changed; current publication
        // remains valid and host-only changes need no protected republish.
        return { success: true };
      },

      async dispose() {},
    });
  }

  function failedGeneration(
    number: number,
    analysis: WaypointAnalysis,
  ): WatchGeneration {
    return Object.freeze({
      number,
      reused: false,
      analysis,

      async publish() {
        return {
          success: false,
          error:
            `Waypoint analysis failed for generation ${number}.`,
        };
      },

      async dispose() {},
    });
  }

  return Object.freeze({
    nextGeneration,

    async dispose() {
      if (disposed) return;
      disposed = true;

      const current = cache.take();
      if (current) {
        await current.build.dispose();
      }
    },
  });
}
