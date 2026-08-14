// Replace PlannedArtifactBundle.isolated:
//
// BEFORE
//   /** v1 artifacts must not share protected code across route-set entries. */
//   readonly isolated: true;
//
// AFTER
export interface PlannedArtifactBundle {
  readonly outputDirectory: string;
  readonly fileNameTemplate: string;
  readonly format: 'esm';
  readonly platform: 'browser';

  /**
   * Sharing is disabled by default. The bundler may extract a dependency only
   * when Artifact Plan v2 supplies a compatible authorization-aware share group.
   */
  readonly sharing: 'authorization-aware';
}
