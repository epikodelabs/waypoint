import { mkdir } from 'node:fs/promises';
import {
  compilerOutputs,
  outputRoot,
  resolveCompilerCli,
  routeEntry,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

await mkdir(outputRoot, { recursive: true });

const args = [
  resolveCompilerCli(),
  'compile',
  '--entry', routeEntry,
  '--server-output', compilerOutputs.serverOutput,
  '--entries-output', compilerOutputs.entriesOutput,
  '--manifest-output', compilerOutputs.manifestOutput,
  '--artifacts-output', compilerOutputs.artifactsOutput,
  '--routes-export', 'routes',
];

if (process.argv.includes('--dry-run')) args.push('--dry-run');

await run(process.execPath, args, { cwd: workspaceRoot });
