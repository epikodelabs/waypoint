import type { AuthorizationDomain } from '../planning/authorization-domain.js';
import { planSharedBundle } from '../planning/shared-bundles.js';

export interface DependencyUsage {
  readonly moduleId: string;
  readonly consumers: readonly {
    readonly artifactKey: string;
    readonly authorization: AuthorizationDomain;
  }[];
}

export interface SharedChunkDecision {
  readonly moduleId: string;
  readonly mode: 'share' | 'duplicate';
  readonly sharedKey?: string;
  readonly authorization?: AuthorizationDomain;
}

export function decideSharedChunk(
  usage: DependencyUsage,
): SharedChunkDecision {
  const group = planSharedBundle(usage.consumers);

  if (!group) {
    return Object.freeze({
      moduleId: usage.moduleId,
      mode: 'duplicate',
    });
  }

  return Object.freeze({
    moduleId: usage.moduleId,
    mode: 'share',
    sharedKey: group.key,
    authorization: group.authorization,
  });
}
