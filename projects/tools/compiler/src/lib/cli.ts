#!/usr/bin/env node
import { compile } from './compiler/compile.js';
import type {
  RouteCompilerDiagnostic,
  RouteCompilerOptions,
} from './compiler/contracts.js';

const BOOLEAN_FLAGS = new Set([
  'dry-run',
  'profile',
]);

const VALUE_FLAGS = new Set([
  'entry',
  'artifact-tsconfig',
  'server-output',
  'entries-output',
  'manifest-output',
  'artifacts-output',
  'routes-export',
]);

const MULTI_VALUE_FLAGS = new Set([
  'host-module',
]);

async function main(): Promise<void> {
  const command = process.argv[2];

  if (command === '--help' || command === '-h') {
    printUsage();
    return;
  }

  if (command !== 'compile') {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = await compile(
    readCompileOptions(process.argv.slice(3)),
  );

  for (const item of result.diagnostics) {
    writeDiagnostic(item);
  }

  process.stdout.write([
    `success: ${result.success}`,
    `entry: ${result.planned.entry}`,
    `artifactTsConfig: ${result.planned.artifactTsConfig}`,
    `hostModules: ${(result.planned.hostModules ?? []).join(', ') || '(default only)'}`,
    `serverOutput: ${result.planned.serverOutput}`,
    `entriesOutput: ${result.planned.entriesOutput}`,
    `manifestOutput: ${result.planned.manifestOutput}`,
    `artifactsOutput: ${result.planned.artifactsOutput}`,
    `dryRun: ${result.planned.dryRun}`,
    `emitted: ${result.emitted.length}`,
    '',
  ].join('\n'));

  if (result.timings.length > 0) {
    process.stdout.write('timings:\n');
    for (const timing of result.timings) {
      process.stdout.write(
        `  ${timing.stage}: ${timing.durationMs.toFixed(3)}ms\n`,
      );
    }
  }

  if (!result.success) {
    process.exitCode = 1;
  }
}

export function readCompileOptions(
  args: readonly string[],
): RouteCompilerOptions {
  const flags = new Map<string, string>();
  const multiFlags = new Map<string, string[]>();
  const booleans = new Set<string>();

  for (let index = 0; index < args.length; index++) {
    const key = args[index];

    if (key === '--help' || key === '-h') {
      printUsage();
      process.exit(0);
    }

    if (!key?.startsWith('--')) {
      throw new Error(
        `Unexpected compiler argument "${key ?? ''}".`,
      );
    }

    const name = key.slice(2);

    if (BOOLEAN_FLAGS.has(name)) {
      if (booleans.has(name)) {
        throw new Error(`Duplicate compiler flag --${name}.`);
      }
      booleans.add(name);
      continue;
    }

    if (!VALUE_FLAGS.has(name) && !MULTI_VALUE_FLAGS.has(name)) {
      throw new Error(`Unknown compiler flag --${name}.`);
    }

    const value = args[++index];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${name}.`);
    }

    if (MULTI_VALUE_FLAGS.has(name)) {
      const values = multiFlags.get(name) ?? [];
      values.push(value);
      multiFlags.set(name, values);
      continue;
    }

    if (flags.has(name)) {
      throw new Error(`Duplicate compiler flag --${name}.`);
    }

    flags.set(name, value);
  }

  const required = [
    'entry',
    'artifact-tsconfig',
    'server-output',
    'entries-output',
    'manifest-output',
  ] as const;

  const missing = required.filter(name => !flags.get(name));
  if (missing.length > 0) {
    throw new Error(
      `Missing required compiler flag${missing.length === 1 ? '' : 's'}: ${missing.map(name => `--${name}`).join(', ')}.`,
    );
  }

  return {
    entry: flags.get('entry')!,
    artifactTsConfig: flags.get('artifact-tsconfig')!,
    hostModules: multiFlags.get('host-module'),
    serverOutput: flags.get('server-output')!,
    entriesOutput: flags.get('entries-output')!,
    manifestOutput: flags.get('manifest-output')!,
    artifactsOutput: flags.get('artifacts-output'),
    routesExport: flags.get('routes-export'),
    dryRun: booleans.has('dry-run'),
    profile: booleans.has('profile'),
  };
}

function writeDiagnostic(item: RouteCompilerDiagnostic): void {
  const label = item.code
    ? `${item.level.toUpperCase()} ${item.code}`
    : item.level.toUpperCase();
  const location = item.source
    ? ` ${item.source.file}:${item.source.line ?? item.source.start}:${item.source.column ?? 0}`
    : '';
  const suggestion = item.suggestion
    ? `\n  suggestion: ${item.suggestion}`
    : '';
  const line = `[${label}]${location} ${item.message}${suggestion}\n`;

  if (item.level === 'error' || item.level === 'warning') {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
}

function printUsage(): void {
  process.stdout.write(
    'Usage:\n' +
      '  route-compiler compile ' +
      '--entry <file> ' +
      '--artifact-tsconfig <file> ' +
      '[--host-module <specifier>]... ' +
      '--server-output <file> ' +
      '--entries-output <dir> ' +
      '--manifest-output <file> ' +
      '[--artifacts-output <dir>] ' +
      '[--routes-export <name>] ' +
      '[--dry-run] ' +
      '[--profile]\n',
  );
}

void main().catch(error => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});