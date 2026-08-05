import path from 'node:path';
import { diagnostic } from '../compiler/diagnostics.js';
import {
  ARTIFACT_PLAN_VERSION,
  type PlannedBrowserEntry,
  type PlannedCompilerOutputs,
  type PlannedRouteArtifact,
  type PlannedServerShard,
  type RouteArtifactManifestDocument,
  type RouteArtifactPlan,
  type RouteCompilerDiagnostic,
  type ServerArtifactDescriptor,
  type ServerRouteIndexDocument,
  type ServerRouteShardDescriptor,
} from '../compiler/contracts.js';
import type { ExpandedNavigationModel, ExpandedRouteSet } from '../ir/model.js';

export interface PlanArtifactsResult {
  readonly plan: RouteArtifactPlan;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

export function planRouteArtifacts(
  planned: PlannedCompilerOutputs,
  model: ExpandedNavigationModel,
  generatedAt = new Date().toISOString(),
): PlanArtifactsResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const routeSetById = new Map<string, ExpandedRouteSet>();
  for (const routeSet of model.routeSets) routeSetById.set(routeSet.id, routeSet);

  const artifactKeyByRouteSet = new Map<string, string>();
  for (const routeSet of model.routeSets) artifactKeyByRouteSet.set(routeSet.id, routeSet.id);

  const orderedRouteSets = orderRouteSets(model.routeSets, routeSetById);
  const artifacts: PlannedRouteArtifact[] = [];
  const browserEntries: PlannedBrowserEntry[] = [];

  for (const routeSet of orderedRouteSets) {
    const sourceExport = routeSet.source.exportName;
    if (!sourceExport) {
      diagnostics.push(diagnostic(
        'WPT3001',
        'error',
        `Cannot plan route set "${routeSet.id}" because its routesFor() declaration is not exported.`,
        routeSet.source,
      ));
      continue;
    }

    const artifactKey = artifactKeyByRouteSet.get(routeSet.id)!;
    const dependencies = routeSet.parentRouteSetId
      ? Object.freeze([artifactKeyByRouteSet.get(routeSet.parentRouteSetId) ?? routeSet.parentRouteSetId])
      : Object.freeze([] as string[]);
    const outputPath = path.join(
      planned.entriesOutput,
      `route-set-${safeEntryStem(routeSet.id)}.ts`,
    );
    const importPath = toModuleImportPath(outputPath, routeSet.source.filePath);
    const contents = `export { ${sourceExport} as default } from '${importPath}';\n`;
    const fileNameTemplate = `${safeEntryStem(artifactKey)}-[hash].js`;

    artifacts.push({
      artifactKey,
      routeSetId: routeSet.id,
      slotId: routeSet.slotId,
      parentRouteSetId: routeSet.parentRouteSetId,
      dependencies,
      source: {
        file: routeSet.source.filePath,
        exportName: sourceExport,
      },
      entry: {
        outputPath,
        importPath,
        contents,
      },
      bundle: {
        outputDirectory: planned.artifactsOutput,
        fileNameTemplate,
        format: 'esm',
        platform: 'browser',
        isolated: true,
      },
      branchIds: routeSet.branchIds,
    });

    browserEntries.push({
      artifactKey,
      routeSetId: routeSet.id,
      dependencies,
      outputPath,
      sourceFile: routeSet.source.filePath,
      sourceExport,
      contents,
    });
  }

  const shardDirectory = path.join(
    path.dirname(planned.serverOutput),
    `${path.basename(planned.serverOutput, path.extname(planned.serverOutput))}.shards`,
  );
  const shardBuckets = new Map<string, typeof model.branches[number][]>();
  for (const branch of model.branches) {
    const bucket = shardBuckets.get(branch.staticPrefix);
    if (bucket) bucket.push(branch);
    else shardBuckets.set(branch.staticPrefix, [branch]);
  }

  const serverShards: PlannedServerShard[] = [];
  const shardDescriptors: ServerRouteShardDescriptor[] = [];
  for (const [prefix, branches] of shardBuckets) {
    branches.sort(compareBranches);
    const outputPath = path.join(shardDirectory, `${safeShardStem(prefix)}.json`);
    serverShards.push({
      prefix,
      outputPath,
      document: {
        version: 1,
        artifactPlanVersion: ARTIFACT_PLAN_VERSION,
        prefix,
        branches: Object.freeze(branches),
      },
    });
    shardDescriptors.push({
      prefix,
      file: path.relative(path.dirname(planned.serverOutput), outputPath).replace(/\\/g, '/'),
      branchCount: branches.length,
    });
  }
  serverShards.sort((left, right) => left.prefix.localeCompare(right.prefix));
  shardDescriptors.sort((left, right) => left.prefix.localeCompare(right.prefix));

