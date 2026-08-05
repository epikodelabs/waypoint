import type {
  ExpandedRouteBranch,
  ExpandedRouteSet,
  ExpandedRouteSlot,
} from '../ir/model.js';

export const COMPILER_CONTRACT_VERSION = 1 as const;
export const SERVER_ROUTE_INDEX_VERSION = 1 as const;
export const SERVER_ROUTE_SHARD_VERSION = 1 as const;
export const ROUTE_ARTIFACT_MANIFEST_VERSION = 1 as const;
export const ARTIFACT_PLAN_VERSION = 1 as const;
export type ArtifactPlanVersion = typeof ARTIFACT_PLAN_VERSION;

export interface RouteCompilerOutputs {
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
  /** Output directory reserved for bundled browser artifacts. */
  readonly artifactsOutput?: string;
}

export interface RouteCompilerOptions extends RouteCompilerOutputs {
  readonly entry: string;
  readonly cwd?: string;
  readonly dryRun?: boolean;
  readonly routesExport?: string;
  /** Retain immutable intermediate models in the result for inspection. */
  readonly inspect?: boolean;
  /** Collect per-stage wall-clock timings. */
  readonly profile?: boolean;
}

export interface SourceSpan {
  readonly file: string;
  readonly start: number;
  readonly length: number;
  readonly line?: number;
  readonly column?: number;
}

export type CompilerStageName =
  | 'resolve'
  | 'evaluate'
  | 'ir'
  | 'validate-ir'
  | 'expand'
  | 'validate-expanded'
  | 'plan'
  | 'validate-plan'
  | 'emit-entries'
  | 'bundle'
  | 'finalize'
  | 'validate-delivery'
  | 'publish';

export interface RouteCompilerDiagnostic {
  readonly code?: string;
  readonly level: 'info' | 'warning' | 'error';
  readonly message: string;
  readonly source?: SourceSpan;
  readonly routePath?: string;
  readonly routeName?: string;
  readonly stage?: CompilerStageName;
  readonly suggestion?: string;
}

export interface PlannedCompilerOutputs {
  readonly entry: string;
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
  readonly artifactsOutput: string;
  readonly dryRun: boolean;
  readonly routesExport: string;
  readonly inspect?: boolean;
  readonly profile?: boolean;
}

export interface PlannedArtifactSource {
  readonly file: string;
  readonly exportName: string;
}

export interface PlannedArtifactEntry {
  readonly outputPath: string;
  readonly importPath: string;
  readonly contents: string;
}

export interface PlannedArtifactBundle {
  readonly outputDirectory: string;
  readonly fileNameTemplate: string;
  readonly format: 'esm';
  readonly platform: 'browser';
  /** v1 artifacts must not share protected code across route-set entries. */
  readonly isolated: true;
}

/** Stable bundling and delivery unit derived from one exported routesFor(). */
export interface PlannedRouteArtifact {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly slotId: string;
  readonly parentRouteSetId?: string;
  /** Parent artifacts that must be available before this artifact can attach. */
  readonly dependencies: readonly string[];
  readonly source: PlannedArtifactSource;
  readonly entry: PlannedArtifactEntry;
  readonly bundle: PlannedArtifactBundle;
  readonly branchIds: readonly string[];
}

export interface PlannedBrowserEntry {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly outputPath: string;
  readonly sourceFile: string;
  readonly sourceExport: string;
  readonly contents: string;
}

export interface ServerRouteShardDescriptor {
  readonly prefix: string;
  readonly file: string;
  readonly branchCount: number;
}

export interface ServerArtifactDescriptor {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly slotId: string;
  readonly parentRouteSetId?: string;
  readonly dependencies: readonly string[];
  readonly branchCount: number;
  /** Portable path from the server index directory to the emitted ESM artifact. */
  readonly file?: string;
  readonly hash?: string;
  readonly bytes?: number;
  readonly imports?: readonly string[];
}

