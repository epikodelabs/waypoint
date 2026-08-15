import { performance } from 'node:perf_hooks';

import type {
  CompilerStageName,
  CompilerStageTiming,
  PlannedCompilerOutputs,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  RouteCompilerOptions,
} from './contracts.js';
import type {
  ExpandedNavigationModel,
  SemanticNavigationProgram,
} from '../ir/model.js';
import type {
  NavigationIr,
} from '../ir/navigation-ir.js';

import {
  normalizeCompilerOptions,
} from './config.js';
import {
  hasErrors,
} from './diagnostics.js';
import {
  resolveNavigationProgram,
} from '../resolution/resolve-navigation-program.js';
import {
  evaluateStaticRouteData,
} from '../resolution/evaluate-static-route-data.js';
import {
  buildNavigationIr,
} from '../ir/build-navigation-ir.js';
import {
  validateNavigationIr,
  validateExpandedNavigation,
} from '../validation/validate-navigation.js';
import {
  expandNavigation,
} from '../ir/expand-navigation.js';
import {
  planRouteArtifacts,
} from '../planning/plan-artifacts.js';
import {
  validateArtifactPlan,
} from '../validation/validate-artifact-plan.js';

export interface WaypointAnalysis {
  readonly success: boolean;
  readonly planned: PlannedCompilerOutputs;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly timings: readonly CompilerStageTiming[];

  readonly semantic?: SemanticNavigationProgram;
  readonly navigationIr?: NavigationIr;
  readonly expanded?: ExpandedNavigationModel;
  readonly plan?: RouteArtifactPlan;
}

/**
 * Pure compiler analysis boundary.
 *
 * No generated files, AOT output, bundles, snapshots or deployment state are
 * created here.
 */
export async function analyze(
  options: RouteCompilerOptions,
): Promise<WaypointAnalysis> {
  const planned = normalizeCompilerOptions(options);
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const timings: CompilerStageTiming[] = [];

  let semantic: SemanticNavigationProgram | undefined;
  let navigationIr: NavigationIr | undefined;
  let expanded: ExpandedNavigationModel | undefined;
  let plan: RouteArtifactPlan | undefined;

  const run = async <T>(
    stage: CompilerStageName,
    action: () => T | Promise<T>,
  ): Promise<T> => {
    const started = performance.now();

    try {
      return await action();
    } finally {
      if (planned.profile) {
        timings.push(Object.freeze({
          stage,
          durationMs: Number(
            (performance.now() - started).toFixed(3),
          ),
        }));
      }
    }
  };

  const resolved = await run(
    'resolve',
    () => resolveNavigationProgram(planned),
  );
  semantic = resolved.program;
  diagnostics.push(...resolved.diagnostics);

  const evaluated = await run(
    'evaluate',
    () => evaluateStaticRouteData(semantic!),
  );
  diagnostics.push(...evaluated.diagnostics);

  navigationIr = await run(
    'ir',
    () => buildNavigationIr(semantic!),
  );

  const validatedIr = await run(
    'validate-ir',
    () => validateNavigationIr(navigationIr!),
  );
  diagnostics.push(...validatedIr.diagnostics);

  if (hasErrors(diagnostics)) {
    return finish(false);
  }

  const expandedResult = await run(
    'expand',
    () => expandNavigation(navigationIr!),
  );
  expanded = expandedResult.model;
  diagnostics.push(...expandedResult.diagnostics);

  const validatedExpanded = await run(
    'validate-expanded',
    () => validateExpandedNavigation(expanded!),
  );
  diagnostics.push(...validatedExpanded.diagnostics);

  if (hasErrors(diagnostics)) {
    return finish(false);
  }

  const plannedArtifacts = await run(
    'plan',
    () => planRouteArtifacts(planned, expanded!),
  );
  plan = plannedArtifacts.plan;
  diagnostics.push(...plannedArtifacts.diagnostics);

  const validatedPlan = await run(
    'validate-plan',
    () => validateArtifactPlan(plan!),
  );
  diagnostics.push(...validatedPlan.diagnostics);

  return finish(!hasErrors(diagnostics));

  function finish(success: boolean): WaypointAnalysis {
    return Object.freeze({
      success,
      planned,
      diagnostics: Object.freeze([...diagnostics]),
      timings: Object.freeze([...timings]),
      semantic,
      navigationIr,
      expanded,
      plan,
    });
  }
}
