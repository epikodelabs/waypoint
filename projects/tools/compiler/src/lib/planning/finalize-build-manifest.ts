import path from 'node:path';

import type {
  ArtifactBundleResult,
  RouteArtifactPlan,
  WaypointBuildManifestDocument,
} from '../compiler/contracts.js';

export function finalizeBuildManifest(
  plan: RouteArtifactPlan,
  bundleResult: ArtifactBundleResult,
  manifestOutput: string,
): WaypointBuildManifestDocument {
  const bundledByKey = new Map(
    bundleResult.artifacts.map(
      artifact => [artifact.artifactKey, artifact] as const,
    ),
  );

  return Object.freeze({
    ...plan.manifest,
    artifacts: Object.freeze(
      plan.manifest.artifacts.map(descriptor => {
        const bundled = bundledByKey.get(descriptor.artifactKey);
        if (!bundled) {
          throw new Error(
            `Bundle result is missing planned artifact "${descriptor.artifactKey}".`,
          );
        }

        return Object.freeze({
          ...descriptor,
          file: path.relative(
            path.dirname(manifestOutput),
            bundled.outputPath,
          ).replace(/\\/g, '/') || '.',
          hash: bundled.hash,
          bytes: bundled.bytes,
          imports: bundled.imports,
          inputs: bundled.inputs,
        });
      }),
    ),
  });
}
