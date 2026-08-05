import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { normalizeCompilerOptions } from './config.js';
import { bundleArtifacts } from '../emitters/bundle-artifacts.js';
import { emitBrowserEntries } from '../emitters/emit-browser-entries.js';
import { planRouteArtifacts } from '../planning/plan-artifacts.js';
import { finalizeDeliveryDocuments } from '../planning/finalize-delivery.js';
import { emitServerArtifacts } from '../emitters/emit-server-artifacts.js';
import { buildNavigationIr } from '../ir/build-navigation-ir.js';
import { expandNavigation } from '../ir/expand-navigation.js';
import { resolveNavigationProgram } from '../resolution/resolve-navigation-program.js';
import { evaluateStaticRouteData } from '../resolution/evaluate-static-route-data.js';
import {
  validateExpandedNavigation,
  validateNavigationIr,
} from '../validation/validate-navigation.js';
import {
  validateArtifactPlan,
  validateFinalizedDelivery,
} from '../validation/validate-artifact-plan.js';
import { diagnostic, hasErrors } from './diagnostics.js';
import type {
  ArtifactBundleResult,
  CompilerInspection,
  CompilerStageName,
  CompilerStageTiming,
  FinalizedDeliveryDocuments,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  RouteCompilerOptions,
  RouteCompilerResult,
} from './contracts.js';
import type { SemanticNavigationProgram, ExpandedNavigationModel } from '../ir/model.js';
import type { NavigationIr } from '../ir/navigation-ir.js';

/** Stable Compiler Contracts v1 entry point. */
export async function compile(options: RouteCompilerOptions): Promise<RouteCompilerResult> {
  const planned = normalizeCompilerOptions(options);
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const timings: CompilerStageTiming[] = [];
  const emitted: string[] = [];

  let semantic: SemanticNavigationProgram | undefined;
  let navigationIr: NavigationIr | undefined;
  let expanded: ExpandedNavigationModel | undefined;
  let artifactPlan: RouteArtifactPlan | undefined;
  let bundles: ArtifactBundleResult | undefined;
  let delivery: FinalizedDeliveryDocuments | undefined;

  const run = async <T>(stage: CompilerStageName, action: () => T | Promise<T>): Promise<T> => {
    const started = performance.now();
    try {
      return await action();
    } finally {
      if (planned.profile) {
        timings.push(Object.freeze({
          stage,
          durationMs: Number((performance.now() - started).toFixed(3)),
        }));
      }
    }
  };

  const finish = (success: boolean): RouteCompilerResult => {
    const inspection: CompilerInspection | undefined = planned.inspect
      && semantic && navigationIr && expanded && artifactPlan
      ? Object.freeze({
          semantic,
          navigationIr,
          expanded,
          artifactPlan,
          bundles,
          delivery,
        })
      : undefined;

    return Object.freeze({
      planned,
      diagnostics: Object.freeze([...diagnostics]),
      emitted: Object.freeze([...emitted]),
      implemented: true,
      success,
      timings: Object.freeze([...timings]),
      inspection,
    });
  };

  if (!planned.dryRun) await ensureOutputDirectories(planned);

  const resolved = await run('resolve', () => resolveNavigationProgram(planned));
  semantic = resolved.program;
  diagnostics.push(...resolved.diagnostics);

  const evaluated = await run('evaluate', () => evaluateStaticRouteData(semantic!));
  diagnostics.push(...evaluated.diagnostics);

  navigationIr = await run('ir', () => buildNavigationIr(semantic!));
  const validatedIr = await run('validate-ir', () => validateNavigationIr(navigationIr!));
  diagnostics.push(...validatedIr.diagnostics);

  if (hasErrors(diagnostics)) {
    diagnostics.unshift(stopDiagnostic(planned, 'expansion', 'Navigation IR validation failed'));
    return finish(false);
  }

  const expandedResult = await run('expand', () => expandNavigation(navigationIr!));
  expanded = expandedResult.model;
  diagnostics.push(...expandedResult.diagnostics);

  const validatedExpanded = await run(
    'validate-expanded',
    () => validateExpandedNavigation(expanded!),
  );
  diagnostics.push(...validatedExpanded.diagnostics);

  if (hasErrors(diagnostics)) {
    diagnostics.unshift(stopDiagnostic(planned, 'planning', 'expanded navigation validation failed'));
    return finish(false);
  }

  const plannedArtifacts = await run('plan', () => planRouteArtifacts(planned, expanded!));
  artifactPlan = plannedArtifacts.plan;
  diagnostics.push(...plannedArtifacts.diagnostics);

  const validatedPlan = await run('validate-plan', () => validateArtifactPlan(artifactPlan!));
  diagnostics.push(...validatedPlan.diagnostics);

  if (hasErrors(diagnostics)) {
    diagnostics.unshift(stopDiagnostic(planned, 'emission', 'Artifact Plan v1 validation failed'));
    return finish(false);
  }

  const emittedBrowser = await run(
    'emit-entries',
    () => emitBrowserEntries(planned, artifactPlan!),
  );
  diagnostics.push(...emittedBrowser.diagnostics);
  emitted.push(...emittedBrowser.emitted);

  const artifactSnapshot = planned.dryRun
    ? null
    : await snapshotDirectory(planned.artifactsOutput);

  bundles = await run('bundle', () => bundleArtifacts(planned, artifactPlan!));
  diagnostics.push(...bundles.diagnostics);

  if (hasErrors(diagnostics)) {
    await artifactSnapshot?.restore();
    diagnostics.unshift(stopDiagnostic(planned, 'delivery finalization', 'artifact bundling failed'));
    return finish(false);
  }
  emitted.push(...bundles.emitted);

  try {
    delivery = await run('finalize', () => planned.dryRun
      ? {
          serverIndex: artifactPlan!.serverIndex,
          manifest: artifactPlan!.manifest,
        }
      : finalizeDeliveryDocuments(
          artifactPlan!,
          bundles!,
          planned.serverOutput,
          planned.manifestOutput,
        ));
  } catch (error) {
    await artifactSnapshot?.restore();
    diagnostics.push(diagnostic(
      'WPT3102',
      'error',
      `Failed to finalize delivery metadata: ${formatError(error)}`,
      undefined,
      {},
      { stage: 'finalize' },
    ));
    return finish(false);
  }

  if (!planned.dryRun) {
    const validatedDelivery = await run(
      'validate-delivery',
      () => validateFinalizedDelivery(artifactPlan!, bundles!, delivery!),
    );
    diagnostics.push(...validatedDelivery.diagnostics);
  }

  if (hasErrors(diagnostics)) {
    await artifactSnapshot?.restore();
    diagnostics.unshift(stopDiagnostic(planned, 'publication', 'delivery validation failed'));
    return finish(false);
  }

  const emittedServer = await run(
    'publish',
    () => emitServerArtifacts(planned, artifactPlan!, delivery!),
  );
  diagnostics.push(...emittedServer.diagnostics);

  if (hasErrors(emittedServer.diagnostics)) {
    await artifactSnapshot?.restore();
    diagnostics.unshift(stopDiagnostic(planned, 'completion', 'delivery publication failed and the previous artifact set was restored'));
    return finish(false);
  }
  emitted.push(...emittedServer.emitted);

  await artifactSnapshot?.discard();

  diagnostics.unshift(diagnostic(
    'WPT0001',
    'info',
    `${planned.dryRun ? 'Planned' : 'Compiled'} routes from ${path.basename(planned.entry)}.`,
  ));

  return finish(true);
}

