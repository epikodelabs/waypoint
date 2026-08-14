import path from 'node:path';
import {
  build,
  type BuildResult,
  type Metafile,
  type OutputFile,
} from 'esbuild';

import type {
  PlannedRouteArtifact,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';
import type { AuthorizationDomain } from '../planning/authorization-domain.js';
import { domainKey } from '../planning/shared-bundles.js';
import {
  collectHostModuleExports,
  createHostRuntimePlugin,
} from './host-runtime-plugin.js';

export interface CompiledArtifactEntry {
  readonly artifact: PlannedRouteArtifact;
  readonly entryPoint: string;
}

export interface DomainBundleRouteOutput {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly outputPath: string;
  readonly fileName: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs: readonly string[];
}

export interface DomainBundleSharedOutput {
  readonly kind: 'shared';
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
  readonly consumers: readonly string[];
  readonly outputPath: string;
  readonly fileName: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs: readonly string[];
}

export interface DomainBundleResult {
  readonly routeArtifacts: readonly DomainBundleRouteOutput[];
  readonly sharedArtifacts: readonly DomainBundleSharedOutput[];
  readonly outputFiles: readonly OutputFile[];
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

/**
 * Builds one exact authorization audience at a time.
 * Different audiences never enter the same esbuild graph.
 */
export async function bundleArtifactDomain(
  authorization: AuthorizationDomain,
  entries: readonly CompiledArtifactEntry[],
  outputDirectory: string,
  hostExports: Awaited<ReturnType<typeof collectHostModuleExports>>,
): Promise<DomainBundleResult> {
  if (entries.length === 0) return empty();

  const entryPoints = Object.fromEntries(
    entries.map(({ artifact, entryPoint }) => [safeStem(artifact.artifactKey), entryPoint]),
  );

  const groupStem = domainKey(authorization);
  const result = await build({
    entryPoints,
    absWorkingDir: commonWorkingDirectory(entries.map(item => item.entryPoint)),
    outdir: outputDirectory,
    entryNames: `routes/${groupStem}/[name]-[hash]`,
    chunkNames: `shared/${groupStem}/[name]-[hash]`,
    assetNames: `assets/${groupStem}/[name]-[hash]`,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    splitting: entries.length > 1,
    packages: 'bundle',
    plugins: [createHostRuntimePlugin(hostExports)],
    metafile: true,
    write: false,
    logLevel: 'silent',
    legalComments: 'none',
    charset: 'utf8',
    target: 'es2022',
  });

  if (!result.metafile) {
    throw new Error(`esbuild did not return metadata for authorization domain "${groupStem}".`);
  }

  return classifyOutputs(authorization, entries, outputDirectory, result);
}

function classifyOutputs(
  authorization: AuthorizationDomain,
  entries: readonly CompiledArtifactEntry[],
  outputDirectory: string,
  result: BuildResult<{ metafile: true; write: false }>,
): DomainBundleResult {
  const entryByAbsolutePath = new Map(
    entries.map(item => [path.resolve(item.entryPoint), item.artifact]),
  );
  const outputByPath = new Map(
    result.outputFiles.map(file => [path.resolve(file.path), file]),
  );

  const routes: DomainBundleRouteOutput[] = [];
  const shared: DomainBundleSharedOutput[] = [];

  for (const [outputName, meta] of Object.entries(result.metafile.outputs)) {
    if (!outputName.endsWith('.js')) continue;

    const outputPath = path.resolve(outputName);
    requireInside(outputDirectory, outputPath);
    const file = outputByPath.get(outputPath);
    if (!file) throw new Error(`Missing esbuild output bytes for "${outputPath}".`);

    const entryPoint = meta.entryPoint ? path.resolve(meta.entryPoint) : undefined;
    if (entryPoint) {
      const artifact = entryByAbsolutePath.get(entryPoint);
      if (!artifact) throw new Error(`Unknown route entry "${entryPoint}" in esbuild metadata.`);

      routes.push(Object.freeze({
        kind: 'route',
        artifactKey: artifact.artifactKey,
        routeSetId: artifact.routeSetId,
        outputPath,
        fileName: path.basename(outputPath),
        hash: hashFromFileName(outputPath),
        bytes: file.contents.byteLength,
        imports: freezeImports(meta),
        inputs: Object.freeze(Object.keys(meta.inputs ?? {}).sort()),
      }));
      continue;
    }

    shared.push(Object.freeze({
      kind: 'shared',
      artifactKey: `shared:${domainKey(authorization)}:${hashFromFileName(outputPath)}`,
      authorization,
      consumers: Object.freeze(consumersOfChunk(outputPath, result.metafile, entries)),
      outputPath,
      fileName: path.basename(outputPath),
      hash: hashFromFileName(outputPath),
      bytes: file.contents.byteLength,
      imports: freezeImports(meta),
      inputs: Object.freeze(Object.keys(meta.inputs ?? {}).sort()),
    }));
  }

  return Object.freeze({
    routeArtifacts: Object.freeze(routes.sort(byArtifactKey)),
    sharedArtifacts: Object.freeze(shared.sort(byArtifactKey)),
    outputFiles: Object.freeze([...result.outputFiles]),
    diagnostics: Object.freeze([]),
  });
}

function consumersOfChunk(
  chunkPath: string,
  metafile: Metafile,
  entries: readonly CompiledArtifactEntry[],
): string[] {
  const consumers = new Set<string>();
  for (const [outputName, meta] of Object.entries(metafile.outputs)) {
    if (!meta.entryPoint) continue;
    const imports = meta.imports.map(item => path.resolve(path.dirname(outputName), item.path));
    if (!imports.includes(path.resolve(chunkPath))) continue;
    const entry = entries.find(item => path.resolve(item.entryPoint) === path.resolve(meta.entryPoint!));
    if (entry) consumers.add(entry.artifact.artifactKey);
  }
  return [...consumers].sort();
}

function freezeImports(meta: Metafile['outputs'][string]): readonly string[] {
  return Object.freeze([...new Set(meta.imports.map(item => item.path))].sort());
}

function hashFromFileName(file: string): string {
  const match = path.basename(file).match(/-([A-Z0-9]+)\.js$/i);
  if (!match?.[1]) throw new Error(`Cannot read content hash from "${file}".`);
  return match[1];
}

function requireInside(root: string, candidate: string): void {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Bundler output "${candidate}" is outside "${root}".`);
  }
}

function safeStem(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function commonWorkingDirectory(files: readonly string[]): string {
  if (files.length === 0) return process.cwd();
  let current = path.dirname(path.resolve(files[0]!));
  while (!files.every(file => {
    const relative = path.relative(current, path.resolve(file));
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  })) {
    const parent = path.dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
  return current;
}

function byArtifactKey(left: { readonly artifactKey: string }, right: { readonly artifactKey: string }): number {
  return left.artifactKey.localeCompare(right.artifactKey);
}

function empty(): DomainBundleResult {
  return Object.freeze({
    routeArtifacts: Object.freeze([]),
    sharedArtifacts: Object.freeze([]),
    outputFiles: Object.freeze([]),
    diagnostics: Object.freeze([]),
  });
}
