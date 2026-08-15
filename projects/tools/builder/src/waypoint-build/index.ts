import path from 'node:path';

import {
  createBuilder,
  targetFromTargetString,
  type BuilderContext,
  type BuilderOutput,
} from '@angular-devkit/architect';

import {
  analyze,
  prepareBuild,
  createBuildLayout,
} from '../../compiler/src/lib/index.js';

interface WaypointBuildOptions {
  readonly buildTarget: string;
  readonly entry?: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
}

async function execute(
  options: WaypointBuildOptions,
  context: BuilderContext,
): Promise<BuilderOutput> {
  try {
    const workspaceRoot = context.workspaceRoot;
    const target = targetFromTargetString(
      options.buildTarget,
    );

    const metadata =
      await context.getProjectMetadata(target.project);
    const projectRoot =
      typeof metadata['root'] === 'string'
        ? metadata['root']
        : '';

    const targetOptions =
      await context.getTargetOptions(target);

    const outputPath = resolveOutputPath(
      workspaceRoot,
      targetOptions['outputPath'],
    );

    const layout = createBuildLayout(outputPath);

    const analysis = await analyze({
      entry: path.resolve(
        workspaceRoot,
        projectRoot,
        options.entry ?? 'src/app/app.routes.ts',
      ),
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput: layout.buildManifest,
      routesExport: options.routesExport,
      profile: options.profile,
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
      },
    );

    try {
      const replacements =
        normalizeReplacements(
          targetOptions['fileReplacements'],
        );

      replacements.push({
        replace: analysis.planned.entry,
        with: build.host.routesEntry,
      });

      const polyfills =
        normalizePolyfills(
          targetOptions['polyfills'],
        );

      polyfills.push(
        build.host.runtimeEntry,
      );

      const scheduled =
        await context.scheduleTarget(
          target,
          {
            fileReplacements: replacements,
            polyfills,
          },
        );

      try {
        const angular =
          await scheduled.result;

        if (!angular.success) {
          await build.rollback();
          return angular;
        }
      } finally {
        await scheduled.stop();
      }

      const result =
        await build.publish();

      reportDiagnostics(
        result.diagnostics,
        context,
      );

      return result.success
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

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === 'string',
  );
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
    'Underlying Angular target must define outputPath.',
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

export default createBuilder<
  WaypointBuildOptions
>(execute);
