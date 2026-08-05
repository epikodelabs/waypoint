import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspaceRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const routeEntry = resolve(workspaceRoot, 'projects/apps/shared/src/lib/index.ts');
export const outputRoot = resolve(workspaceRoot, 'dist/.waypoint/shared');

export const compilerOutputs = Object.freeze({
  serverOutput: resolve(outputRoot, 'server-index.json'),
  entriesOutput: resolve(outputRoot, 'entries'),
  manifestOutput: resolve(outputRoot, 'manifest.json'),
  artifactsOutput: resolve(outputRoot, 'artifacts'),
});

const candidates = [
  'dist/tools/compiler/lib/cli.js',
  'dist/tools/compiler/cli.js',
  'out-tsc/compiler/lib/cli.js',
  'out-tsc/compiler/cli.js',
  'projects/tools/compiler/dist/lib/cli.js',
  'projects/tools/compiler/dist/cli.js',
].map(path => resolve(workspaceRoot, path));

export function resolveCompilerCli() {
  const cli = candidates.find(existsSync);
  if (cli) return cli;

  throw new Error([
    'Could not find the compiled route compiler CLI.',
    'Run "npm run compiler:build" first.',
    'Checked:',
    ...candidates.map(path => `  - ${path}`),
  ].join('\n'));
}
