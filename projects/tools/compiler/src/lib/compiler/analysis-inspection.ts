import type {
  WaypointAnalysis,
} from './analyze.js';

export function analysisInspection(
  analysis: WaypointAnalysis,
) {
  if (
    !analysis.semantic
    || !analysis.navigationIr
    || !analysis.expanded
    || !analysis.plan
  ) {
    return undefined;
  }

  return Object.freeze({
    semantic: analysis.semantic,
    navigationIr: analysis.navigationIr,
    expanded: analysis.expanded,
    artifactPlan: analysis.plan,
  });
}
