import fs from 'node:fs/promises';
import path from 'node:path';

export interface SourceRef { readonly file: string; readonly exportName?: string; }
export interface Branch { readonly id: string; readonly kind: 'route'|'redirect'; readonly path: string; readonly staticPrefix: string; readonly name?: string; readonly policies: readonly import('./navigation-delivery.js').RoutePolicy[]; readonly routeSetId?: string; }
export interface ServerIndex { readonly version: 1; readonly shards: readonly { readonly prefix: string; readonly file: string }[]; readonly artifacts: readonly { readonly artifactKey: string; readonly dependencies: readonly string[]; readonly file?: string; readonly hash?: string }[]; }
export interface ServerShard { readonly version: 1; readonly branches: readonly Branch[]; }

const outputRoot = process.env['WAYPOINT_OUTPUT_ROOT']
  ? path.resolve(process.env['WAYPOINT_OUTPUT_ROOT'])
  : path.resolve(import.meta.dirname, '../waypoint');
const indexPath = process.env['WAYPOINT_SERVER_INDEX']
  ? path.resolve(process.env['WAYPOINT_SERVER_INDEX'])
  : path.join(outputRoot, 'server-index.json');

let indexPromise: Promise<ServerIndex> | undefined;
const shardPromises = new Map<string, Promise<ServerShard>>();
export function loadServerIndex(): Promise<ServerIndex> { return indexPromise ??= readJson<ServerIndex>(indexPath); }
export function resolveOutputPath(relative: string): string { return path.resolve(path.dirname(indexPath), relative); }
export function loadShard(file: string): Promise<ServerShard> {
  const absolute = resolveOutputPath(file);
  let pending = shardPromises.get(absolute);
  if (!pending) { pending = readJson<ServerShard>(absolute); shardPromises.set(absolute, pending); }
  return pending;
}
async function readJson<T>(file: string): Promise<T> { return JSON.parse(await fs.readFile(file, 'utf8')) as T; }
