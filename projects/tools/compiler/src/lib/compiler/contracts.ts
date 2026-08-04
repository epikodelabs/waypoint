import type {
  ExpandedRouteBranch,
  ExpandedNavigationModel,
  ExpandedRouteSet,
  ExpandedRouteSlot,
} from '../ir/model.js';

export interface RouteCompilerOutputs {
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
}

export interface RouteCompilerOptions extends RouteCompilerOutputs {
  readonly entry: string;
  readonly cwd?: string;
  readonly dryRun?: boolean;
  readonly routesExport?: string;
}

export interface SourceSpan {
  readonly file: string;
  readonly start: number;
  readonly length: number;
  readonly line?: number;
  readonly column?: number;
}

export interface RouteCompilerDiagnostic {
  readonly code?: string;
  readonly level: 'info' | 'warning' | 'error';
  readonly message: string;
  readonly source?: SourceSpan;
  readonly routePath?: string;
  readonly routeName?: string;
}

export interface PlannedCompilerOutputs {
  readonly entry: string;
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
  readonly dryRun: boolean;
  readonly routesExport: string;
}


export interface ServerRouteShardDescriptor { readonly prefix: string; readonly file: string; readonly branchCount: number; }
export interface ServerRouteIndexDocument {
  readonly version: 1;
  readonly entry: string;
  readonly generatedAt: string;
  readonly shards: readonly ServerRouteShardDescriptor[];
  readonly slots: readonly ExpandedRouteSlot[];
  readonly routeSets: readonly ExpandedRouteSet[];
}
export interface ServerRouteShardDocument { readonly version: 1; readonly prefix: string; readonly branches: readonly ExpandedRouteBranch[]; }
export interface RouteArtifactManifestDocument {
  readonly version: 1;
  readonly generatedAt: string;
  readonly slots: readonly ExpandedRouteSlot[];
  readonly routeSets: readonly {
    readonly id: string;
    readonly slotId: string;
    readonly sourceFile: string;
    readonly sourceExport?: string;
    readonly artifactKey: string;
    readonly branchIds: readonly string[];
    readonly parentRouteSetId?: string;
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

export interface RouteCompilerResult {
  readonly planned: PlannedCompilerOutputs;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly implemented: boolean;
}


export interface PlannedBrowserEntry {
  readonly routeSetId: string;
  readonly outputPath: string;
  readonly sourceFile: string;
  readonly sourceExport: string;
  readonly contents: string;
}

export interface PlannedServerShard {
  readonly prefix: string;
  readonly outputPath: string;
  readonly document: ServerRouteShardDocument;
}

export interface RouteArtifactPlan {
  readonly browserEntries: readonly PlannedBrowserEntry[];
  readonly serverShards: readonly PlannedServerShard[];
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}
