import path from 'node:path';
import {
  createBuilder,
  targetFromTargetString,
  type BuilderContext,
  type BuilderOutput,
} from '@angular-devkit/architect';
import { compile, createBuildLayout } from '../../compiler/src/lib/index.js';

interface WaypointBuildOptions {
  readonly buildTarget: string;
  readonly entry?: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
}

async function execute(options: WaypointBuildOptions, context: BuilderContext): Promise<BuilderOutput> {
  try {
    const workspaceRoot = context.workspaceRoot;
    const target = targetFromTargetString(options.buildTarget);
    const metadata = await context.getProjectMetadata(target.project);
    const projectRoot = typeof metadata['root'] === 'string' ? metadata['root'] : '';
    const targetOptions = await context.getTargetOptions(target);
    const outputPath = resolveOutputPath(workspaceRoot, targetOptions['outputPath']);
    const layout = createBuildLayout(outputPath);

    // Build the ordinary Angular host first. Waypoint output is then published
    // into the same deployment root instead of a separate compiler tree.
    const scheduled = await context.scheduleTarget(target);
    try {
      const angularResult = await scheduled.result;
      if (!angularResult.success) return angularResult;
    } finally {
      await scheduled.stop();
    }

    const result = await compile({
      entry: path.resolve(workspaceRoot, projectRoot, options.entry ?? 'src/app/app.routes.ts'),
      serverOutput: layout.serverRoot,
      entriesOutput: layout.entriesRoot,
      manifestOutput: layout.manifest,
      artifactsOutput: layout.protectedRoot,
      routesExport: options.routesExport,
      profile: options.profile,
    });

    reportDiagnostics(result.diagnostics, context);
    return result.success
      ? { success: true }
      : { success: false, error: 'Waypoint protected build failed.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return { success: false, error: message };
  }
}

function resolveOutputPath(workspaceRoot: string, value: unknown): string {
  if (typeof value === 'string' && value) return path.resolve(workspaceRoot, value);
  if (value && typeof value === 'object') {
    const base = (value as { base?: unknown }).base;
    if (typeof base === 'string' && base) return path.resolve(workspaceRoot, base);
  }
  throw new Error('Underlying Angular build target must define outputPath.');
}

function reportDiagnostics(items: readonly { level: string; code?: string; message: string }[], context: BuilderContext): void {
  for (const item of items) {
    const message = item.code ? `${item.code}: ${item.message}` : item.message;
    if (item.level === 'error') context.logger.error(message);
    else if (item.level === 'warning') context.logger.warn(message);
    else context.logger.info(message);
  }
}

export default createBuilder<WaypointBuildOptions>(execute);
