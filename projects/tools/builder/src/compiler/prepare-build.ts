import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  WaypointAnalysis,
} from './analyze.js';
import {
  publishServerRouteOutput,
} from './server-output.js';
import {
  buildProtectedRouteArtifacts,
  publishProtectedRouteArtifacts,
  removeStaleProtectedRouteArtifacts,
} from './protected-artifacts.js';

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

  const metadataRoot =
    path.resolve(
      options.metadataRoot,
    );

  const hostRoot =
    path.join(
      metadataRoot,
      'host',
    );

  const routesEntry =
    path.join(
      hostRoot,
      'routes.ts',
    );

  const runtimeEntry =
    path.join(
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
   * Keep the browser host route source minimal. The protected contribution
   * modules are deliberately absent from the initial application build.
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
      `// Waypoint generated host runtime bootstrap.`,
      ``,
    ].join('\n'),
    'utf8',
  );

  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry,
    }),

    async publish() {
      const preparedArtifacts =
        await buildProtectedRouteArtifacts(
          analysis,
        );

      const publishedArtifacts =
        await publishProtectedRouteArtifacts(
          analysis.planned.artifactsOutput,
          preparedArtifacts,
        );

      /*
       * The old server index remains valid while the new content-hashed files
       * are added. Only after every file is present do we atomically swap the
       * server metadata to the new generation.
       */
      await publishServerRouteOutput(
        analysis.plan!,
        analysis.planned.serverOutput,
        publishedArtifacts,
      );

      await removeStaleProtectedRouteArtifacts(
        analysis.planned.artifactsOutput,
        publishedArtifacts,
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
              routeSets:
                analysis.plan!.artifacts.map(
                  artifact => ({
                    artifactKey:
                      artifact.artifactKey,
                    routeSetId:
                      artifact.routeSetId,
                    dependencies:
                      artifact.dependencies,
                    branches:
                      artifact.branchIds,
                    file:
                      publishedArtifacts.find(
                        item =>
                          item.artifactKey
                          === artifact.artifactKey,
                      )?.fileName,
                    hash:
                      publishedArtifacts.find(
                        item =>
                          item.artifactKey
                          === artifact.artifactKey,
                      )?.hash,
                  }),
                ),
            },
            null,
            2,
          ) + '\n',
          'utf8',
        );
      }

      return {
        success: true,
        diagnostics: [],
      };
    },

    async rollback() {},
    async dispose() {},
  });
}