import type {
  ArtifactBundleResult,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
} from './contracts.js';
import type {
  OutputSnapshot,
} from './output-snapshot.js';
import {
  snapshotDirectory,
} from './output-snapshot.js';
import {
  emitServerArtifacts,
} from '../emitters/emit-server-artifacts.js';

export interface PublicationTransaction {
  readonly planned: PlannedCompilerOutputs;
  readonly plan: RouteArtifactPlan;

  commit(
    bundle: ArtifactBundleResult,
    serverIndex: ServerRouteIndexDocument,
  ): Promise<PublicationResult>;

  rollback(): Promise<void>;
  dispose(): Promise<void>;
}

export interface PublicationResult {
  readonly success: boolean;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

/**
 * Owns mutable deployment state only.
 *
 * Protected artifact output may already have been staged/published by the
 * bundler; this transaction snapshots all deployment roots that must move
 * atomically with server metadata.
 */
export async function createPublicationTransaction(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<PublicationTransaction> {
  const snapshots: OutputSnapshot[] = [];

  if (!planned.dryRun) {
    snapshots.push(
      await snapshotDirectory(planned.artifactsOutput),
      await snapshotDirectory(serverShardRoot(planned.serverOutput)),
    );
  }

  let committed = false;
  let disposed = false;

  async function rollback(): Promise<void> {
    if (committed) return;
    await Promise.all(
      snapshots.map(snapshot => snapshot.restore()),
    );
  }

  async function commit(
    bundle: ArtifactBundleResult,
    serverIndex: ServerRouteIndexDocument,
  ): Promise<PublicationResult> {
    if (disposed) {
      throw new Error('Waypoint publication transaction is already disposed.');
    }
    if (committed) {
      throw new Error('Waypoint publication transaction is already committed.');
    }

    const result = await emitServerArtifacts(
      planned,
      plan,
      {
        serverIndex,
      } as any,
    );

    const failed = result.diagnostics.some(
      diagnostic => diagnostic.level === 'error',
    );

    if (failed) {
      await rollback();

      return Object.freeze({
        success: false,
        diagnostics: result.diagnostics,
        emitted: result.emitted,
      });
    }

    committed = true;

    await Promise.all(
      snapshots.map(snapshot => snapshot.discard()),
    );

    return Object.freeze({
      success: true,
      diagnostics: result.diagnostics,
      emitted: result.emitted,
    });
  }

  async function dispose(): Promise<void> {
    if (disposed) return;
    disposed = true;

    if (!committed) {
      await rollback();
    }
  }

  return Object.freeze({
    planned,
    plan,
    commit,
    rollback,
    dispose,
  });
}

function serverShardRoot(serverOutput: string): string {
  return `${serverOutput}.shards`;
}
