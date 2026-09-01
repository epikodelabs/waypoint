import fs from 'node:fs/promises';
import path from 'node:path';

import {
  createBuilder,
  type BuilderContext,
  type BuilderOutput,
} from '@angular-devkit/architect';

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../compiler/index.js';
import {
  assertNoRouteArtifactKeysInHost,
} from '../compiler/host-isolation.js';

interface WaypointBuildOptions extends Record<string, unknown> {
  readonly waypoint?: {
    readonly entry?: string;
    readonly profile?: boolean;
    readonly buildManifest?: boolean;
  };
}

/**
 * Waypoint is the application's actual build builder.
 *
 * All non-`waypoint` options are ordinary @angular/build:application options
 * and are delegated directly to Angular after Waypoint injects its generated
 * host navigation/runtime inputs.
 */
async function execute(
  options: WaypointBuildOptions,
  context: BuilderContext,
): Promise<BuilderOutput> {
  try {
    if (!context.target) {
      throw new Error(
        'Waypoint build requires an Architect project target context.',
      );
    }

    const workspaceRoot = context.workspaceRoot;
    const projectMetadata =
      await context.getProjectMetadata(context.target.project);

    const projectRoot =
      typeof projectMetadata['root'] === 'string'
        ? projectMetadata['root']
        : '';
    const sourceRoot = projectMetadata['sourceRoot'];

    if (typeof sourceRoot !== 'string') {
      throw new Error(
        'Waypoint build requires an Angular application sourceRoot.',
      );
    }

    // Artifact analysis runs before the replacement entry is regenerated.
    // Remove the previous generated entry so it cannot leak into that program.
    await fs.rm(
      path.join(
        workspaceRoot,
        sourceRoot,
        'waypoint.generated',
      ),
      {
        recursive: true,
        force: true,
      },
    );

    const angularOptions = angularApplicationOptions(options);
    const outputPath = resolveOutputPath(
      workspaceRoot,
      angularOptions['outputPath'],
    );

    const layout = createBuildLayout(outputPath);
    const waypoint = options.waypoint ?? {};

    const entry = path.resolve(
      workspaceRoot,
      projectRoot,
      waypoint.entry ?? 'src/app/app.routes.ts',
    );

    const analysis = await analyze({
      entry,
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput:
        waypoint.buildManifest === false
          ? undefined
          : layout.manifest,
      profile: waypoint.profile,
    });

    reportDiagnostics(
      analysis.diagnostics,
      context,
    );

    if (!analysis.success || !analysis.plan) {
      return {
        success: false,
        error: 'Waypoint analysis failed.',
      };
    }

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot: layout.metadataRoot,
        browserEntry: path.resolve(
          workspaceRoot,
          String(angularOptions['browser']),
        ),
        browserBootstrapRoot: path.resolve(
          workspaceRoot,
          sourceRoot,
        ),
      },
    );

    try {
      const delegatedOptions = {
        ...angularOptions,


        fileReplacements: [
          ...normalizeReplacements(
            angularOptions['fileReplacements'],
          ),
          {
            replace: String(
              angularOptions['browser'],
            ),
            with: angularWorkspacePath(
              workspaceRoot,
              build.host.browserEntry,
            ),
          },
          {
            replace: angularWorkspacePath(
              workspaceRoot,
              analysis.planned.entry,
            ),
            with: angularWorkspacePath(
              workspaceRoot,
              build.host.routesEntry,
            ),
          },
        ],

        polyfills: normalizePolyfills(
          angularOptions['polyfills'],
        ),
      };

      /*
       * Delegate directly to Angular's builder implementation rather than
       * scheduling another project target. This avoids a synthetic build-base
       * target and avoids recursion into Waypoint's own build target.
       */
      const delegated = await context.scheduleBuilder(
        '@angular/build:application',
        delegatedOptions,
        {
          target: context.target,
        },
      );

      try {
        const angularResult = await delegated.result;

        if (!angularResult.success) {
          await build.rollback();
          return angularResult;
        }
      } finally {
        await delegated.stop();
      }

      /*
       * Security boundary: no server-delivered routesFor() contribution may be
       * reachable from the public Angular host graph. Contribution ids are
       * stable runtime strings, so scanning the final browser output catches
       * accidental imports even after Angular/esbuild transforms the modules.
       */
      await assertNoRouteArtifactKeysInHost(
        layout.publicRoot,
        analysis.plan.artifacts.map(
          artifact => artifact.artifactKey,
        ),
      );

      const published = await build.publish();

      reportDiagnostics(
        published.diagnostics,
        context,
      );

      return published.success
        ? { success: true }
        : {
            success: false,
            error: 'Waypoint publication failed.',
          };
    } finally {
      await build.dispose();
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    context.logger.error(message);

    return {
      success: false,
      error: message,
    };
  }
}

function angularWorkspacePath(
  workspaceRoot: string,
  absolutePath: string,
): string {
  const relative = path.relative(
    workspaceRoot,
    absolutePath,
  );

  if (
    relative === '..'
    || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative)
  ) {
    throw new Error(
      `Waypoint generated path "${absolutePath}" is outside workspace "${workspaceRoot}".`,
    );
  }

  return relative
    .split(path.sep)
    .join('/');
}

function angularApplicationOptions(
  options: WaypointBuildOptions,
): Record<string, unknown> {
  const {
    waypoint: _waypoint,
    ...angular
  } = options;

  return angular;
}

function normalizeReplacements(
  value: unknown,
): Array<{ replace: string; with: string }> {
  if (!Array.isArray(value)) return [];

  return value.flatMap(item => {
    if (
      !item
      || typeof item !== 'object'
      || typeof (item as any).replace !== 'string'
      || typeof (item as any).with !== 'string'
    ) {
      return [];
    }

    return [{
      replace: (item as any).replace,
      with: (item as any).with,
    }];
  });
}



function normalizePolyfills(
  value: unknown,
): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === 'string',
      )
    : [];
}

function resolveOutputPath(
  workspaceRoot: string,
  value: unknown,
): string {
  if (
    typeof value === 'string'
    && value.length > 0
  ) {
    return path.resolve(
      workspaceRoot,
      value,
    );
  }

  if (
    value
    && typeof value === 'object'
    && typeof (value as any).base === 'string'
  ) {
    return path.resolve(
      workspaceRoot,
      (value as any).base,
    );
  }

  throw new Error(
    'Waypoint build requires Angular application outputPath.',
  );
}

function reportDiagnostics(
  diagnostics: readonly {
    level: string;
    code?: string;
    message: string;
  }[],
  context: BuilderContext,
): void {
  for (const diagnostic of diagnostics) {
    const text =
      diagnostic.code
        ? `${diagnostic.code}: ${diagnostic.message}`
        : diagnostic.message;

    if (diagnostic.level === 'error') {
      context.logger.error(text);
    } else if (
      diagnostic.level === 'warning'
    ) {
      context.logger.warn(text);
    } else {
      context.logger.info(text);
    }
  }
}

export default createBuilder<WaypointBuildOptions>(
  execute,
);
