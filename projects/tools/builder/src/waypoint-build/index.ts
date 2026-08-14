import path from 'node:path';
import { createBuilder, targetFromTargetString, type BuilderContext, type BuilderOutput } from '@angular-devkit/architect';
import { compile, plan, createBuildLayout } from '../../compiler/src/lib/index.js';

interface Options { readonly buildTarget: string; readonly entry?: string; readonly routesExport?: string; readonly profile?: boolean; }

async function execute(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  try {
    const root = context.workspaceRoot;
    const target = targetFromTargetString(options.buildTarget);
    const metadata = await context.getProjectMetadata(target.project);
    const projectRoot = typeof metadata['root'] === 'string' ? metadata['root'] : '';
    const targetOptions = await context.getTargetOptions(target);
    const layout = createBuildLayout(resolveOutputPath(root, targetOptions['outputPath']));
    const entry = path.resolve(root, projectRoot, options.entry ?? 'src/app/app.routes.ts');
    const compilerOptions = {
      entry,
      serverOutput: layout.serverRoot,
      entriesOutput: layout.entriesRoot,
      manifestOutput: layout.manifest,
      artifactsOutput: layout.protectedRoot,
      routesExport: options.routesExport,
      profile: options.profile,
    };

    // Security/navigation planning is now the first build phase.
    const planned = await plan(compilerOptions);
    report(planned.diagnostics, context);
    if (!planned.success || !planned.plan) return { success: false, error: 'Waypoint planning failed.' };

    // TODO(next): derive an Angular host entry from planned.plan so protected roots
    // cannot be traversed by the ordinary Angular host compilation.
    const scheduled = await context.scheduleTarget(target);
    try {
      const angular = await scheduled.result;
      if (!angular.success) return angular;
    } finally { await scheduled.stop(); }

    const compiled = await compile(compilerOptions);
    report(compiled.diagnostics, context);
    return compiled.success ? { success: true } : { success: false, error: 'Waypoint protected build failed.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return { success: false, error: message };
  }
}

function resolveOutputPath(root: string, value: unknown): string {
  if (typeof value === 'string' && value) return path.resolve(root, value);
  if (value && typeof value === 'object' && typeof (value as {base?:unknown}).base === 'string') return path.resolve(root, (value as {base:string}).base);
  throw new Error('Underlying Angular target must define outputPath.');
}
function report(items: readonly {level:string;code?:string;message:string}[], context: BuilderContext): void {
  for (const item of items) {
    const text=item.code?`${item.code}: ${item.message}`:item.message;
    if(item.level==='error')context.logger.error(text);else if(item.level==='warning')context.logger.warn(text);else context.logger.info(text);
  }
}
export default createBuilder<Options>(execute);
