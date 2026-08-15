import type {
  SemanticNavigationProgram,
} from '../semantic/model.js';
import type {
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

/**
 * Defensive validation: generated implicit slots must be root-context slots.
 */
export function validateImplicitRootSlots(
  program: SemanticNavigationProgram,
): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];

  for (const slot of program.slots) {
    if (
      slot.source?.kind !== 'generated'
      || slot.source?.reason !== 'implicit-root-slot'
    ) {
      continue;
    }

    if (slot.context !== program.rootContext) {
      diagnostics.push({
        code: 'WPT2210',
        level: 'error',
        message:
          `Implicit slot "${slot.id}" is not rooted in the navigation root context.`,
      });
    }
  }

  return Object.freeze(diagnostics);
}
