import fs from 'node:fs';
import path from 'node:path';

export interface AnalyzeOptions {
  readonly entry: string;
  readonly serverOutput: string;
  readonly artifactsOutput: string;
  readonly buildManifestOutput?: string;
  readonly profile?: boolean;
}

export interface WaypointAnalysis {
  readonly success: boolean;
  readonly diagnostics: readonly {
    readonly level: 'error' | 'warning' | 'info';
    readonly code?: string;
    readonly message: string;
  }[];
  readonly planned: {
    readonly entry: string;
    readonly serverOutput: string;
    readonly artifactsOutput: string;
    readonly buildManifestOutput?: string;
  };
  readonly plan?: unknown;
}

/**
 * Builder-owned analysis entrypoint.
 *
 * This file intentionally contains no dependency on projects/tools/compiler.
 * Wire the existing semantic/IR/planning modules under src/compiler as they are
 * moved/refined.
 */
export async function analyze(
  options: AnalyzeOptions,
): Promise<WaypointAnalysis> {
  const entry = path.resolve(
    options.entry,
  );

  const diagnostics: Array<{
    level: 'error' | 'warning' | 'info';
    code?: string;
    message: string;
  }> = [];

  if (!fs.existsSync(entry)) {
    diagnostics.push({
      level: 'error',
      code: 'WPT1001',
      message:
        `Waypoint navigation entry does not exist: ${entry}`,
    });
  }

  const plan = diagnostics.length === 0
    ? Object.freeze({
        entry,
        serverOutput: path.resolve(
          options.serverOutput,
        ),
        artifactsOutput: path.resolve(
          options.artifactsOutput,
        ),
      })
    : undefined;

  return Object.freeze({
    success: diagnostics.length === 0,
    diagnostics: Object.freeze(
      diagnostics,
    ),
    planned: Object.freeze({
      entry,
      serverOutput: path.resolve(
        options.serverOutput,
      ),
      artifactsOutput: path.resolve(
        options.artifactsOutput,
      ),
      buildManifestOutput:
        options.buildManifestOutput
          ? path.resolve(
              options.buildManifestOutput,
            )
          : undefined,
    }),
    plan,
  });
}
