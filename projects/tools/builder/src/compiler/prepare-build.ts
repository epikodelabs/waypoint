import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  WaypointAnalysis,
} from './analyze.js';
import {
  publishServerRouteOutput,
} from './server-output.js';
import {
  createBrowserBootstrapSource,
} from './browser-bootstrap-entry.js';
import {
  createHostRoutesSource,
} from './host-routes-entry.js';
import {
  createHostRuntimeSource,
} from './host-runtime-entry.js';
import {
  buildProtectedRouteArtifacts,
  publishProtectedRouteArtifacts,
  removeStaleProtectedRouteArtifacts,
} from './protected-artifacts.js';

export interface PrepareBuildOptions {
  readonly metadataRoot: string;
  readonly browserEntry: string;
  readonly browserBootstrapRoot: string;
}

export interface PreparedWaypointBuild {
  readonly host: {
    readonly browserEntry: string;
    readonly routesEntry: string;
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

  // Keep the replacement entry inside the app's tsconfig include path.
  const browserBootstrapRoot =
    path.join(
      path.resolve(options.browserBootstrapRoot),
      'waypoint.generated',
    );
  const runtimeEntry =
    path.join(
      browserBootstrapRoot,
      'host-runtime.ts',
    );
  const browserEntry =
    path.join(
      browserBootstrapRoot,
      'browser.ts',
    );

  await fs.mkdir(
    hostRoot,
    {
      recursive: true,
    },
  );

  /*
   * Prepare protected artifacts before delegating to Angular. Publication
   * still happens only after the public host build succeeds.
   */
  const preparedArtifacts =
    await buildProtectedRouteArtifacts(
      analysis,
    );

  /*
   * Keep the browser host route source minimal. The protected contribution
   * modules are deliberately absent from the initial application build.
   */
  await fs.writeFile(
    routesEntry,
    createHostRoutesSource(
      preparedArtifacts.hostModules,
    ),
    'utf8',
  );

  await fs.mkdir(
    browserBootstrapRoot,
    {
      recursive: true,
    },
  );

  await fs.writeFile(
    runtimeEntry,
    createHostRuntimeSource(
      preparedArtifacts.hostModules,
    ),
    'utf8',
  );

  await fs.writeFile(
    browserEntry,
    createBrowserBootstrapSource(
      path.resolve(options.browserEntry),
      runtimeEntry,
      browserEntry,
    ),
    'utf8',
  );

  return Object.freeze({
    host: Object.freeze({
      browserEntry,
      routesEntry,
    }),

    async publish() {
      const publishedArtifacts =
        await publishProtectedRouteArtifacts(
          analysis.planned.artifactsOutput,
          preparedArtifacts.artifacts,
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
