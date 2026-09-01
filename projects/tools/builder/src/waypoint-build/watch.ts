import type {
  BuilderContext,
  BuilderOutput,
  BuilderRun,
} from '@angular-devkit/architect';

import {
  createWaypointWatchSession,
} from '../watch/watch-session.js';
import {
  builderResults,
} from '../watch/build-result-stream.js';

export interface RunWaypointWatchOptions {
  readonly delegatedRun: BuilderRun;
  readonly context: BuilderContext;
  readonly analysisOptions: Parameters<
    typeof createWaypointWatchSession
  >[0]['analysisOptions'];
  readonly metadataRoot: string;
  readonly reportDiagnostics: (
    diagnostics: readonly {
      level: string;
      code?: string;
      message: string;
    }[],
    context: BuilderContext,
  ) => void;
}

/**
 * Coordinates one persistent Angular watch run with disposable Waypoint build
 * generations.
 *
 * The last successfully published Waypoint generation remains live when a later
 * Angular or Waypoint rebuild fails.
 */
export async function* runWaypointWatch(
  options: RunWaypointWatchOptions,
): AsyncGenerator<BuilderOutput> {
  const session = createWaypointWatchSession(
    {
      analysisOptions:
        options.analysisOptions,
      metadataRoot:
        options.metadataRoot,
    },
    options.context,
  );

  try {
    for await (
      const angularResult
      of builderResults(
        options.delegatedRun.output,
      )
    ) {
      if (!angularResult.success) {
        yield angularResult;
        continue;
      }

      const generation =
        await session.nextGeneration();

      try {
        options.reportDiagnostics(
          generation.analysis.diagnostics,
          options.context,
        );

        if (!generation.analysis.success) {
          yield {
            success: false,
            error:
              `Waypoint analysis failed for generation ${generation.number}.`,
          };
          continue;
        }

        const published =
          await generation.publish();

        yield published;
      } finally {
        await generation.dispose();
      }
    }
  } finally {
    await session.dispose();
    await options.delegatedRun.stop();
  }
}