import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeCompilerOptions } from './config.js';
import { bundleArtifacts } from './bundle-artifacts.js';
import { emitBrowserEntries } from './emit-browser-entries.js';
import { emitServerArtifacts } from './emit-server.js';
import { buildRouteGraph } from './graph-builder.js';
import { parseRoutes } from './parse-routes.js';
import { evaluateStaticRouteData } from './static-evaluator.js';
import type {
  RouteCompilerDiagnostic,
  RouteCompilerOptions,
  RouteCompilerResult,
} from './types.js';

export async function compileRoutes(
  options: RouteCompilerOptions,
): Promise<RouteCompilerResult> {
  const planned =
    normalizeCompilerOptions(options);
  const diagnostics: RouteCompilerDiagnostic[] = [];

  await ensureOutputDirectories(planned);

  const parsed =
    await parseRoutes(planned);
  diagnostics.push(...parsed.diagnostics);

  const evaluated =
    await evaluateStaticRouteData(parsed.graph);
  diagnostics.push(...evaluated.diagnostics);

  const built =
    buildRouteGraph(parsed.graph);
  diagnostics.push(...built.diagnostics);

  const emittedServer =
    await emitServerArtifacts(
      planned,
      built.branches,
    );
  diagnostics.push(...emittedServer.diagnostics);

  const emittedBrowser =
    await emitBrowserEntries(
      planned,
      built.branches,
    );
  diagnostics.push(...emittedBrowser.diagnostics);

  const bundled =
    await bundleArtifacts(planned);
  diagnostics.push(...bundled.diagnostics);

  diagnostics.unshift({
    level: 'info',
    message:
      `Planned route compilation for ${path.basename(planned.entry)}.`,
  });

  return {
    planned,
    diagnostics,
    emitted: [
      ...emittedServer.emitted,
      ...emittedBrowser.emitted,
    ],
    implemented:
      emittedServer.emitted.length > 0
      || emittedBrowser.emitted.length > 0,
  };
}

async function ensureOutputDirectories(
  planned: RouteCompilerResult['planned'],
): Promise<void> {
  await Promise.all([
    fs.mkdir(
      path.dirname(planned.serverOutput),
      { recursive: true },
    ),
    fs.mkdir(planned.entriesOutput, {
      recursive: true,
    }),
    fs.mkdir(
      path.dirname(planned.manifestOutput),
      { recursive: true },
    ),
  ]);
}
