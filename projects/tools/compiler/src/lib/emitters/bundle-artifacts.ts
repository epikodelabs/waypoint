import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { build, type BuildResult, type Metafile, type OutputFile } from 'esbuild';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  ArtifactBundleResult,
  BundledArtifact,
  PlannedCompilerOutputs,
  PlannedRouteArtifact,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

interface PreparedBundle {
  readonly artifact: BundledArtifact;
  readonly outputFile: OutputFile;
}

/**
 * Bundles every route-set entry independently and publishes the complete
 * artifact directory with one atomic directory swap.
 *
 * Artifact Plan v1 explicitly forbids shared protected chunks, so every
 * artifact is built in its own esbuild invocation with splitting disabled.
 * Nothing is published until all builds and all staging writes succeed.
 */
export async function bundleArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<ArtifactBundleResult> {
  if (planned.dryRun) {
    return {
      artifacts: Object.freeze([]),
      diagnostics: [diagnostic(
        'WPT4000',
        'info',
        `Planned ${plan.artifacts.length} isolated browser artifact(s) for ${planned.artifactsOutput}.`,
      )],
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  const diagnostics: RouteCompilerDiagnostic[] = [];
  const prepared: PreparedBundle[] = [];

  for (const artifact of plan.artifacts) {
    try {
      prepared.push(await buildArtifact(artifact));
    } catch (error) {
      diagnostics.push(diagnostic(
        'WPT4001',
        'error',
        `Failed to bundle route artifact "${artifact.artifactKey}": ${formatBuildError(error)}`,
        {
          filePath: artifact.source.file,
          exportName: artifact.source.exportName,
        },
      ));
    }
  }

  if (diagnostics.some(item => item.level === 'error')) {
    return emptyFailure(diagnostics);
  }

  let publication: PublicationChanges;
  try {
    publication = await publishArtifactDirectory(
      planned.artifactsOutput,
      prepared,
    );
  } catch (error) {
    diagnostics.push(diagnostic(
      'WPT4002',
      'error',
      `Failed to publish browser artifacts atomically: ${formatBuildError(error)}`,
    ));
    return emptyFailure(diagnostics);
  }

  const artifacts = Object.freeze(prepared
    .map(item => item.artifact)
    .sort((left, right) => left.artifactKey.localeCompare(right.artifactKey)));

  diagnostics.push(diagnostic(
    'WPT4000',
    'info',
    `Bundled and published ${artifacts.length} isolated browser artifact(s) into ${planned.artifactsOutput}; removed ${publication.removed.length} stale file(s).`,
  ));

  return {
    artifacts,
    diagnostics: Object.freeze(diagnostics),
    emitted: publication.emitted,
    replaced: publication.replaced,
    removed: publication.removed,
  };
}

function emptyFailure(
  diagnostics: readonly RouteCompilerDiagnostic[],
): ArtifactBundleResult {
  return {
    artifacts: Object.freeze([]),
    diagnostics: Object.freeze([...diagnostics]),
    emitted: Object.freeze([]),
    replaced: Object.freeze([]),
    removed: Object.freeze([]),
  };
}

async function buildArtifact(
  artifact: PlannedRouteArtifact,
): Promise<PreparedBundle> {
  const entryName = stripJsExtension(artifact.bundle.fileNameTemplate);
  const result = await build({
    entryPoints: [artifact.entry.outputPath],
    absWorkingDir: path.dirname(artifact.entry.outputPath),
    outdir: artifact.bundle.outputDirectory,
    entryNames: entryName,
    bundle: true,
    format: artifact.bundle.format,
    platform: artifact.bundle.platform,
    splitting: false,
    packages: 'external',
    metafile: true,
    write: false,
    logLevel: 'silent',
    legalComments: 'none',
    charset: 'utf8',
    target: 'es2022',
  });

  const outputFile = requireJavaScriptOutput(result, artifact);
  if (!result.metafile) {
    throw new Error(`esbuild did not return metadata for "${artifact.artifactKey}".`);
  }
  const outputMeta = readOutputMetadata(result.metafile, artifact);
  const outputPath = path.resolve(outputFile.path);
  requireInsideDirectory(artifact.bundle.outputDirectory, outputPath);

  return {
    outputFile,
    artifact: {
      artifactKey: artifact.artifactKey,
      routeSetId: artifact.routeSetId,
      outputPath,
      fileName: path.basename(outputPath),
      hash: outputFile.hash,
      bytes: outputFile.contents.byteLength,
      imports: Object.freeze(outputMeta.imports
        .map(item => item.path)
        .sort((left, right) => left.localeCompare(right))),
      inputs: Object.freeze(Object.keys(outputMeta.inputs)
        .sort((left, right) => left.localeCompare(right))),
    },
  };
}

interface PublicationChanges {
  readonly emitted: readonly string[];
  readonly replaced: readonly string[];
  readonly removed: readonly string[];
}

async function publishArtifactDirectory(
  outputDirectory: string,
  prepared: readonly PreparedBundle[],
): Promise<PublicationChanges> {
  const target = path.resolve(outputDirectory);
  const parent = path.dirname(target);
  const stem = path.basename(target);
  const token = `${process.pid}-${randomUUID()}`;
  const staging = path.join(parent, `.${stem}.staging-${token}`);
  const backup = path.join(parent, `.${stem}.backup-${token}`);

  await fs.mkdir(parent, { recursive: true });
  const previousFiles = await listFiles(target);
  const nextFiles = new Set<string>();

  try {
    await fs.mkdir(staging, { recursive: true });

    for (const item of prepared) {
      const relative = portableRelative(target, item.artifact.outputPath);
      if (relative.startsWith('../') || relative === '..') {
        throw new Error(
          `Artifact output "${item.artifact.outputPath}" is outside "${target}".`,
        );
      }
      nextFiles.add(relative);
      const stagedPath = path.join(staging, relative);
      await fs.mkdir(path.dirname(stagedPath), { recursive: true });
      await fs.writeFile(stagedPath, item.outputFile.contents);
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

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function requireInsideDirectory(directory: string, filePath: string): void {
  const relative = path.relative(path.resolve(directory), path.resolve(filePath));
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Output "${filePath}" is outside artifact directory "${directory}".`);
  }
}

function portableRelative(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/');
}

function requireJavaScriptOutput(
  result: BuildResult,
  artifact: PlannedRouteArtifact,
): OutputFile {
  const outputs = (result.outputFiles ?? []).filter(file => /\.(?:m?js)$/.test(file.path));
  if (outputs.length !== 1) {
    throw new Error(
      `Expected exactly one JavaScript output for "${artifact.artifactKey}" but received ${outputs.length}.`,
    );
  }
  return outputs[0]!;
}

function readOutputMetadata(
  metafile: Metafile,
  artifact: PlannedRouteArtifact,
): Metafile['outputs'][string] {
  const outputs = Object.entries(metafile.outputs)
    .filter(([file]) => /\.(?:m?js)$/.test(file));
  if (outputs.length !== 1) {
    throw new Error(
      `Expected exactly one JavaScript metadata output for "${artifact.artifactKey}" but received ${outputs.length}.`,
    );
  }
  return outputs[0]![1];
}

function stripJsExtension(template: string): string {
  return template.replace(/\.(?:m?js)$/i, '');
}

function formatBuildError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
