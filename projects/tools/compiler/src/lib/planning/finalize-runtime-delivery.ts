import path from 'node:path';

import type {
  ArtifactBundleResult,
  RouteArtifactPlan,
  ServerRouteIndexDocument,
} from '../compiler/contracts.js';

export function finalizeRuntimeServerIndex(
  plan: RouteArtifactPlan,
  bundleResult: ArtifactBundleResult,
  serverOutput: string,
): ServerRouteIndexDocument {
  const bundledByKey = new Map(
    bundleResult.artifacts.map(
      artifact => [artifact.artifactKey, artifact] as const,
    ),
  );

  return Object.freeze({
    ...plan.serverIndex,
    artifacts: Object.freeze(
      plan.serverIndex.artifacts.map(descriptor => {
        const bundled = bundledByKey.get(descriptor.artifactKey);
        if (!bundled) {
          throw new Error(
            `Bundle result is missing planned artifact "${descriptor.artifactKey}".`,
          );
        }

        return Object.freeze({
          ...descriptor,
          file: relativePortable(
            path.dirname(serverOutput),
            bundled.outputPath,
          ),
          hash: bundled.hash,
          bytes: bundled.bytes,
          imports: bundled.imports,
        });
      }),
    ),
  });
}

function relativePortable(from: string, to: string): string {
  return path.relative(from, to).replace(/\\/g, '/') || '.';
}
