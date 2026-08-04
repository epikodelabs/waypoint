import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  CompiledRouteBranch,
  PlannedCompilerOutputs,
  RouteArtifactManifestDocument,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
  ServerRouteShardDescriptor,
  ServerRouteShardDocument,
} from './types.js';

export interface EmitServerResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export async function emitServerArtifacts(
  planned: PlannedCompilerOutputs,
  branches: readonly CompiledRouteBranch[],
): Promise<EmitServerResult> {
  const generatedAt =
    new Date().toISOString();
  const shards =
    groupBranchesByPrefix(branches);
  const shardDirectory =
    path.join(
      path.dirname(planned.serverOutput),
      `${path.basename(
        planned.serverOutput,
        path.extname(planned.serverOutput),
      )}.shards`,
    );
  await fs.mkdir(
    shardDirectory,
    { recursive: true },
  );

  const shardDescriptors: ServerRouteShardDescriptor[] = [];
  const emitted: string[] = [];

  for (const [prefix, prefixBranches] of shards) {
    const fileName =
      `${toSafeFileStem(prefix)}.json`;
    const outputPath =
      path.join(
        shardDirectory,
        fileName,
      );
    const shardDocument: ServerRouteShardDocument = {
      version: 1,
      prefix,
      branches: prefixBranches,
    };

    await fs.writeFile(
      outputPath,
      `${JSON.stringify(shardDocument, null, 2)}\n`,
      'utf8',
    );

    emitted.push(outputPath);
    shardDescriptors.push({
      prefix,
      file: path.relative(
        path.dirname(planned.serverOutput),
        outputPath,
      ).replace(/\\/g, '/'),
      branchCount:
        prefixBranches.length,
    });
  }

  const indexDocument: ServerRouteIndexDocument = {
    version: 1,
    entry: planned.entry,
    generatedAt,
    shards: shardDescriptors.sort((left, right) =>
      left.prefix.localeCompare(right.prefix),
    ),
  };

  await fs.writeFile(
    planned.serverOutput,
    `${JSON.stringify(indexDocument, null, 2)}\n`,
    'utf8',
  );
  emitted.push(planned.serverOutput);

  const manifestDocument: RouteArtifactManifestDocument = {
    version: 1,
    generatedAt,
    routes: branches.map(branch => ({
      id: branch.id,
      path: branch.path,
      staticPrefix: branch.staticPrefix,
      name: branch.name,
      artifactKey: branch.id,
    })),
  };

  await fs.writeFile(
    planned.manifestOutput,
    `${JSON.stringify(manifestDocument, null, 2)}\n`,
    'utf8',
  );
  emitted.push(planned.manifestOutput);

  return {
    diagnostics: [
      {
        level: 'info',
        message:
          `Emitted ${branches.length} compiled route branches into ${shards.size} server shard(s).`,
      },
    ],
    emitted,
  };
}

function groupBranchesByPrefix(
  branches: readonly CompiledRouteBranch[],
): ReadonlyMap<
  string,
  readonly CompiledRouteBranch[]
> {
  const shards =
    new Map<
      string,
      CompiledRouteBranch[]
    >();

  for (const branch of branches) {
    const current =
      shards.get(
        branch.staticPrefix,
      ) ?? [];
    current.push(branch);
    shards.set(
      branch.staticPrefix,
      current,
    );
  }

  return new Map(
    Array.from(shards.entries()).map(
      ([prefix, prefixBranches]) => [
        prefix,
        Object.freeze(
          [...prefixBranches].sort((left, right) =>
            left.path.localeCompare(right.path),
          ),
        ),
      ],
    ),
  );
}

function toSafeFileStem(
  prefix: string,
): string {
  if (prefix === '/') {
    return 'root';
  }

  return prefix
    .replace(/^\/+/, '')
    .replace(/[\\/]+/g, '__')
    .replace(/[^a-zA-Z0-9_.-]/g, '_');
}
