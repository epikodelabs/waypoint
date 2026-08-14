import path from 'node:path';
import {
  createBuilder,
  targetFromTargetString,
  type BuilderContext,
  type BuilderOutput,
} from '@angular-devkit/architect';
import { compile } from '../../compiler/src/lib/index.js';

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
    const projectMetadata = await context.getProjectMetadata(target.project);
    const projectRoot = typeof projectMetadata['root'] === 'string' ? projectMetadata['root'] : '';
    const buildOptions = await context.getTargetOptions(target);
    const outputPath = resolveOutputPath(workspaceRoot, buildOptions['outputPath']);
    const waypointOutput = path.join(outputPath, 'waypoint');

    const result = await compile({
      entry: path.resolve(workspaceRoot, projectRoot, options.entry ?? 'src/app/app.routes.ts'),
      serverOutput: path.join(waypointOutput, 'server'),
      entriesOutput: path.join(waypointOutput, 'entries'),
      manifestOutput: path.join(waypointOutput, 'manifest.json'),
      artifactsOutput: path.join(waypointOutput, 'artifacts'),
      routesExport: options.routesExport,
      profile: options.profile,
    });

    for (const diagnostic of result.diagnostics) {
      const message = diagnostic.code ? `${diagnostic.code}: ${diagnostic.message}` : diagnostic.message;
      if (diagnostic.level === 'error') context.logger.error(message);
      else if (diagnostic.level === 'warning') context.logger.warn(message);
      else context.logger.info(message);
    }
    if (!result.success) return { success: false, error: 'Waypoint compilation failed.' };

    const scheduled = await context.scheduleTarget(target);
    try { return await scheduled.result; }
    finally { await scheduled.stop(); }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return { success: false, error: message };
  }
}

function resolveOutputPath(workspaceRoot: string, value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return path.resolve(workspaceRoot, value);
  if (value && typeof value === 'object') {
    const base = (value as { base?: unknown }).base;
    if (typeof base === 'string' && base.length > 0) return path.resolve(workspaceRoot, base);
  }
  throw new Error('Waypoint build requires the underlying Angular target to define outputPath.');
}

export default createBuilder<WaypointBuildOptions>(execute);
