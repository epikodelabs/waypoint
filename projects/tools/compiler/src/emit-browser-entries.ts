import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  CompiledRouteBranch,
  PlannedCompilerOutputs,
  RouteCompilerDiagnostic,
} from './types.js';

export interface EmitBrowserEntriesResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export async function emitBrowserEntries(
  planned: PlannedCompilerOutputs,
  branches: readonly CompiledRouteBranch[],
): Promise<EmitBrowserEntriesResult> {
  const emitted: string[] = [];
  const diagnostics: RouteCompilerDiagnostic[] = [];

  for (const branch of branches) {
    if (
      !branch.source?.filePath
      || !branch.source.exportName
    ) {
      diagnostics.push({
        level: 'warning',
        message:
          `Skipping browser entry emission for branch "${branch.id}" because no exported source reference was found.`,
      });
      continue;
    }

    const outputPath =
      path.join(
        planned.entriesOutput,
        `${toRouteEntryFileName(branch.id)}.ts`,
      );
    const importPath =
      toModuleImportPath(
        outputPath,
        branch.source.filePath,
      );
    const contents =
      `export { ${branch.source.exportName} as default } from '${importPath}';\n`;

    await fs.writeFile(
      outputPath,
      contents,
      'utf8',
    );
    emitted.push(outputPath);
  }

  return {
    diagnostics: diagnostics.length > 0
      ? diagnostics
      : [
          {
            level: 'info',
            message:
              `Emitted ${emitted.length} browser route entr${emitted.length === 1 ? 'y' : 'ies'}.`,
          },
        ],
    emitted,
  };
}

function toRouteEntryFileName(
  value: string,
): string {
  return `route-branch-${value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()}`;
}

function toModuleImportPath(
  outputPath: string,
  sourcePath: string,
): string {
  const importPath =
    path.relative(
      path.dirname(outputPath),
      sourcePath,
    )
      .replace(/\.[^.]+$/, '')
      .replace(/\\/g, '/');

  return importPath.startsWith('.')
    ? importPath
    : `./${importPath}`;
}
