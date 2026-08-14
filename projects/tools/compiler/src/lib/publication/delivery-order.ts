export interface DeliveryArtifact {
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly sharedDependencies?: readonly string[];
}

export function artifactDeliveryOrder(
  rootArtifactKey: string,
  artifacts: readonly DeliveryArtifact[],
): readonly string[] {
  const byKey = new Map(artifacts.map(artifact => [artifact.artifactKey, artifact]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const ordered: string[] = [];

  function visit(key: string): void {
    if (visited.has(key)) return;
    if (visiting.has(key)) throw new Error(`Artifact dependency cycle at "${key}".`);

    const artifact = byKey.get(key);
    if (!artifact) throw new Error(`Unknown artifact dependency "${key}".`);

    visiting.add(key);
    for (const dependency of artifact.dependencies) visit(dependency);
    for (const dependency of artifact.sharedDependencies ?? []) visit(dependency);
    visiting.delete(key);
    visited.add(key);
    ordered.push(key);
  }

  visit(rootArtifactKey);
  return Object.freeze(ordered);
}
