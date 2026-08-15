import type {
  SemanticNavigationProgram,
  SemanticRouteContribution,
  SemanticRouteSlot,
} from '../ir/model.js';

export interface ImplicitRootSlotResult {
  readonly program: SemanticNavigationProgram;
  readonly implicitSlotIds: readonly string[];
}

/**
 * Synthesizes only context-free root slots.
 *
 * A contribution may target an undeclared slot only when there is no contextual
 * placement to preserve. The synthesized slot lives at the navigation root.
 *
 * Explicit slots always win and remain required for:
 *   - layout/path context;
 *   - inherited policy/providers;
 *   - nested route ownership;
 *   - intentionally empty extension points.
 */
export function addImplicitRootSlots(
  program: SemanticNavigationProgram,
): ImplicitRootSlotResult {
  const explicit = new Set(
    program.slots.map(slot => slot.id),
  );

  const missingTargets = unique(
    program.contributions
      .map(contribution => contribution.slotId)
      .filter(slotId => !explicit.has(slotId)),
  );

  if (missingTargets.length === 0) {
    return Object.freeze({
      program,
      implicitSlotIds: Object.freeze([]),
    });
  }

  const synthesized = missingTargets.map(
    slotId => implicitRootSlot(
      slotId,
      program,
    ),
  );

  return Object.freeze({
    program: Object.freeze({
      ...program,
      slots: Object.freeze([
        ...program.slots,
        ...synthesized,
      ]),
    }),
    implicitSlotIds: Object.freeze(
      missingTargets,
    ),
  });
}

function implicitRootSlot(
  id: string,
  program: SemanticNavigationProgram,
): SemanticRouteSlot {
  return Object.freeze({
    kind: 'route-slot',
    id,
    context: program.rootContext,
    source: Object.freeze({
      kind: 'generated',
      reason: 'implicit-root-slot',
    }),
  }) as SemanticRouteSlot;
}

function unique(
  values: readonly string[],
): readonly string[] {
  return Object.freeze(
    [...new Set(values)].sort(),
  );
}
