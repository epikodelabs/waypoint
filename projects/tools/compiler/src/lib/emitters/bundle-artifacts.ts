import fs from 'node:fs/promises';
import path from 'node:path';
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
 * Bundles every route-set entry independently.
 *
 * Artifact Plan v1 explicitly forbids shared protected chunks, so each
 * artifact is built in its own esbuild invocation with splitting disabled.
 * All builds use write:false and are persisted only after every artifact has
 * built successfully, preventing publication of a partial artifact set.
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
    return {
      artifacts: Object.freeze([]),
      diagnostics: Object.freeze(diagnostics),
      emitted: Object.freeze([]),
    };
  }

  await fs.mkdir(planned.artifactsOutput, { recursive: true });
  await Promise.all(prepared.map(async item => {
    await fs.mkdir(path.dirname(item.artifact.outputPath), { recursive: true });
    await fs.writeFile(item.artifact.outputPath, item.outputFile.contents);
  }));

  const artifacts = Object.freeze(prepared
    .map(item => item.artifact)
    .sort((left, right) => left.artifactKey.localeCompare(right.artifactKey)));
  const emitted = Object.freeze(artifacts.map(artifact => artifact.outputPath));

  diagnostics.push(diagnostic(
    'WPT4000',
    'info',
    `Bundled ${artifacts.length} isolated browser artifact(s) into ${planned.artifactsOutput}.`,
  ));

  return {
    artifacts,
    diagnostics: Object.freeze(diagnostics),
    emitted,
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
    throw new Error(`esbuild did not return metadata for \"${artifact.artifactKey}\".`);
  }
  const outputMeta = readOutputMetadata(result.metafile, artifact);
  const outputPath = path.resolve(outputFile.path);

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
