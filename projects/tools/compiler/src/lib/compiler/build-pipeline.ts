import type {
  FinalizedDeliveryDocuments,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from './contracts.js';
import {
  createBuildSession,
  type BuildSession,
} from './build-session.js';
import {
  createPublicationTransaction,
  type PublicationTransaction,
} from './publication-transaction.js';
import {
  finalizeRuntimeServerIndex,
} from '../planning/finalize-runtime-delivery.js';
import {
  finalizeBuildManifest,
} from '../planning/finalize-build-manifest.js';
import {
  emitBuildManifest,
} from '../emitters/emit-build-manifest.js';

export interface PreparedBuildPipeline {
  readonly session: BuildSession;
  readonly publication: PublicationTransaction;

  publish(): Promise<{
    readonly success: boolean;
    readonly diagnostics: readonly RouteCompilerDiagnostic[];
    readonly emitted: readonly string[];
  }>;

  dispose(): Promise<void>;
}

export async function prepareBuildPipeline(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
): Promise<PreparedBuildPipeline> {
  const session = await createBuildSession(planned, plan);

  try {
    const publication = await createPublicationTransaction(
      planned,
      plan,
    );

    async function publish() {
      const diagnostics: RouteCompilerDiagnostic[] = [];
      const emitted: string[] = [];

      const bundle = await session.bundle();
      diagnostics.push(...bundle.diagnostics);
      emitted.push(...bundle.emitted);

      if (diagnostics.some(item => item.level === 'error')) {
        await publication.rollback();

        return Object.freeze({
          success: false,
          diagnostics: Object.freeze(diagnostics),
          emitted: Object.freeze(emitted),
        });
      }

      const serverIndex = finalizeRuntimeServerIndex(
        plan,
        bundle,
        planned.serverOutput,
      );

      const runtime = await publication.commit(
        bundle,
        serverIndex,
      );

      diagnostics.push(...runtime.diagnostics);
      emitted.push(...runtime.emitted);

      if (!runtime.success) {
        return Object.freeze({
          success: false,
          diagnostics: Object.freeze(diagnostics),
          emitted: Object.freeze(emitted),
        });
      }

      if (planned.buildManifestOutput) {
        try {
          const manifest = finalizeBuildManifest(
            plan,
            bundle,
            planned.buildManifestOutput,
          );

          emitted.push(
            ...await emitBuildManifest(
              planned.buildManifestOutput,
              manifest,
            ),
          );
        } catch (error) {
          diagnostics.push({
            code: 'WPT3301',
            level: 'warning',
            message:
              `Runtime publication succeeded, but build manifest emission failed: ` +
              `${error instanceof Error ? error.message : String(error)}`,
          });
        }
      }

      return Object.freeze({
        success: true,
        diagnostics: Object.freeze(diagnostics),
        emitted: Object.freeze(emitted),
      });
    }

    async function dispose(): Promise<void> {
      await publication.dispose();
      await session.dispose();
    }

    return Object.freeze({
      session,
      publication,
      publish,
      dispose,
    });
  } catch (error) {
    await session.dispose();
    throw error;
  }
}
