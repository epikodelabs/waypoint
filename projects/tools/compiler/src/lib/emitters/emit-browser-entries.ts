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

export async function emitBrowserEntries(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<EmitBrowserEntriesResult> {
  if (planned.dryRun) {
    return {
      diagnostics: Object.freeze([
        diagnostic(
          'WPT3000',
          'info',
          `Planned ${plan.browserEntries.length} browser route entr${plan.browserEntries.length === 1 ? 'y' : 'ies'}.`,
        ),
      ]),
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  const target = path.resolve(planned.entriesOutput);
  const parent = path.dirname(target);
  const stem = path.basename(target);
  const token = `${process.pid}-${randomUUID()}`;
  const staging = path.join(parent, `.${stem}.staging-${token}`);
  const backup = path.join(parent, `.${stem}.backup-${token}`);

  const previousFiles = await listFiles(target);
  const nextFiles = new Set<string>();

  try {
    await fs.mkdir(staging, { recursive: true });

    for (const entry of plan.browserEntries) {
      const resolvedOutput = path.resolve(entry.outputPath);
      const relative = portableRelative(target, resolvedOutput);
      requireInsideDirectory(relative, resolvedOutput, target);
      nextFiles.add(relative);

      const stagedFile = path.join(staging, relative);
      await fs.mkdir(path.dirname(stagedFile), { recursive: true });
      await fs.writeFile(stagedFile, entry.contents, 'utf8');
    }

    const existed = await exists(target);
    if (existed) {
      await fs.rename(target, backup);
    }

    try {
      await fs.rename(staging, target);
    } catch (error) {
      if (existed && await exists(backup)) {
        await fs.rename(backup, target);
      }
      throw error;
    }

    await fs.rm(backup, { recursive: true, force: true }).catch(() => undefined);
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true }).catch(() => undefined);
    await fs.rm(backup, { recursive: true, force: true }).catch(() => undefined);

    return {
      diagnostics: Object.freeze([
        diagnostic(
          'WPT3001',
          'error',
          `Failed to publish browser entries atomically: ${formatError(error)}`,
        ),
      ]),
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  const emitted = Object.freeze(
    [...nextFiles].sort().map(relative => path.join(target, relative)),
  );
  const replaced = Object.freeze(
    [...nextFiles]
      .filter(relative => previousFiles.has(relative))
      .sort()
      .map(relative => path.join(target, relative)),
  );
  const removed = Object.freeze(
    [...previousFiles]
      .filter(relative => !nextFiles.has(relative))
      .sort()
      .map(relative => path.join(target, relative)),
  );

  return {
    diagnostics: Object.freeze([
      diagnostic(
        'WPT3000',
        'info',
        `Published ${plan.browserEntries.length} browser route entr${plan.browserEntries.length === 1 ? 'y' : 'ies'}; removed ${removed.length} stale file(s).`,
      ),
    ]),
    emitted,
    replaced,
    removed,
  };
}

async function listFiles(directory: string): Promise<Set<string>> {
  const result = new Set<string>();
  if (!await exists(directory)) return result;

  async function visit(current: string): Promise<void> {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile()) {
        result.add(portableRelative(directory, absolute));
      }
    }
  }

  await visit(directory);
  return result;
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function portableRelative(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/');
}

function requireInsideDirectory(
  relative: string,
  filePath: string,
  directory: string,
): void {
  if (relative === '..' || relative.startsWith('../')) {
    throw new Error(`Entry output "${filePath}" is outside "${directory}".`);
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