export interface ServerRouteIndexDocument {
  readonly version: 1;
  readonly artifactPlanVersion: ArtifactPlanVersion;
  readonly entry: string;
  readonly generatedAt: string;
  readonly shards: readonly ServerRouteShardDescriptor[];
  readonly artifacts: readonly ServerArtifactDescriptor[];
  readonly slots: readonly ExpandedRouteSlot[];
  readonly routeSets: readonly ExpandedRouteSet[];
}

export interface ServerRouteShardDocument {
  readonly version: 1;
  readonly artifactPlanVersion: ArtifactPlanVersion;
  readonly prefix: string;
  readonly branches: readonly ExpandedRouteBranch[];
}

export interface RouteArtifactManifestDocument {
  readonly version: 1;
  readonly artifactPlanVersion: ArtifactPlanVersion;
  readonly generatedAt: string;
  readonly slots: readonly ExpandedRouteSlot[];
  readonly routeSets: readonly {
    readonly id: string;
    readonly slotId: string;
    readonly sourceFile: string;
    readonly sourceExport: string;
    readonly artifactKey: string;
    readonly branchIds: readonly string[];
    readonly parentRouteSetId?: string;
    readonly dependencies: readonly string[];
  }[];
  readonly artifacts: readonly {
    readonly artifactKey: string;
    readonly routeSetId: string;
    readonly slotId: string;
    readonly parentRouteSetId?: string;
    readonly dependencies: readonly string[];
    readonly entryFile: string;
    readonly bundleDirectory: string;
    readonly fileNameTemplate: string;
    /** Portable path from the manifest directory to the emitted ESM artifact. */
    readonly file?: string;
    readonly hash?: string;
    readonly bytes?: number;
    readonly imports?: readonly string[];
    readonly inputs?: readonly string[];
    readonly branchIds: readonly string[];
  }[];
  readonly routes: readonly {
    readonly id: string;
    readonly path: string;
    readonly staticPrefix: string;
    readonly name?: string;
    readonly routeSetId?: string;
    readonly artifactKey?: string;
  }[];
}

export interface PlannedServerShard {
  readonly prefix: string;
  readonly outputPath: string;
  readonly document: ServerRouteShardDocument;
}

/**
 * Artifact Plan v1 is the sole input contract for bundlers and emitters.
 * Later stages must not inspect Navigation IR or ExpandedNavigationModel.
 */
export interface RouteArtifactPlan {
  readonly version: ArtifactPlanVersion;
  readonly generatedAt: string;
  readonly entry: string;
  readonly artifacts: readonly PlannedRouteArtifact[];
  readonly browserEntries: readonly PlannedBrowserEntry[];
  readonly serverShards: readonly PlannedServerShard[];
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}


export interface BundledArtifact {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly outputPath: string;
  readonly fileName: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs: readonly string[];
}

export interface ArtifactBundleResult {
  readonly artifacts: readonly BundledArtifact[];
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  /** Files present in the newly published artifact directory. */
  readonly emitted: readonly string[];
  /** Published files whose paths also existed in the previous artifact set. */
  readonly replaced: readonly string[];
  /** Stale files removed by replacing the previous artifact directory. */
  readonly removed: readonly string[];
}


export interface FinalizedDeliveryDocuments {
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}

export interface CompilerStageTiming {
  readonly stage: CompilerStageName;
  readonly durationMs: number;
}

export interface CompilerInspection {
  readonly semantic: import('../ir/model.js').SemanticNavigationProgram;
  readonly navigationIr: import('../ir/navigation-ir.js').NavigationIr;
  readonly expanded: import('../ir/model.js').ExpandedNavigationModel;
  readonly artifactPlan: RouteArtifactPlan;
  readonly bundles?: ArtifactBundleResult;
  readonly delivery?: FinalizedDeliveryDocuments;
}

export interface RouteCompilerResult {
  readonly planned: PlannedCompilerOutputs;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly implemented: boolean;
  readonly success: boolean;
  readonly timings: readonly CompilerStageTiming[];
  readonly inspection?: CompilerInspection;
}
