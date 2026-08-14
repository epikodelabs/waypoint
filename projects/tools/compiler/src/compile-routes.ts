import type { CompileWaypointOptions } from './api';
import { runRouteCompiler } from './cli/route-compiler';

export async function compileRoutes(options: CompileWaypointOptions): Promise<void> {
  const args = [
    'compile',
    '--entry', options.entry,
    '--artifact-tsconfig', options.artifactTsconfig,
    '--server-output', options.serverOutput,
    '--entries-output', options.entriesOutput,
    '--manifest-output', options.manifestOutput,
    '--artifacts-output', options.artifactsOutput,
    '--routes-export', options.routesExport ?? 'routes',
  ];
  if (options.profile) args.push('--profile');
  await runRouteCompiler(args);
}