/** Compatibility name retained for existing integrations. */
export const compileRoutes = compile;

function stopDiagnostic(
  planned: PlannedCompilerOutputs,
  before: string,
  reason: string,
): RouteCompilerDiagnostic {
  return diagnostic(
    'WPT0002',
    'error',
    `Route compilation for ${path.basename(planned.entry)} stopped before ${before} because ${reason}.`,
  );
}

async function ensureOutputDirectories(planned: PlannedCompilerOutputs): Promise<void> {
  await Promise.all([
    fs.mkdir(path.dirname(planned.serverOutput), { recursive: true }),
    fs.mkdir(planned.entriesOutput, { recursive: true }),
    fs.mkdir(path.dirname(planned.manifestOutput), { recursive: true }),
  ]);
}

interface DirectorySnapshot {
  restore(): Promise<void>;
  discard(): Promise<void>;
}

async function snapshotDirectory(directory: string): Promise<DirectorySnapshot> {
  const target = path.resolve(directory);
  const backup = path.join(
    path.dirname(target),
    `.${path.basename(target)}.compiler-snapshot-${process.pid}-${randomUUID()}`,
  );
  const existed = await pathExists(target);

  if (existed) await fs.cp(target, backup, { recursive: true, force: true });

  let settled = false;
  return {
    async restore(): Promise<void> {
      if (settled) return;
      settled = true;
      await fs.rm(target, { recursive: true, force: true });
      if (existed) await fs.rename(backup, target);
      else await fs.rm(backup, { recursive: true, force: true });
    },
    async discard(): Promise<void> {
      if (settled) return;
      settled = true;
      await fs.rm(backup, { recursive: true, force: true });
    },
  };
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
