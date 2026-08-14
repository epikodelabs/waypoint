import fs from 'node:fs/promises';
import path from 'node:path';

import { createServerRouterSnapshotSource } from '@epikodelabs/waypoint/server';
import type {
  ServerRouterIndex,
  ServerRouterShard,
  ServerArtifactRecord,
  ServerRouteBranch,
  ServerRoutePolicy,
} from '@epikodelabs/waypoint/server';

export interface Branch extends ServerRouteBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly policies: readonly ServerRoutePolicy[];
  readonly routeSetId?: string;
}

export interface ArtifactDescriptor extends ServerArtifactRecord {}

export interface ServerIndex extends ServerRouterIndex<ArtifactDescriptor> {
  readonly version: 1;
  readonly generatedAt: string;
  readonly shards: readonly {
    readonly prefix: string;
    readonly file: string;
  }[];
  readonly artifacts: readonly ArtifactDescriptor[];
}

export interface ServerShard extends ServerRouterShard<Branch> {
  readonly version: 1;
  readonly branches: readonly Branch[];
}

const workspaceRoot =
  path.resolve(process.cwd());

const outputRoot =
  process.env['WAYPOINT_OUTPUT_ROOT']
    ? path.resolve(
        process.env['WAYPOINT_OUTPUT_ROOT'],
      )
    : path.resolve(
        workspaceRoot,
        'dist/waypoint-generated/server',
      );

const indexPath =
  process.env['WAYPOINT_SERVER_INDEX']
    ? path.resolve(
        process.env['WAYPOINT_SERVER_INDEX'],
      )
    : path.join(
        outputRoot,
        'server-index.json',
      );

export function loadServerIndex(): Promise<ServerIndex> {
  return readJson<ServerIndex>(indexPath);
}

export async function readServerOutputRevision(): Promise<string> {
  const stat = await fs.stat(indexPath, { bigint: true });
  return `${stat.mtimeNs}:${stat.size}`;
}

export function resolveOutputPath(relative: string): string {
  const root = path.resolve(path.dirname(indexPath));
  const absolute = path.resolve(root, relative);
  const relation = path.relative(root, absolute);

  if (
    relation === '..'
    || relation.startsWith(`..${path.sep}`)
    || path.isAbsolute(relation)
  ) {
    throw new Error(
      `Compiler output path "${relative}" escapes "${root}".`,
    );
  }

  return absolute;
}

export function loadShard(file: string): Promise<ServerShard> {
  return readJson<ServerShard>(resolveOutputPath(file));
}

/** Cached, atomically refreshable view of one published compiler generation. */
export const compilerOutputSource = createServerRouterSnapshotSource<
  ArtifactDescriptor,
  Branch
>({
  loadIndex: loadServerIndex,
  loadShard,
  revision: readServerOutputRevision,
});

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}
