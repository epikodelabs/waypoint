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
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
  readonly artifactsOutput?: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
}

async function execute(options: WaypointBuildOptions, context: BuilderContext): Promise<BuilderOutput> {
  try {
    const root = context.workspaceRoot;
    const metadata = context.target ? await context.getProjectMetadata(context.target.project) : {};
    const projectRoot = typeof metadata['root'] === 'string' ? metadata['root'] : '';

    const result = await compile({
      entry: path.resolve(root, projectRoot, options.entry ?? 'src/app/app.routes.ts'),
      serverOutput: path.resolve(root, options.serverOutput),
      entriesOutput: path.resolve(root, options.entriesOutput),
      manifestOutput: path.resolve(root, options.manifestOutput),
      artifactsOutput: options.artifactsOutput ? path.resolve(root, options.artifactsOutput) : undefined,
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

    const scheduled = await context.scheduleTarget(targetFromTargetString(options.buildTarget));
    try { return await scheduled.result; }
    finally { await scheduled.stop(); }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return { success: false, error: message };
  }
}
export default createBuilder<WaypointBuildOptions>(execute);
