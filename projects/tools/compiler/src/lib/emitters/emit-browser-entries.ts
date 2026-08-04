import fs from 'node:fs/promises';
import path from 'node:path';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

export interface EmitBrowserEntriesResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export async function emitBrowserEntries(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<EmitBrowserEntriesResult> {
  const emitted: string[] = [];

  if (!planned.dryRun) {
    await fs.mkdir(planned.entriesOutput, { recursive: true });
    for (const entry of plan.browserEntries) {
      await fs.mkdir(path.dirname(entry.outputPath), { recursive: true });
      await fs.writeFile(entry.outputPath, entry.contents, 'utf8');
      emitted.push(entry.outputPath);
    }
  }

  return {
    diagnostics: [diagnostic(
      'WPT3000',
      'info',
      `${planned.dryRun ? 'Planned' : 'Emitted'} ${plan.browserEntries.length} browser route-set entr${plan.browserEntries.length === 1 ? 'y' : 'ies'}.`,
    )],
    emitted,
  };
}