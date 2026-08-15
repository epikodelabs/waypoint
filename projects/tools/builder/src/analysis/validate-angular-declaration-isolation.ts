import type {
  AuthorizationDomain,
} from '../../../compiler/src/lib/planning/authorization-domain.js';
import {
  canContainAuthorizationDomain,
} from '../../../compiler/src/lib/planning/authorization-domain.js';

export interface ModuleAuthorizationConsumer {
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
}

export interface AngularDeclarationModuleUsage {
  readonly moduleId: string;
  readonly declarations: readonly string[];
  readonly consumers: readonly ModuleAuthorizationConsumer[];
}

export interface AngularDeclarationIsolationDiagnostic {
  readonly code: 'WPT3220';
  readonly level: 'error';
  readonly message: string;
  readonly moduleId: string;
  readonly artifactKeys: readonly string[];
  readonly declarations: readonly string[];
}

/**
 * Angular declaration modules may not be duplicated across incomparable
 * authorization domains.
 *
 * If all consumers form one audience-containment chain, a stricter consumer can
 * safely depend on code owned by a weaker/shared domain. If no such single owner
 * exists without broadening exposure, the source module must be split.
 */
export function validateAngularDeclarationIsolation(
  usages: readonly AngularDeclarationModuleUsage[],
): readonly AngularDeclarationIsolationDiagnostic[] {
  const diagnostics: AngularDeclarationIsolationDiagnostic[] = [];

  for (const usage of usages) {
    if (
      usage.declarations.length === 0
      || usage.consumers.length <= 1
    ) {
      continue;
    }

    if (hasSafeSingleOwner(usage.consumers)) {
      continue;
    }

    diagnostics.push(Object.freeze({
      code: 'WPT3220',
      level: 'error',
      moduleId: usage.moduleId,
      artifactKeys: Object.freeze(
        usage.consumers
          .map(consumer => consumer.artifactKey)
          .sort(),
      ),
      declarations: usage.declarations,
      message:
        `Angular declaration module "${usage.moduleId}" crosses incompatible ` +
        `authorization boundaries. It contains ` +
        `${usage.declarations.join(', ')} and is consumed by ` +
        `${usage.consumers.map(consumer => consumer.artifactKey).join(', ')}. ` +
        `Split Angular declarations into modules owned by a single authorization domain.`,
    }));
  }

  return Object.freeze(diagnostics);
}

function hasSafeSingleOwner(
  consumers: readonly ModuleAuthorizationConsumer[],
): boolean {
  return consumers.some(candidate =>
    consumers.every(other =>
      candidate === other
      || canContainAuthorizationDomain(
        other.authorization,
        candidate.authorization,
      ),
    ),
  );
}
