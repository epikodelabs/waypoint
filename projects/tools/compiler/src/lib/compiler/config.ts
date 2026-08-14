import path from 'node:path';
import type { PlannedCompilerOutputs, RouteCompilerOptions } from './contracts.js';

export function normalizeCompilerOptions(options: RouteCompilerOptions): PlannedCompilerOutputs {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const manifestOutput = path.resolve(cwd, options.manifestOutput);

  return {
    cwd,
    entry: path.resolve(cwd, options.entry),
    artifactTsConfig: path.resolve(cwd, options.artifactTsConfig),
    hostModules: normalizeHostModules(options.hostModules),
    serverOutput: path.resolve(cwd, options.serverOutput),
    entriesOutput: path.resolve(cwd, options.entriesOutput),
    manifestOutput,
    artifactsOutput: path.resolve(
      cwd,
      options.artifactsOutput ?? path.join(path.dirname(manifestOutput), 'artifacts'),
    ),
    dryRun: options.dryRun === true,
    routesExport: options.routesExport ?? 'routes',
    inspect: options.inspect === true,
    profile: options.profile === true,
  };
}
function normalizeHostModules(values: readonly string[] | undefined): readonly string[] {
  if (!values) return Object.freeze([]);

  const result = new Set<string>();
  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error('Compiler host module specifiers must not be empty.');
    }
    result.add(normalized);
  }
  return Object.freeze([...result].sort());
}

function findApplicationRoot(entry: string): string {
  let current = path.dirname(entry);
  while (current !== path.dirname(current)) {
    if (path.basename(current) === 'src') return path.dirname(current);
    current = path.dirname(current);
  }
  throw new Error(`Unable to derive application root from route entry "${entry}".`);
}
