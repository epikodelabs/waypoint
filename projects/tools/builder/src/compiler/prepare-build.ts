import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  WaypointAnalysis,
} from './analyze.js';

export interface PrepareBuildOptions {
  readonly metadataRoot: string;
}

export interface PreparedWaypointBuild {
  readonly host: {
    readonly routesEntry: string;
    readonly runtimeEntry: string;
  };

  publish(): Promise<{
    readonly success: boolean;
    readonly diagnostics: readonly {
      readonly level: 'error' | 'warning' | 'info';
      readonly code?: string;
      readonly message: string;
    }[];
  }>;

  rollback(): Promise<void>;
  dispose(): Promise<void>;
}

export async function prepareBuild(
  analysis: WaypointAnalysis,
  options: PrepareBuildOptions,
): Promise<PreparedWaypointBuild> {
  if (
    !analysis.success
    || !analysis.plan
  ) {
    throw new Error(
      'Cannot prepare Waypoint build from failed analysis.',
    );
  }

  const metadataRoot = path.resolve(
    options.metadataRoot,
  );

  const hostRoot = path.join(
    metadataRoot,
    'host',
  );

  const routesEntry = path.join(
    hostRoot,
    'routes.ts',
  );

  const runtimeEntry = path.join(
    hostRoot,
    'runtime.js',
  );

  await fs.mkdir(
    hostRoot,
    {
      recursive: true,
    },
  );

  /*
   * Minimal host stubs.
   *
   * These intentionally avoid importing protected authored routes.
   * They exist so the builder can replace the authored route entry and inject
   * a runtime polyfill without depending on the removed standalone compiler.
   */
  await fs.writeFile(
    routesEntry,
    [
      `import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';`,
      ``,
      `export const routes = [`,
      `  routeSlot('public'),`,
      `  routeSlot('application'),`,
      `] as const satisfies NavigationTree;`,
      ``,
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    runtimeEntry,
    [
      `// Waypoint builder runtime bootstrap.`,
      ``,
    ].join('\n'),
    'utf8',
  );

  let published = false;

  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry,
    }),

    async publish() {
      const serverRoot =
        path.resolve(
          analysis.planned.serverOutput,
        );

      await fs.mkdir(
        serverRoot,
        {
          recursive: true,
        },
      );

      const serverIndex = path.join(
        serverRoot,
        'server-index.json',
      );

      /*
       * Transitional builder-owned server index.
       *
       * This keeps the new output contract alive without reviving the old
       * compiler project. Replace the empty shard/artifact arrays with the
       * actual semantic/artifact planner output as those internal stages are
       * reconnected.
       */
      await fs.writeFile(
        serverIndex,
        JSON.stringify(
          {
            version: 1,
            generatedAt:
              new Date().toISOString(),
            shards: [],
            artifacts: [],
          },
          null,
          2,
        ) + '\n',
        'utf8',
      );

      if (
        analysis.planned
          .buildManifestOutput
      ) {
        await fs.mkdir(
          path.dirname(
            analysis.planned
              .buildManifestOutput,
          ),
          {
            recursive: true,
          },
        );

        await fs.writeFile(
          analysis.planned
            .buildManifestOutput,
          JSON.stringify(
            {
              version: 1,
              entry:
                analysis.planned.entry,
              serverOutput:
                analysis.planned.serverOutput,
              artifactsOutput:
                analysis.planned.artifactsOutput,
            },
            null,
            2,
          ) + '\n',
          'utf8',
        );
      }

      published = true;

      return {
        success: true,
        diagnostics: [],
      };
    },

    async rollback() {
      if (!published) {
        return;
      }
    },

    async dispose() {
      /*
       * Keep generated metadata for the server.
       * Host temp files live inside output/.waypoint and are safe to retain.
       */
    },
  });
}
