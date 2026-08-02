#!/usr/bin/env node
import { compileRoutes } from './compile.js';
import type {
  RouteCompilerOptions,
} from './types.js';

async function main(): Promise<void> {
  const command =
    process.argv[2];

  if (command !== 'compile') {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const options =
    readCompileOptions(
      process.argv.slice(3),
    );
  const result =
    await compileRoutes(options);

  for (const diagnostic of result.diagnostics) {
    const label =
      diagnostic.level.toUpperCase();
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
}

function readCompileOptions(
  args: readonly string[],
): RouteCompilerOptions {
  const flags =
    new Map<string, string>();

  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];

    if (!key?.startsWith('--') || !value) {
      printUsage();
      throw new Error(
        'Invalid compiler arguments.',
      );
    }

    flags.set(
      key.slice(2),
      value,
    );
  }

  const entry = flags.get('entry');
  const serverOutput =
    flags.get('server-output');
  const entriesOutput =
    flags.get('entries-output');
  const manifestOutput =
    flags.get('manifest-output');

  if (
    !entry ||
    !serverOutput ||
    !entriesOutput ||
    !manifestOutput
  ) {
    printUsage();
    throw new Error(
      'Missing required compiler arguments.',
    );
  }

  return {
    entry,
    serverOutput,
    entriesOutput,
    manifestOutput,
  };
}

function printUsage(): void {
  process.stdout.write(
    'Usage:\n' +
      '  route-compiler compile ' +
      '--entry <file> ' +
      '--server-output <file> ' +
      '--entries-output <dir> ' +
      '--manifest-output <file>\n',
  );
}

void main().catch(error => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
