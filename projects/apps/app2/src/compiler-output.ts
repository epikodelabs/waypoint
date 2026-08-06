import fs from 'node:fs/promises';
import path from 'node:path';

import type { RoutePolicy } from './navigation-delivery.js';

export interface Branch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly policies: readonly RoutePolicy[];
  readonly routeSetId?: string;
}

export interface ArtifactDescriptor {
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerIndex {
  readonly version: 1;
  readonly shards: readonly {
    readonly prefix: string;
    readonly file: string;
  }[];
  readonly artifacts: readonly ArtifactDescriptor[];
}

export interface ServerShard {
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
        'dist/.waypoint/app2',
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

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}
