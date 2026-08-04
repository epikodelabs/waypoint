import path from 'node:path';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedBrowserEntry,
  PlannedCompilerOutputs,
  PlannedServerShard,
  RouteArtifactManifestDocument,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
  ServerRouteShardDescriptor,
} from '../compiler/contracts.js';
import type { ExpandedNavigationModel } from '../ir/model.js';

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
  const browserEntries: PlannedBrowserEntry[] = [];

  for (const routeSet of model.routeSets) {
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

    const outputPath = path.join(
      planned.entriesOutput,
      `route-set-${safeEntryStem(routeSet.id)}.ts`,
    );
    const importPath = toModuleImportPath(outputPath, routeSet.source.filePath);
    browserEntries.push({
      routeSetId: routeSet.id,
      outputPath,
      sourceFile: routeSet.source.filePath,
      sourceExport,
      contents: `export { ${sourceExport} as default } from '${importPath}';\n`,
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

  const serverIndex: ServerRouteIndexDocument = {
    version: 1,
    entry: planned.entry,
    generatedAt,
    shards: Object.freeze(shardDescriptors),
    slots: model.slots,
    routeSets: model.routeSets,
  };

  const artifactByRouteSet = new Map<string, string>();
  for (const routeSet of model.routeSets) artifactByRouteSet.set(routeSet.id, routeSet.id);
  const manifest: RouteArtifactManifestDocument = {
    version: 1,
    generatedAt,
    slots: model.slots,
    routeSets: model.routeSets.map(routeSet => ({
      id: routeSet.id,
      slotId: routeSet.slotId,
      sourceFile: routeSet.source.filePath,
      sourceExport: routeSet.source.exportName,
      artifactKey: routeSet.id,
      branchIds: routeSet.branchIds,
      parentRouteSetId: routeSet.parentRouteSetId,
    })),
    routes: model.branches.map(branch => ({
      id: branch.id,
      path: branch.path,
      staticPrefix: branch.staticPrefix,
      name: branch.name,
      routeSetId: branch.routeSetId,
      artifactKey: branch.routeSetId
        ? artifactByRouteSet.get(branch.routeSetId)
        : undefined,
    })),
  };

  return {
    plan: {
      browserEntries: Object.freeze(browserEntries),
      serverShards: Object.freeze(serverShards),
      serverIndex,
      manifest,
    },
    diagnostics,
  };
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