import type {
  ArtifactBundleResult,
  FinalizedDeliveryDocuments,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from './contracts.js';
import type {
  PreparedArtifactSources,
} from './prepared-artifact-sources.js';
import {
  bundleArtifacts,
} from '../emitters/bundle-artifacts.js';
import {
  emitBrowserEntries,
} from '../emitters/emit-browser-entries.js';
import {
  emitServerArtifacts,
} from '../emitters/emit-server-artifacts.js';
import {
  finalizeDeliveryDocuments,
} from '../planning/finalize-delivery.js';
import {
  validateFinalizedDelivery,
} from '../validation/validate-artifact-plan.js';

export interface BuildTransactionResult {
  readonly success: boolean;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly bundles?: ArtifactBundleResult;
  readonly delivery?: FinalizedDeliveryDocuments;
}

export interface WaypointBuildTransaction {
  readonly planned: PlannedCompilerOutputs;
  readonly plan: RouteArtifactPlan;
  readonly sources: PreparedArtifactSources;

  publish(): Promise<BuildTransactionResult>;
  rollback(): Promise<void>;
  dispose(): Promise<void>;
}

/**
 * Owns the post-plan build lifetime:
 *
 * entries -> bundle -> finalize -> validate -> publish
 *
 * It is the only layer allowed to decide when snapshots and prepared AOT
 * sources are no longer needed.
 */
export async function createBuildTransaction(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  sources: PreparedArtifactSources,
): Promise<WaypointBuildTransaction> {
  const entrySnapshot = planned.dryRun
    ? null
    : await snapshotDirectory(planned.entriesOutput);
  const artifactSnapshot = planned.dryRun
    ? null
    : await snapshotDirectory(planned.artifactsOutput);

  let completed = false;
  let disposed = false;

  async function rollback(): Promise<void> {
    if (completed) return;
    await Promise.all([
      entrySnapshot?.restore(),
      artifactSnapshot?.restore(),
    ]);
  }

  async function publish(): Promise<BuildTransactionResult> {
    if (completed) {
      throw new Error('Waypoint build transaction is already complete.');
    }
    if (disposed) {
      throw new Error('Waypoint build transaction is already disposed.');
    }

    const diagnostics: RouteCompilerDiagnostic[] = [];
    const emitted: string[] = [];

    const entries = await emitBrowserEntries(planned, plan);
    diagnostics.push(...entries.diagnostics);

    if (hasErrors(entries.diagnostics)) {
      await rollback();
      return freeze(false, diagnostics, emitted);
    }
    emitted.push(...entries.emitted);

    const bundles = await bundleArtifacts(
      planned,
      plan,
      sources,
    );
    diagnostics.push(...bundles.diagnostics);

    if (hasErrors(diagnostics)) {
      await rollback();
      return freeze(false, diagnostics, emitted, bundles);
    }
    emitted.push(...bundles.emitted);

    let delivery: FinalizedDeliveryDocuments;
    try {
      delivery = finalizeDeliveryDocuments(
        plan,
        bundles,
        planned.serverOutput,
        planned.manifestOutput,
      );
    } catch (error) {
      diagnostics.push({
        code: 'WPT3102',
        level: 'error',
        message:
          `Failed to finalize delivery metadata: ` +
          `${error instanceof Error ? error.message : String(error)}`,
        stage: 'finalize',
      });
      await rollback();
      return freeze(false, diagnostics, emitted, bundles);
    }

    const validated = validateFinalizedDelivery(
      plan,
      bundles,
      delivery,
    );
    diagnostics.push(...validated.diagnostics);

    if (hasErrors(diagnostics)) {
      await rollback();
      return freeze(false, diagnostics, emitted, bundles, delivery);
    }

    const server = await emitServerArtifacts(
      planned,
      plan,
      delivery,
    );
    diagnostics.push(...server.diagnostics);

    if (hasErrors(server.diagnostics)) {
      await rollback();
      return freeze(false, diagnostics, emitted, bundles, delivery);
    }
    emitted.push(...server.emitted);

    completed = true;
    await Promise.all([
      entrySnapshot?.discard(),
      artifactSnapshot?.discard(),
    ]);

    return freeze(true, diagnostics, emitted, bundles, delivery);
  }

  async function dispose(): Promise<void> {
    if (disposed) return;
    disposed = true;

    if (!completed) {
      await rollback();
    }

    await sources.dispose();
  }

  return Object.freeze({
    planned,
    plan,
    sources,
    publish,
    rollback,
    dispose,
  });
}

function hasErrors(
  diagnostics: readonly RouteCompilerDiagnostic[],
): boolean {
  return diagnostics.some(item => item.level === 'error');
}

function freeze(
  success: boolean,
  diagnostics: readonly RouteCompilerDiagnostic[],
  emitted: readonly string[],
  bundles?: ArtifactBundleResult,
  delivery?: FinalizedDeliveryDocuments,
): BuildTransactionResult {
  return Object.freeze({
    success,
    diagnostics: Object.freeze([...diagnostics]),
    emitted: Object.freeze([...emitted]),
    bundles,
    delivery,
  });
}

/*
 * Reuse the compiler's existing snapshot implementation here.
 * The extraction should move snapshotDirectory/restore/discard helpers out of
 * compile.ts into compiler/output-snapshot.ts.
 */
interface OutputSnapshot {
  restore(): Promise<void>;
  discard(): Promise<void>;
}

declare function snapshotDirectory(
  target: string,
): Promise<OutputSnapshot>;
