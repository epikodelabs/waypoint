import path from 'node:path';
import type { PlannedCompilerOutputs, RouteCompilerOptions } from './contracts.js';

export function normalizeCompilerOptions(options: RouteCompilerOptions): PlannedCompilerOutputs {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  return {
    entry: path.resolve(cwd, options.entry),
    serverOutput: path.resolve(cwd, options.serverOutput),
    entriesOutput: path.resolve(cwd, options.entriesOutput),
    manifestOutput: path.resolve(cwd, options.manifestOutput),
    dryRun: options.dryRun === true,
    routesExport: options.routesExport ?? 'routes',
  };
}