import type {
  PlannedRouteArtifact,
} from './contracts.js';

export interface PreparedArtifactSources {
  /** Temporary root containing full Angular AOT output. */
  readonly outputRoot: string;

  /** Identity-sensitive package modules discovered from AOT output. */
  readonly hostRuntimeModules: readonly string[];

  /** Returns a generated ESM entry for one planned route artifact. */
  entryFor(artifact: PlannedRouteArtifact): Promise<string>;

  /** Owns cleanup of the temporary AOT generation. */
  dispose(): Promise<void>;
}
