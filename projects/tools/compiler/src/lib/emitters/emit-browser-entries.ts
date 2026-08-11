import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

export interface EmitBrowserEntriesResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly replaced: readonly string[];
  readonly removed: readonly string[];
}

/**
 * Publishes the complete generated-entry directory atomically.
 *
 * Entry files are compiler intermediates, but they are still observable build
 * output. A failed or interrupted compilation must therefore never leave a
 * mixed set from two compiler runs behind.
 */
export async function emitBrowserEntries(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<EmitBrowserEntriesResult> {
  if (planned.dryRun) {
    return {
      diagnostics: [diagnostic(
        'WPT3000',
        'info',
        `Planned ${plan.browserEntries.length} browser route-set entr${plan.browserEntries.length === 1 ? 'y' : 'ies'}.`,
        undefined,
        {},
        { stage: 'emit-entries' },
      )],
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  try {
    const publication = await publishEntryDirectory(
      planned.entriesOutput,
      plan,
    );

    return {
      diagnostics: [diagnostic(
        'WPT3000',
        'info',
        `Published ${plan.browserEntries.length} browser route-set entr${plan.browserEntries.length === 1 ? 'y' : 'ies'} into ${planned.entriesOutput}; removed ${publication.removed.length} stale file(s).`,
        undefined,
        {},
        { stage: 'emit-entries' },
      )],
      ...publication,
    };
  } catch (error) {
    return {
      diagnostics: [diagnostic(
        'WPT3001',
        'error',
        `Failed to publish browser route-set entries atomically: ${formatError(error)}`,
        undefined,
        {},
        { stage: 'emit-entries' },
      )],
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }
}

interface PublicationChanges {
  readonly emitted: readonly string[];
  readonly replaced: readonly string[];
  readonly removed: readonly string[];
}

async function publishEntryDirectory(
  outputDirectory: string,
  plan: RouteArtifactPlan,
): Promise<PublicationChanges> {
  const target = path.resolve(outputDirectory);
  const parent = path.dirname(target);
  const stem = path.basename(target);
  const token = `${process.pid}-${randomUUID()}`;
  const staging = path.join(parent, `.${stem}.staging-${token}`);
  const backup = path.join(parent, `.${stem}.backup-${token}`);
  const previousFiles = await listFiles(target);
  const nextFiles = new Set<string>();

  await fs.mkdir(parent, { recursive: true });

  try {
    await fs.mkdir(staging, { recursive: true });

    for (const entry of plan.browserEntries) {
      const relative = portableRelative(target, entry.outputPath);
      requireRelativeInside(relative, entry.outputPath, target);
      nextFiles.add(relative);

      const stagedPath = path.join(staging, relative);
      await fs.mkdir(path.dirname(stagedPath), { recursive: true });
      await fs.writeFile(stagedPath, entry.contents, 'utf8');
    }

    const hadTarget = await exists(target);
    if (hadTarget) await fs.rename(target, backup);

    try {
      await fs.rename(staging, target);
    } catch (error) {
      if (hadTarget && await exists(backup)) {
        await fs.rename(backup, target);
      }
      throw error;
    }

    if (await exists(backup)) {
      await fs.rm(backup, { recursive: true, force: true });
    }
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true }).catch(() => undefined);
    if (!await exists(target) && await exists(backup)) {
      await fs.rename(backup, target).catch(() => undefined);
    }
    throw error;
  } finally {
    await fs.rm(staging, { recursive: true, force: true }).catch(() => undefined);
    await fs.rm(backup, { recursive: true, force: true }).catch(() => undefined);
  }

  const emitted = [...nextFiles]
    .sort()
    .map(relative => path.join(target, relative));
  const replaced = [...nextFiles]
    .filter(relative => previousFiles.has(relative))
    .sort()
    .map(relative => path.join(target, relative));
  const removed = [...previousFiles]
    .filter(relative => !nextFiles.has(relative))
    .sort()
    .map(relative => path.join(target, relative));

  return {
    emitted: Object.freeze(emitted),
    replaced: Object.freeze(replaced),
    removed: Object.freeze(removed),
  };
}

async function listFiles(directory: string): Promise<Set<string>> {
  const result = new Set<string>();
  if (!await exists(directory)) return result;

  async function visit(current: string): Promise<void> {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) result.add(portableRelative(directory, absolute));
    }
  }

  await visit(directory);
  return result;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function requireRelativeInside(
  relative: string,
  filePath: string,
  directory: string,
): void {
  if (
    relative === '..'
    || relative.startsWith('../')
    || path.isAbsolute(relative)
  ) {
    throw new Error(
      `Entry output "${filePath}" is outside entry directory "${directory}".`,
    );
  }
}

function portableRelative(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/');
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}