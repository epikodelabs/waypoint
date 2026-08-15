import type { CompileWaypointOptions } from './api.js';
import { compile } from './lib/compiler/compile.js';

export async function compileRoutes(options: CompileWaypointOptions): Promise<void> {
  const result = await compile({
    entry: options.entry,
    artifactTsConfig: options.artifactTsconfig,
    serverOutput: options.serverOutput,
    entriesOutput: options.entriesOutput,
    manifestOutput: options.manifestOutput,
    artifactsOutput: options.artifactsOutput,
    routesExport: options.routesExport,
    profile: options.profile,
  });
  if (!result.success) {
    throw new Error('Route compilation failed.');
  }
}
