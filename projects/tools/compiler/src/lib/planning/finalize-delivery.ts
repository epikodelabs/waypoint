import path from 'node:path';
import type {
  ArtifactBundleResult,
  RouteArtifactManifestDocument,
  RouteArtifactPlan,
  ServerRouteIndexDocument,
} from '../compiler/contracts.js';

export interface FinalizedDeliveryDocuments {
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}

/** Combines the immutable plan with actual esbuild outputs. */
export function finalizeDeliveryDocuments(
  plan: RouteArtifactPlan,
  bundleResult: ArtifactBundleResult,
  serverOutput: string,
  manifestOutput: string,
): FinalizedDeliveryDocuments {
  const bundledByKey = new Map(
    bundleResult.artifacts.map(artifact => [artifact.artifactKey, artifact] as const),
  );

  const serverIndex: ServerRouteIndexDocument = {
    ...plan.serverIndex,
    artifacts: Object.freeze(plan.serverIndex.artifacts.map(descriptor => {
      const bundled = requireBundledArtifact(bundledByKey, descriptor.artifactKey);
      return {
        ...descriptor,
        file: relativePortable(path.dirname(serverOutput), bundled.outputPath),
        hash: bundled.hash,
        bytes: bundled.bytes,
        imports: bundled.imports,
      };
    })),
  };

  const manifest: RouteArtifactManifestDocument = {
    ...plan.manifest,
    artifacts: Object.freeze(plan.manifest.artifacts.map(descriptor => {
      const bundled = requireBundledArtifact(bundledByKey, descriptor.artifactKey);
      return {
        ...descriptor,
        file: relativePortable(path.dirname(manifestOutput), bundled.outputPath),
        hash: bundled.hash,
        bytes: bundled.bytes,
        imports: bundled.imports,
        inputs: bundled.inputs,
      };
    })),
  };

  return { serverIndex, manifest };
}

function requireBundledArtifact<T extends { readonly outputPath: string }>(
  artifacts: ReadonlyMap<string, T>,
  artifactKey: string,
): T {
  const artifact = artifacts.get(artifactKey);
  if (!artifact) {
    throw new Error(`Bundle result is missing planned artifact "${artifactKey}".`);
  }
  return artifact;
}

function relativePortable(from: string, to: string): string {
  const value = path.relative(from, to).replace(/\\/g, '/');
  return value || '.';
}
