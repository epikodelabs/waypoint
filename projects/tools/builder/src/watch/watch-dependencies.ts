import path from 'node:path';

import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';

/**
 * Returns the authored source files that affect Waypoint analysis/planning.
 *
 * The exact field names should be wired to the resolved semantic/module graph
 * already produced by analyze(). Do not scan the whole workspace.
 */
export function waypointAnalysisDependencies(
  analysis: WaypointAnalysis,
): readonly string[] {
  const values = new Set<string>();

  values.add(
    path.resolve(
      analysis.planned.entry,
    ),
  );

  const semanticFiles =
    (analysis.semantic as any)?.sourceFiles;

  if (Array.isArray(semanticFiles)) {
    for (const file of semanticFiles) {
      if (typeof file === 'string') {
        values.add(path.resolve(file));
      }
    }
  }

  const moduleFiles =
    (analysis as any).navigationModule?.files;

  if (Array.isArray(moduleFiles)) {
    for (const file of moduleFiles) {
      if (typeof file === 'string') {
        values.add(path.resolve(file));
      }
    }
  }

  return Object.freeze(
    [...values].sort(),
  );
}