  const serverArtifacts: ServerArtifactDescriptor[] = artifacts.map(artifact => ({
    artifactKey: artifact.artifactKey,
    routeSetId: artifact.routeSetId,
    slotId: artifact.slotId,
    parentRouteSetId: artifact.parentRouteSetId,
    dependencies: artifact.dependencies,
    branchCount: artifact.branchIds.length,
  }));

  const serverIndex: ServerRouteIndexDocument = {
    version: 1,
    artifactPlanVersion: ARTIFACT_PLAN_VERSION,
    entry: planned.entry,
    generatedAt,
    shards: Object.freeze(shardDescriptors),
    artifacts: Object.freeze(serverArtifacts),
    slots: model.slots,
    routeSets: model.routeSets,
  };

  const artifactByRouteSet = new Map<string, PlannedRouteArtifact>();
  for (const artifact of artifacts) artifactByRouteSet.set(artifact.routeSetId, artifact);

  const manifest: RouteArtifactManifestDocument = {
    version: 1,
    artifactPlanVersion: ARTIFACT_PLAN_VERSION,
    generatedAt,
    slots: model.slots,
    routeSets: model.routeSets.map(routeSet => {
      const artifact = artifactByRouteSet.get(routeSet.id);
      return {
        id: routeSet.id,
        slotId: routeSet.slotId,
        sourceFile: routeSet.source.filePath,
        sourceExport: routeSet.source.exportName ?? '',
        artifactKey: artifact?.artifactKey ?? routeSet.id,
        branchIds: routeSet.branchIds,
        parentRouteSetId: routeSet.parentRouteSetId,
        dependencies: artifact?.dependencies ?? Object.freeze([] as string[]),
      };
    }),
    artifacts: artifacts.map(artifact => ({
      artifactKey: artifact.artifactKey,
      routeSetId: artifact.routeSetId,
      slotId: artifact.slotId,
      parentRouteSetId: artifact.parentRouteSetId,
      dependencies: artifact.dependencies,
      entryFile: relativePortable(path.dirname(planned.manifestOutput), artifact.entry.outputPath),
      bundleDirectory: relativePortable(path.dirname(planned.manifestOutput), artifact.bundle.outputDirectory),
      fileNameTemplate: artifact.bundle.fileNameTemplate,
      branchIds: artifact.branchIds,
    })),
    routes: model.branches.map(branch => ({
      id: branch.id,
      path: branch.path,
      staticPrefix: branch.staticPrefix,
      name: branch.name,
      routeSetId: branch.routeSetId,
      artifactKey: branch.routeSetId
        ? artifactKeyByRouteSet.get(branch.routeSetId)
        : undefined,
    })),
  };

  return {
    plan: {
      version: ARTIFACT_PLAN_VERSION,
      generatedAt,
      entry: planned.entry,
      artifacts: Object.freeze(artifacts),
      browserEntries: Object.freeze(browserEntries),
      serverShards: Object.freeze(serverShards),
      serverIndex,
      manifest,
    },
    diagnostics,
  };
}

function orderRouteSets(
  routeSets: readonly ExpandedRouteSet[],
  byId: ReadonlyMap<string, ExpandedRouteSet>,
): readonly ExpandedRouteSet[] {
  const depth = new Map<string, number>();

  for (const routeSet of routeSets) {
    if (depth.has(routeSet.id)) continue;

    const pending: ExpandedRouteSet[] = [];
    let current: ExpandedRouteSet | undefined = routeSet;

    while (current && !depth.has(current.id)) {
      pending.push(current);
      current = current.parentRouteSetId
        ? byId.get(current.parentRouteSetId)
        : undefined;
    }

    let currentDepth = current ? depth.get(current.id) ?? 0 : -1;
    for (let index = pending.length - 1; index >= 0; index--) {
      currentDepth += 1;
      depth.set(pending[index]!.id, currentDepth);
    }
  }

  return Object.freeze([...routeSets].sort((left, right) =>
    (depth.get(left.id) ?? 0) - (depth.get(right.id) ?? 0)
      || left.id.localeCompare(right.id),
  ));
}

function compareBranches(
  left: ExpandedNavigationModel['branches'][number],
  right: ExpandedNavigationModel['branches'][number],
): number {
  return left.path.localeCompare(right.path) || left.id.localeCompare(right.id);
}

function safeEntryStem(value: string): string {
  return value.replace(/[^a-zA-Z0-9_.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function safeShardStem(prefix: string): string {
  if (prefix === '/') return 'root';
  return prefix.replace(/^\/+/, '')
    .replace(/[\\/]+/g, '__')
    .replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function toModuleImportPath(outputPath: string, sourcePath: string): string {
  const importPath = path.relative(path.dirname(outputPath), sourcePath)
    .replace(/\.[^.]+$/, '')
    .replace(/\\/g, '/');
  return importPath.startsWith('.') ? importPath : `./${importPath}`;
}

function relativePortable(from: string, to: string): string {
  const value = path.relative(from, to).replace(/\\/g, '/');
  return value || '.';
}