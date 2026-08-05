import fs from 'node:fs/promises';
import path from 'node:path';
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
import { diagnostic, hasErrors } from './diagnostics.js';
import type { RouteCompilerDiagnostic, RouteCompilerOptions, RouteCompilerResult } from './contracts.js';

export async function compileRoutes(options: RouteCompilerOptions): Promise<RouteCompilerResult> {
  const planned = normalizeCompilerOptions(options);
  const diagnostics: RouteCompilerDiagnostic[] = [];

  if (!planned.dryRun) await ensureOutputDirectories(planned);

  const semantic = await resolveNavigationProgram(planned);
  diagnostics.push(...semantic.diagnostics);

  const evaluated = await evaluateStaticRouteData(semantic.program);
  diagnostics.push(...evaluated.diagnostics);

  const navigationIr = buildNavigationIr(semantic.program);
  const validatedIr = validateNavigationIr(navigationIr);
  diagnostics.push(...validatedIr.diagnostics);

  if (hasErrors(diagnostics)) {
    diagnostics.unshift(diagnostic(
      'WPT0002',
      'error',
      `Route compilation for ${path.basename(planned.entry)} stopped before expansion because Navigation IR validation failed.`,
    ));
    return { planned, diagnostics, emitted: [], implemented: true };
  }

  const expanded = expandNavigation(navigationIr);
  diagnostics.push(...expanded.diagnostics);

  const validatedExpanded = validateExpandedNavigation(expanded.model);
  diagnostics.push(...validatedExpanded.diagnostics);

  if (hasErrors(diagnostics)) {
    diagnostics.unshift(diagnostic(
      'WPT0002',
      'error',
      `Route compilation for ${path.basename(planned.entry)} stopped before emission because validation failed.`,
    ));
    return { planned, diagnostics, emitted: [], implemented: true };
  }

  const plannedArtifacts = planRouteArtifacts(planned, expanded.model);
  diagnostics.push(...plannedArtifacts.diagnostics);

  if (hasErrors(diagnostics)) {
    return { planned, diagnostics, emitted: [], implemented: true };
  }

  const emittedBrowser = await emitBrowserEntries(planned, plannedArtifacts.plan);
  diagnostics.push(...emittedBrowser.diagnostics);

  const artifactSnapshot = planned.dryRun
    ? null
    : await snapshotDirectory(planned.artifactsOutput);

  const bundled = await bundleArtifacts(planned, plannedArtifacts.plan);
  diagnostics.push(...bundled.diagnostics);

  if (hasErrors(diagnostics)) {
    await artifactSnapshot?.restore();
    diagnostics.unshift(diagnostic(
      'WPT0002',
      'error',
      `Route compilation for ${path.basename(planned.entry)} stopped before delivery metadata was emitted because artifact bundling failed.`,
    ));
    return {
      planned,
      diagnostics,
      emitted: emittedBrowser.emitted,
      implemented: true,
    };
  }

  let delivery;
  try {
    delivery = planned.dryRun
      ? {
          serverIndex: plannedArtifacts.plan.serverIndex,
          manifest: plannedArtifacts.plan.manifest,
        }
      : finalizeDeliveryDocuments(
          plannedArtifacts.plan,
          bundled,
          planned.serverOutput,
          planned.manifestOutput,
        );
  } catch (error) {
    await artifactSnapshot?.restore();
    diagnostics.push(diagnostic(
      'WPT3102',
      'error',
      `Failed to finalize delivery metadata: ${formatError(error)}`,
    ));
    return { planned, diagnostics, emitted: emittedBrowser.emitted, implemented: true };
  }

  const emittedServer = await emitServerArtifacts(
    planned,
    plannedArtifacts.plan,
    delivery,
  );
  diagnostics.push(...emittedServer.diagnostics);

  if (hasErrors(emittedServer.diagnostics)) {
    await artifactSnapshot?.restore();
    diagnostics.unshift(diagnostic(
      'WPT0002',
      'error',
      `Route compilation for ${path.basename(planned.entry)} restored the previous artifact set because delivery publication failed.`,
    ));
    return { planned, diagnostics, emitted: emittedBrowser.emitted, implemented: true };
  }

  await artifactSnapshot?.discard();

  diagnostics.unshift(diagnostic(
    'WPT0001',
    'info',
    `${planned.dryRun ? 'Planned' : 'Compiled'} routes from ${path.basename(planned.entry)}.`,
  ));

  return {
    planned,
    diagnostics,
    emitted: [...emittedBrowser.emitted, ...bundled.emitted, ...emittedServer.emitted],
    implemented: true,
  };
}

async function ensureOutputDirectories(planned: RouteCompilerResult['planned']): Promise<void> {
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

  if (existed) {
    await fs.cp(target, backup, { recursive: true, force: true });
  }

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
