import path from 'node:path';
import type { RouteArtifactPlan } from '../compiler/contracts.js';

export interface PlannedHostEntry {
  readonly outputPath: string;
  readonly contents: string;
}

/**
 * Produces the navigation module visible to the ordinary Angular host build.
 * It deliberately contains no imports of routesFor() source modules.
 * Protected route/component graphs therefore have no dependency edge from
 * the host navigation entry.
 */
export function planHostEntry(plan: RouteArtifactPlan, outputPath: string): PlannedHostEntry {
  const slotIds = rootSlotIds(plan);
  const contents = [
    `import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';`,
    '',
    'export const routes = [',
    ...slotIds.map(slotId => `  routeSlot(${JSON.stringify(slotId)}),`),
    '] as const satisfies NavigationTree;',
    '',
  ].join('\n');
  return Object.freeze({ outputPath: path.resolve(outputPath), contents });
}

function rootSlotIds(plan: RouteArtifactPlan): readonly string[] {
  const childSlots = new Set(
    plan.manifest.routeSets
      .filter(routeSet => routeSet.parentRouteSetId !== undefined)
      .map(routeSet => routeSet.slotId),
  );
  return Object.freeze(
    plan.manifest.slots
      .map(slot => slot.id)
      .filter(slotId => !childSlots.has(slotId)),
  );
}
