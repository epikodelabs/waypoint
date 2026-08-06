#!/usr/bin/env node
import { compileRoutes } from './compiler/compile.js';
import type { RouteCompilerOptions } from './compiler/contracts.js';

async function main(): Promise<void> {
  if (process.argv[2] !== 'compile') {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = await compileRoutes(
    readCompileOptions(
      process.argv.slice(3),
    ),
  );

  for (const diagnostic of result.diagnostics) {
    const label = diagnostic.code
      ? `${diagnostic.level.toUpperCase()} ${diagnostic.code}`
      : diagnostic.level.toUpperCase();

    process.stdout.write(
      `[${label}] ${diagnostic.message}\n`,
    );
  }

  process.stdout.write(
    `entry: ${result.planned.entry}\n`,
  );
  process.stdout.write(
    `serverOutput: ${result.planned.serverOutput}\n`,
  );
  process.stdout.write(
    `entriesOutput: ${result.planned.entriesOutput}\n`,
  );
  process.stdout.write(
    `manifestOutput: ${result.planned.manifestOutput}\n`,
  );
  process.stdout.write(
    `artifactsOutput: ${result.planned.artifactsOutput}\n`,
  );
  process.stdout.write(
    `dryRun: ${result.planned.dryRun}\n`,
  );

  if (!result.success) {
    process.exitCode = 1;
  }
}

function readCompileOptions(args: readonly string[]): RouteCompilerOptions {
  const flags = new Map<string, string>();
  let dryRun = false;

  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (!key?.startsWith('--')) {
      printUsage();
      throw new Error('Invalid compiler arguments.');
    }

    const name = key.slice(2);
    if (name === 'dry-run') {
      dryRun = true;
      continue;
    }

    const value = args[++index];
    if (!value || value.startsWith('--')) {
      printUsage();
      throw new Error(`Missing value for --${name}.`);
    }
    flags.set(name, value);
  }

  const entry = flags.get('entry');
  const serverOutput = flags.get('server-output');
  const entriesOutput = flags.get('entries-output');
  const manifestOutput = flags.get('manifest-output');
  if (!entry || !serverOutput || !entriesOutput || !manifestOutput) {
    printUsage();
    throw new Error('Missing required compiler arguments.');
  }

  return {
    entry,
    serverOutput,
    entriesOutput,
    manifestOutput,
    artifactsOutput: flags.get('artifacts-output'),
    routesExport: flags.get('routes-export'),
    dryRun,
  };
}

function printUsage(): void {
  process.stdout.write(
    'Usage:\n' +
      '  route-compiler compile ' +
      '--entry <file> ' +
      '--server-output <file> ' +
      '--entries-output <dir> ' +
      '--manifest-output <file> ' +
      '[--artifacts-output <dir>] ' +
      '[--routes-export <name>] ' +
      '[--dry-run]\n',
  );
}

void main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});