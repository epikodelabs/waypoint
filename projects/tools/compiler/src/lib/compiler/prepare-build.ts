import path from 'node:path';

import type {
  RouteCompilerDiagnostic,
} from './contracts.js';
import type {
  WaypointAnalysis,
} from './analyze.js';
import {
  prepareBuildPipeline,
  type PreparedBuildPipeline,
} from './build-pipeline.js';
import {
  emitHostRuntimeEntry,
} from '../emitters/emit-host-runtime-entry.js';
import {
  emitHostEntry,
} from '../emitters/emit-host-entry.js';
import {
  planHostEntry,
} from '../planning/plan-host-entry.js';

export interface PreparedHostBuild {
  readonly routesEntry: string;
  readonly runtimeEntry: string;
}

export interface PreparedWaypointBuild {
  readonly analysis: WaypointAnalysis;
  readonly host: PreparedHostBuild;

  publish(): Promise<PreparedWaypointBuildResult>;
  rollback(): Promise<void>;
  dispose(): Promise<void>;
}

export interface PreparedWaypointBuildResult {
  readonly success: boolean;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export interface PrepareBuildOptions {
  readonly metadataRoot: string;
}

/**
 * High-level build façade.
 *
 * The caller does not need to know about BuildSession,
 * PublicationTransaction, AOT temp roots or output snapshots.
 */
export async function prepareBuild(
  analysis: WaypointAnalysis,
  options: PrepareBuildOptions,
): Promise<PreparedWaypointBuild> {
  if (!analysis.success || !analysis.plan) {
    throw new Error(
      'Cannot prepare a Waypoint build from an unsuccessful analysis.',
    );
  }

  const pipeline = await prepareBuildPipeline(
    analysis.planned,
    analysis.plan,
  );

  try {
    const hostRoot = path.join(
      options.metadataRoot,
      'host',
    );

    const runtime = await emitHostRuntimeEntry(
      path.join(hostRoot, 'waypoint-runtime.ts'),
      pipeline.session.sources.hostRuntimeModules,
    );

    const hostEntryPlan = planHostEntry(
      analysis.plan,
      path.join(hostRoot, 'app.routes.ts'),
    );

    const routesEntry = await emitHostEntry(
      hostEntryPlan,
    );

    let disposed = false;

    return Object.freeze({
      analysis,

      host: Object.freeze({
        routesEntry,
        runtimeEntry: runtime.outputPath,
      }),

      publish() {
        if (disposed) {
          throw new Error(
            'Prepared Waypoint build is already disposed.',
          );
        }
        return pipeline.publish();
      },

      rollback() {
        if (disposed) return Promise.resolve();
        return pipeline.publication.rollback();
      },

      async dispose() {
        if (disposed) return;
        disposed = true;
        await pipeline.dispose();
      },
    });
  } catch (error) {
    await pipeline.dispose();
    throw error;
  }
}
