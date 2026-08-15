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

export interface WaypointWatchSessionOptions {
  readonly analysisOptions: Parameters<typeof analyze>[0];
  readonly metadataRoot: string;
}

export interface WaypointWatchGeneration {
  readonly number: number;
  readonly reused: boolean;
  readonly analysis: WaypointAnalysis;
  readonly build: PreparedWaypointBuild;

  publish(): Promise<BuilderOutput>;
  dispose(): Promise<void>;
}

export interface WaypointWatchSessionV2 {
  nextGeneration(): Promise<WaypointWatchGeneration>;
  dispose(): Promise<void>;
}

/**
 * Persistent watch session with dependency-aware reuse.
 *
 * We first analyze to know the authoritative dependency set. After that, if the
 * dependency fingerprint is unchanged, the previous prepared Waypoint build can
 * be reused instead of recreating AOT/protected state.
 */
export function createWaypointWatchSessionV2(
  options: WaypointWatchSessionOptions,
  _context: BuilderContext,
): WaypointWatchSessionV2 {
  const cache = new WaypointWatchCache();

  let generation = 0;
  let disposed = false;
  let knownDependencies: readonly string[] | undefined;
  let knownFingerprint: string | undefined;

  async function nextGeneration(): Promise<WaypointWatchGeneration> {
    if (disposed) {
      throw new Error(
        'Waypoint watch session is already disposed.',
      );
    }

    const number = ++generation;

    if (
      knownDependencies
      && knownFingerprint
    ) {
      const current =
        await fingerprintFiles(
          knownDependencies,
        );

      const reusable =
        cache.get(current.key);

      if (reusable) {
        return generationFromCache(
          number,
          reusable.analysis,
          reusable.build,
        );
      }
    }

    const analysis = await analyze(
      options.analysisOptions,
    );

    if (!analysis.success || !analysis.plan) {
      throw new Error(
        `Waypoint analysis failed for watch generation ${number}.`,
      );
    }

    knownDependencies =
      waypointAnalysisDependencies(
        analysis,
      );

    const fingerprint =
      await fingerprintFiles(
        knownDependencies,
      );

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot:
          options.metadataRoot,
      },
    );

    const previous = cache.replace({
      fingerprint:
        fingerprint.key,
      analysis,
      build,
    });

    knownFingerprint =
      fingerprint.key;

    if (
      previous
      && previous.build !== build
    ) {
      await previous.build.dispose();
    }

    return Object.freeze({
      number,
      reused: false,
      analysis,
      build,

      async publish() {
        const result =
          await build.publish();

        return result.success
          ? { success: true }
          : {
              success: false,
              error:
                `Waypoint publication failed for generation ${number}.`,
            };
      },

      async dispose() {
        /*
         * Cached build survives this generation.
         * Session.dispose() owns its final cleanup.
         */
      },
    });
  }

  function generationFromCache(
    number: number,
    analysis: WaypointAnalysis,
    build: PreparedWaypointBuild,
  ): WaypointWatchGeneration {
    return Object.freeze({
      number,
      reused: true,
      analysis,
      build,

      async publish() {
        /*
         * If nothing in Waypoint's dependency graph changed, publication is
         * already current. Host-only Angular changes require no protected
         * republish.
         */
        return {
          success: true,
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
