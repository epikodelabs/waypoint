import { existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspaceRoot = resolvePath(
  fileURLToPath(new URL('..', import.meta.url)),
);

export const compilerProject = resolvePath(
  workspaceRoot,
  'projects/tools/compiler/tsconfig.json',
);

export const compilerModule = resolvePath(
  workspaceRoot,
  'dist/tools/compiler/lib/cli.js',
);

export const routeEntry = resolvePath(
  workspaceRoot,
  'projects/apps/shared/src/public-api.ts',
);

export const routeArtifactTsConfig = resolvePath(
  workspaceRoot,
  'projects/apps/shared/tsconfig.artifacts.json',
);

export const developmentOutputRoot = resolvePath(
  workspaceRoot,
  'dist/waypoint-generated/server',
);

export const productionOutputRoot = resolvePath(
  workspaceRoot,
  'dist/apps/server/waypoint',
);

export const outputRoot = developmentOutputRoot;

export function compilerOutputsFor(root) {
  return Object.freeze({
    serverOutput: resolvePath(root, 'server-index.json'),
    entriesOutput: resolvePath(root, 'entries'),
    manifestOutput: resolvePath(root, 'manifest.json'),
    artifactsOutput: resolvePath(root, 'artifacts'),
  });
}

export const compilerOutputs =
  compilerOutputsFor(developmentOutputRoot);

const compilerCliCandidates = [
  compilerModule,
  resolvePath(workspaceRoot, 'dist/tools/compiler/cli.js'),
  resolvePath(workspaceRoot, 'out-tsc/compiler/lib/cli.js'),
  resolvePath(workspaceRoot, 'out-tsc/compiler/cli.js'),
];

export function resolveCompilerCli() {
  const found = compilerCliCandidates.find(existsSync);

  if (found) {
    return found;
  }

  throw new Error([
    'Could not find the compiled compiler CLI.',
    'Run "npm run compiler:build" first.',
    'Checked:',
    ...compilerCliCandidates.map(file => `  - ${file}`),
  ].join('\n'));
}