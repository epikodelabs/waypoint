import fs from 'node:fs/promises';
import path from 'node:path';
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

  const bundled = await bundleArtifacts(planned, plannedArtifacts.plan);
  diagnostics.push(...bundled.diagnostics);

  if (hasErrors(diagnostics)) {
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

  const delivery = planned.dryRun
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

  const emittedServer = await emitServerArtifacts(
    planned,
    plannedArtifacts.plan,
    delivery,
  );
  diagnostics.push(...emittedServer.diagnostics);

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
    fs.mkdir(planned.artifactsOutput, { recursive: true }),
  ]);
}