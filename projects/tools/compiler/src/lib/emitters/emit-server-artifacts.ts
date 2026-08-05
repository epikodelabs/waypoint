import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactManifestDocument,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
} from '../compiler/contracts.js';

export interface EmitServerResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly replaced: readonly string[];
  readonly removed: readonly string[];
}

export interface ServerDeliveryDocuments {
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}

interface PublicationResource {
  readonly target: string;
  readonly staging: string;
  readonly backup: string;
  readonly kind: 'file' | 'directory';
  readonly existed: boolean;
}

export async function emitServerArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  delivery: ServerDeliveryDocuments = {
    serverIndex: plan.serverIndex,
    manifest: plan.manifest,
  },
): Promise<EmitServerResult> {
  if (planned.dryRun) {
    return {
      diagnostics: [diagnostic(
        'WPT3100',
        'info',
        `Planned ${delivery.manifest.routes.length} route branches, ${delivery.manifest.slots.length} slots, and ${delivery.manifest.routeSets.length} route sets into ${plan.serverShards.length} shard(s).`,
      )],
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  const shardDirectory = deriveShardDirectory(planned.serverOutput);
  const previousShardFiles = await listFiles(shardDirectory);
  const nextShardFiles = new Set(
    plan.serverShards.map(shard => portableRelative(shardDirectory, shard.outputPath)),
  );

  const token = `${process.pid}-${randomUUID()}`;
  const resources: PublicationResource[] = [];
  const serverExisted = await exists(planned.serverOutput);
  const manifestExisted = await exists(planned.manifestOutput);

  try {
    const stagedShardDirectory = siblingTemporaryPath(shardDirectory, 'staging', token);
    resources.push(await createResource(
      shardDirectory,
      stagedShardDirectory,
      siblingTemporaryPath(shardDirectory, 'backup', token),
      'directory',
    ));
    await fs.mkdir(stagedShardDirectory, { recursive: true });
    for (const shard of plan.serverShards) {
      const relative = portableRelative(shardDirectory, shard.outputPath);
      requireRelativeInside(relative, shard.outputPath, shardDirectory);
      await writeJson(path.join(stagedShardDirectory, relative), shard.document);
    }
    const stagedServer = siblingTemporaryPath(planned.serverOutput, 'staging', token);
    resources.push(await createResource(
      planned.serverOutput,
      stagedServer,
      siblingTemporaryPath(planned.serverOutput, 'backup', token),
      'file',
    ));
    await writeJson(stagedServer, delivery.serverIndex);

    const stagedManifest = siblingTemporaryPath(planned.manifestOutput, 'staging', token);
    resources.push(await createResource(
      planned.manifestOutput,
      stagedManifest,
      siblingTemporaryPath(planned.manifestOutput, 'backup', token),
      'file',
    ));
    await writeJson(stagedManifest, delivery.manifest);

    await commitResources(resources);
  } catch (error) {
    await cleanupResources(resources);
    return {
      diagnostics: [diagnostic(
        'WPT3101',
        'error',
        `Failed to publish server delivery documents atomically: ${formatError(error)}`,
      )],
      emitted: Object.freeze([]),
      replaced: Object.freeze([]),
      removed: Object.freeze([]),
    };
  }

  const emitted = Object.freeze([
    ...plan.serverShards.map(shard => shard.outputPath),
    planned.serverOutput,
    planned.manifestOutput,
  ]);
  const replaced = Object.freeze([
    ...[...nextShardFiles]
      .filter(relative => previousShardFiles.has(relative))
      .sort()
      .map(relative => path.join(shardDirectory, relative)),
    ...(serverExisted ? [planned.serverOutput] : []),
    ...(manifestExisted ? [planned.manifestOutput] : []),
  ]);
  const removed = Object.freeze([...previousShardFiles]
    .filter(relative => !nextShardFiles.has(relative))
    .sort()
    .map(relative => path.join(shardDirectory, relative)));

  return {
    diagnostics: [diagnostic(
      'WPT3100',
      'info',
      `Published ${delivery.manifest.routes.length} route branches, ${delivery.manifest.slots.length} slots, and ${delivery.manifest.routeSets.length} route sets into ${plan.serverShards.length} shard(s); removed ${removed.length} stale shard(s).`,
    )],
    emitted,
    replaced,
    removed,
  };
}

async function createResource(
  target: string,
  staging: string,
  backup: string,
  kind: PublicationResource['kind'],
): Promise<PublicationResource> {
  return {
    target,
    staging,
    backup,
    kind,
    existed: await exists(target),
  };
}

async function commitResources(resources: readonly PublicationResource[]): Promise<void> {
  const backedUp: PublicationResource[] = [];
  const published: PublicationResource[] = [];

  try {
    for (const resource of resources) {
      await fs.mkdir(path.dirname(resource.target), { recursive: true });
      if (resource.existed) {
        await fs.rename(resource.target, resource.backup);
        backedUp.push(resource);
      }
    }

    for (const resource of resources) {
      await fs.rename(resource.staging, resource.target);
      published.push(resource);
    }

    for (const resource of backedUp) {
      await removeResource(resource.backup, resource.kind);
    }
  } catch (error) {
    for (const resource of [...published].reverse()) {
      await removeResource(resource.target, resource.kind).catch(() => undefined);
    }
    for (const resource of [...backedUp].reverse()) {
      if (await exists(resource.backup)) {
        await fs.rename(resource.backup, resource.target).catch(() => undefined);
      }
    }
    throw error;
  } finally {
    await cleanupResources(resources);
  }
}

async function cleanupResources(resources: readonly PublicationResource[]): Promise<void> {
  for (const resource of resources) {
    await removeResource(resource.staging, resource.kind).catch(() => undefined);
    await removeResource(resource.backup, resource.kind).catch(() => undefined);
  }
}

async function removeResource(
  resourcePath: string,
  kind: PublicationResource['kind'],
): Promise<void> {
  if (kind === 'directory') {
    await fs.rm(resourcePath, { recursive: true, force: true });
  } else {
    await fs.rm(resourcePath, { force: true });
  }
}

function deriveShardDirectory(serverOutput: string): string {
  return path.join(
    path.dirname(serverOutput),
    `${path.basename(serverOutput, path.extname(serverOutput))}.shards`,
  );
}

function siblingTemporaryPath(
  target: string,
  role: 'staging' | 'backup',
  token: string,
): string {
  const directory = path.dirname(target);
  const name = path.basename(target);
  return path.join(directory, `.${name}.${role}-${token}`);
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function listFiles(directory: string): Promise<Set<string>> {
  const result = new Set<string>();
  if (!await exists(directory)) return result;

  async function visit(current: string): Promise<void> {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) result.add(portableRelative(directory, absolute));
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

function requireRelativeInside(relative: string, filePath: string, directory: string): void {
  if (relative === '..' || relative.startsWith('../')) {
    throw new Error(`Output "${filePath}" is outside publication directory "${directory}".`);
  }
}

function portableRelative(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/');
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
