/*
Split compiler outputs by purpose.

BEFORE

export interface RouteCompilerOutputs {
  readonly serverOutput: string;
  readonly manifestOutput: string;
  readonly artifactsOutput?: string;
}

AFTER

export interface RouteCompilerOutputs {
  /** Runtime server routing index consumed by the deployed server. */
  readonly serverOutput: string;

  /** Browser-deliverable protected artifact root. */
  readonly artifactsOutput?: string;

  /**
   * Optional build/debug manifest. Not required by runtime delivery and should
   * not participate in the server publication transaction.
   */
  readonly buildManifestOutput?: string;
}

Rename RouteArtifactManifestDocument -> WaypointBuildManifestDocument if that
type is no longer used by runtime code.

ServerRouteIndexDocument + shards remain runtime deployment contracts.
*/
