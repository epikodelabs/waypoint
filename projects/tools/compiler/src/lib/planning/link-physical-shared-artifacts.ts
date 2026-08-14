import path from 'node:path';
import type { DomainBundleRouteOutput, DomainBundleSharedOutput } from '../emitters/bundle-artifact-group.js';

export function linkPhysicalSharedArtifacts(
  routes: readonly DomainBundleRouteOutput[],
  shared: readonly DomainBundleSharedOutput[],
) {
  const sharedByFile = new Map(shared.map(artifact => [path.resolve(artifact.outputPath), artifact]));
  return Object.freeze(routes.map(route => {
    const dependencies = route.imports.flatMap(specifier => {
      const absolute = path.resolve(path.dirname(route.outputPath), specifier);
      const sharedArtifact = sharedByFile.get(absolute);
      return sharedArtifact ? [sharedArtifact.artifactKey] : [];
    });
    return Object.freeze({
      ...route,
      sharedDependencies: Object.freeze([...new Set(dependencies)].sort()),
    });
  }));
}
