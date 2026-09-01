import { existsSync } from 'node:fs';
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

/**
 * Angular's Vite dev server executes application code with process.cwd()
 * pointing at `.angular/vite-root`. Find the real workspace rather than
 * treating the temporary Vite root as the repository root.
 */
const workspaceRoot =
  findAngularWorkspaceRoot(
    process.cwd(),
  );

const clientBuildRoot =
  path.resolve(
    workspaceRoot,
    'dist/app2-client',
  );

const clientServerOutputRoot =
  path.join(
    clientBuildRoot,
    '.waypoint',
    'server',
  );

const packagedOutputRoot =
  path.resolve(
    import.meta.dirname,
    '../waypoint',
  );

/**
 * app2-client's Waypoint builder owns one atomic generation:
 *
 *   dist/app2-client/
 *     browser/
 *     protected/
 *     .waypoint/server/
 *
 * app2-server consumes that generation. A packaged server-local generation is
 * only a fallback when the client build output is not available.
 */
const defaultOutputRoot =
  existsSync(
    path.join(
      clientServerOutputRoot,
      'server-index.json',
    ),
  )
    ? clientServerOutputRoot
    : packagedOutputRoot;

const outputRoot =
  process.env['WAYPOINT_OUTPUT_ROOT']
    ? path.resolve(
        process.env['WAYPOINT_OUTPUT_ROOT'],
      )
    : defaultOutputRoot;

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
  return readJson<ServerIndex>(
    indexPath,
  );
}

export async function readServerOutputRevision(): Promise<string> {
  const stat =
    await statWithRetry(
      indexPath,
    );

  return `${stat.mtimeMs}:${stat.size}`;
}

export function resolveOutputPath(
  relative: string,
): string {
  const serverRoot =
    path.resolve(
      path.dirname(indexPath),
    );

  /*
   * Server metadata intentionally lives below `.waypoint/server` while
   * protected browser artifacts live in the sibling top-level `protected`
   * directory. Therefore a valid artifact record may contain:
   *
   *   ../../protected/<artifact>.js
   *
   * Confinement belongs at the complete Waypoint build root, not the
   * server-index directory.
   */
  const buildRoot =
    process.env['WAYPOINT_BUILD_ROOT']
      ? path.resolve(
          process.env['WAYPOINT_BUILD_ROOT'],
        )
      : inferBuildRoot(serverRoot);

  const absolute =
    path.resolve(
      serverRoot,
      relative,
    );

  const relation =
    path.relative(
      buildRoot,
      absolute,
    );

  if (
    relation === '..'
    || relation.startsWith(
      `..${path.sep}`,
    )
    || path.isAbsolute(relation)
  ) {
    throw new Error(
      `Compiler output path "${relative}" escapes Waypoint build root "${buildRoot}".`,
    );
  }

  return absolute;
}

export function loadShard(
  file: string,
): Promise<ServerShard> {
  return readJson<ServerShard>(
    resolveOutputPath(file),
  );
}

/** Cached, atomically refreshable view of one published compiler generation. */
export const compilerOutputSource =
  createServerRouterSnapshotSource<
    ArtifactDescriptor,
    Branch
  >({
    loadIndex: loadServerIndex,
    loadShard,
    revision: readServerOutputRevision,
  });

export const compilerOutputDiagnostics =
  Object.freeze({
    workspaceRoot,
    clientBuildRoot,
    clientServerOutputRoot,
    packagedOutputRoot,
    outputRoot,
    indexPath,
  });

function inferBuildRoot(
  serverRoot: string,
): string {
  const parent =
    path.dirname(serverRoot);

  if (
    path.basename(serverRoot) === 'server'
    && path.basename(parent) === '.waypoint'
  ) {
    return path.resolve(
      serverRoot,
      '..',
      '..',
    );
  }

  /*
   * Packaged/custom layouts may place server metadata in a named directory
   * directly below their generation root. Allow sibling artifacts while still
   * preventing escape from that generation.
   */
  return path.dirname(serverRoot);
}

function findAngularWorkspaceRoot(
  start: string,
): string {
  let current =
    path.resolve(start);

  while (true) {
    if (
      existsSync(
        path.join(
          current,
          'angular.json',
        ),
      )
      && existsSync(
        path.join(
          current,
          'package.json',
        ),
      )
    ) {
      return current;
    }

    const parent =
      path.dirname(current);

    if (parent === current) {
      throw new Error(
        `Could not locate Angular workspace root from "${start}".`,
      );
    }

    current = parent;
  }
}

async function readJson<T>(
  file: string,
): Promise<T> {
  const contents =
    await readFileWithRetry(file);

  return JSON.parse(
    contents,
  ) as T;
}

const RETRY_DELAY_MS = 100;
const RETRY_TIMEOUT_MS = 5000;

async function statWithRetry(
  file: string,
): Promise<Awaited<ReturnType<typeof fs.stat>>> {
  return retryMissingFile(
    () => fs.stat(file, { bigint: true }),
    file,
  );
}

async function readFileWithRetry(
  file: string,
): Promise<string> {
  return retryMissingFile(
    () => fs.readFile(file, 'utf8'),
    file,
  );
}

async function retryMissingFile<T>(
  action: () => Promise<T>,
  file: string,
): Promise<T> {
  const deadline =
    Date.now() + RETRY_TIMEOUT_MS;

  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      return await action();
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }

      lastError = error;
      await delay(RETRY_DELAY_MS);
    }
  }

  throw lastError
    ?? new Error(
      `Timed out waiting for compiler output "${file}".`,
    );
}

function isMissingFileError(
  error: unknown,
): error is NodeJS.ErrnoException {
  return !!error
    && typeof error === 'object'
    && 'code' in error
    && (
      error as NodeJS.ErrnoException
    ).code === 'ENOENT';
}

function delay(
  ms: number,
): Promise<void> {
  return new Promise(resolve => {
    setTimeout(
      resolve,
      ms,
    );
  });
}