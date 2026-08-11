import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
import * as angularCompilerCli from '@angular/compiler-cli';
import type { AngularCompilerOptions } from '@angular/compiler-cli';

import type {
  PlannedCompilerOutputs,
  PlannedRouteArtifact,
  RouteArtifactPlan,
} from '../compiler/contracts.js';

export interface CompiledArtifactSources {
  /** Temporary root containing full Angular AOT output. */
  readonly outputRoot: string;
  /** Returns a generated ESM entry for one planned route artifact. */
  entryFor(artifact: PlannedRouteArtifact): Promise<string>;
  dispose(): Promise<void>;
}

const {
  formatDiagnostics,
  performCompilation,
  readConfiguration,
} = angularCompilerCli as unknown as {
  formatDiagnostics(
    diagnostics: readonly ts.Diagnostic[],
    host?: ts.FormatDiagnosticsHost,
  ): string;
  readConfiguration(
    project: string,
    existingOptions?: AngularCompilerOptions,
  ): {
    options: AngularCompilerOptions;
    rootNames: string[];
    emitFlags: number;
    errors: ts.Diagnostic[];
  };
  performCompilation(args: {
    rootNames: string[];
    options: AngularCompilerOptions;
    emitFlags?: number;
  }): {
    diagnostics: readonly ts.Diagnostic[];
  };
};

/**
 * Compiles the authored route project with Angular's full AOT compiler once.
 *
 * Route artifacts are application code, not publishable Angular libraries, so
 * they must contain executable Ivy definitions before esbuild packages them.
 * Running plain TypeScript/esbuild over decorator source would leave runtime
 * compilation requirements in independently delivered modules.
 */
export async function compileArtifactSources(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<CompiledArtifactSources> {
  const outputRoot = path.join(
    path.dirname(planned.entriesOutput),
    `.waypoint-aot-${process.pid}-${randomUUID()}`,
  );

  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });

  try {
    const config = readConfiguration(planned.artifactTsConfig, {
      rootDir: planned.cwd,
      outDir: outputRoot,
      declaration: false,
      declarationMap: false,
      emitDeclarationOnly: false,
      sourceMap: false,
      inlineSourceMap: false,
      inlineSources: false,
      noEmit: false,
      noEmitOnError: true,
      compilationMode: 'full',
    } satisfies AngularCompilerOptions);

    requireNoAngularDiagnostics(config.errors, planned.artifactTsConfig);

    const result = performCompilation({
      rootNames: config.rootNames,
      options: config.options,
      emitFlags: config.emitFlags,
    });

    requireNoAngularDiagnostics(result.diagnostics, planned.artifactTsConfig);

    const entriesRoot = path.join(outputRoot, '.waypoint-entries');
    await fs.mkdir(entriesRoot, { recursive: true });

    return {
      outputRoot,
      async entryFor(artifact): Promise<string> {
        const emittedSource = emittedJavaScriptPath(
          planned.cwd,
          outputRoot,
          artifact.source.file,
        );
        await requireFile(emittedSource, artifact);

        const entryPath = path.join(
          entriesRoot,
          `route-set-${safeStem(artifact.artifactKey)}.mjs`,
        );
        const importPath = relativeImport(entryPath, emittedSource);
        await fs.writeFile(
          entryPath,
          `export { ${artifact.source.exportName} as default } from ${JSON.stringify(importPath)};\n`,
          'utf8',
        );
        return entryPath;
      },
      async dispose(): Promise<void> {
        await fs.rm(outputRoot, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await fs.rm(outputRoot, { recursive: true, force: true });
    throw error;
  }
}

function emittedJavaScriptPath(
  workspaceRoot: string,
  outputRoot: string,
  sourceFile: string,
): string {
  const relative = path.relative(workspaceRoot, sourceFile);
  requireRelativeInside(relative, sourceFile, workspaceRoot);

  return path.join(
    outputRoot,
    relative.replace(/\.(?:[cm]?ts|tsx)$/i, '.js'),
  );
}

async function requireFile(
  file: string,
  artifact: PlannedRouteArtifact,
): Promise<void> {
  try {
    const stat = await fs.stat(file);
    if (stat.isFile()) return;
  } catch {
    // Fall through to the artifact-specific error below.
  }

  throw new Error(
    `Angular AOT did not emit route source ${JSON.stringify(artifact.source.file)} ` +
    `for artifact ${JSON.stringify(artifact.artifactKey)}. Expected ${JSON.stringify(file)}.`,
  );
}

function requireNoAngularDiagnostics(
  diagnostics: readonly ts.Diagnostic[],
  project: string,
): void {
  const errors = diagnostics.filter(item => item.category === ts.DiagnosticCategory.Error);
  if (errors.length === 0) return;

  throw new Error(
    `Angular AOT compilation failed for ${JSON.stringify(project)}:\n${formatDiagnostics(errors)}`,
  );
}

function relativeImport(fromFile: string, targetFile: string): string {
  let relative = path.relative(path.dirname(fromFile), targetFile).replace(/\\/g, '/');
  if (!relative.startsWith('.')) relative = `./${relative}`;
  return relative;
}

function safeStem(value: string): string {
  return value.replace(/[^a-zA-Z0-9_.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function requireRelativeInside(
  relative: string,
  target: string,
  root: string,
): void {
  if (
    relative === '..'
    || relative.startsWith('../')
    || path.isAbsolute(relative)
  ) {
    throw new Error(
      `Artifact source ${JSON.stringify(target)} is outside compiler workspace ${JSON.stringify(root)}.`,
    );
  }
}
