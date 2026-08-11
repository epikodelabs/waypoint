import { mkdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import {
  compilerOutputsFor,
  developmentOutputRoot,
  resolveCompilerCli,
  routeArtifactTsConfig,
  routeEntry,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

function option(name) {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;

  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${name}.`);
  }

  return value;
}

const requestedOutput = option('--output');
const outputRoot = requestedOutput
  ? resolvePath(workspaceRoot, requestedOutput)
  : developmentOutputRoot;
const compilerOutputs = compilerOutputsFor(outputRoot);

await mkdir(outputRoot, {
  recursive: true,
});

const args = [
  resolveCompilerCli(),
  'compile',
  '--entry',
  routeEntry,
  '--artifact-tsconfig',
  routeArtifactTsConfig,
  '--host-module',
  '@waypoint-demo/runtime',
  '--server-output',
  compilerOutputs.serverOutput,
  '--entries-output',
  compilerOutputs.entriesOutput,
  '--manifest-output',
  compilerOutputs.manifestOutput,
  '--artifacts-output',
  compilerOutputs.artifactsOutput,
  '--routes-export',
  'routes',
];

if (process.argv.includes('--dry-run')) {
  args.push('--dry-run');
}
if (process.argv.includes('--profile')) {
  args.push('--profile');
}

process.exitCode = await run(
  process.execPath,
  args,
  {
    cwd: workspaceRoot,
  },
);