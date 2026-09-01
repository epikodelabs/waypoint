import path from 'node:path';

import type {
  ArtifactBundleResult,
  RouteArtifactPlan,
} from '../../../compiler/src/lib/compiler/contracts.js';
import type {
  AngularDeclarationModuleUsage,
  ModuleAuthorizationConsumer,
} from './validate-angular-declaration-isolation.js';
import {
  scanAngularDeclarationModule,
} from './angular-declaration-module.js';

/**
 * Collect from the bundler's module/input graph, not from authored imports.
 *
 * That matters because AOT may rewrite or fan out source modules.
 */
export async function collectAngularDeclarationModuleUsages(
  plan: RouteArtifactPlan,
  bundle: ArtifactBundleResult,
): Promise<readonly AngularDeclarationModuleUsage[]> {
  const artifactByKey = new Map(
    plan.artifacts.map(
      artifact => [artifact.artifactKey, artifact] as const,
    ),
  );

  const consumersByModule = new Map<
    string,
    Map<string, ModuleAuthorizationConsumer>
  >();

  for (const artifact of bundle.artifacts) {
    const planned = artifactByKey.get(
      artifact.artifactKey,
    );

    if (!planned) continue;

    for (const input of artifact.inputs ?? []) {
      const moduleId = path.resolve(input);

      let consumers = consumersByModule.get(moduleId);
      if (!consumers) {
        consumers = new Map();
        consumersByModule.set(
          moduleId,
          consumers,
        );
      }

      consumers.set(
        artifact.artifactKey,
        Object.freeze({
          artifactKey: artifact.artifactKey,
          authorization: planned.authorization,
        }),
      );
    }
  }

  const usages: AngularDeclarationModuleUsage[] = [];

  for (const [moduleId, consumerMap] of consumersByModule) {
    if (consumerMap.size <= 1) continue;

    const scan =
      await scanAngularDeclarationModule(
        moduleId,
      );

    if (scan.declarations.length === 0) {
      continue;
    }

    usages.push(Object.freeze({
      moduleId,
      declarations: scan.declarations,
      consumers: Object.freeze(
        [...consumerMap.values()],
      ),
    }));
  }

  return Object.freeze(usages);
}