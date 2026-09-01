import type {
  BuilderContext,
  BuilderOutput,
} from '@angular-devkit/architect';

import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import {
  analyze,
} from '../compiler/compiler/analyze.js';
import {
  prepareBuild,
  type PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';

export interface WaypointWatchOptions {
  readonly analysisOptions: Parameters<typeof analyze>[0];
  readonly metadataRoot: string;
}

export interface WatchGeneration {
  readonly number: number;
  readonly analysis: WaypointAnalysis;
  readonly build?: PreparedWaypointBuild;

  publish(): Promise<BuilderOutput>;
  dispose(): Promise<void>;
}

export interface WaypointWatchSession {
  nextGeneration(): Promise<WatchGeneration>;
  dispose(): Promise<void>;
}

export function createWaypointWatchSession(
  options: WaypointWatchOptions,
  _context: BuilderContext,
): WaypointWatchSession {
  let generationNumber = 0;
  let disposed = false;

  async function nextGeneration(): Promise<WatchGeneration> {
    if (disposed) {
      throw new Error('Waypoint watch session is already disposed.');
    }

    const number = ++generationNumber;
    const analysis = await analyze(options.analysisOptions);

    if (!analysis.success || !analysis.plan) {
      return Object.freeze({
        number,
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

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot: options.metadataRoot,
      },
    );

    return Object.freeze({
      number,
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

      dispose() {
        return build.dispose();
      },
    });
  }

  return Object.freeze({
    nextGeneration,

    async dispose() {
      disposed = true;
    },
  });
}