export interface RouteCompilerOutputs {
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
}

export interface RouteCompilerOptions
  extends RouteCompilerOutputs {
  readonly entry: string;
  readonly cwd?: string;
  readonly dryRun?: boolean;
}

export interface RouteCompilerDiagnostic {
  readonly level: 'info' | 'warning' | 'error';
  readonly message: string;
}

export interface PlannedCompilerOutputs {
  readonly entry: string;
  readonly serverOutput: string;
  readonly entriesOutput: string;
  readonly manifestOutput: string;
}

export interface SourceReference {
  readonly filePath: string;
  readonly exportName?: string;
  readonly localName?: string;
}

export interface ParsedRoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface ParsedStringSchema {
  readonly kind: 'string';
  readonly default?: string;
}

export interface ParsedNumberSchema {
  readonly kind: 'number';
  readonly default?: number;
  readonly min?: number;
  readonly max?: number;
}

export interface ParsedBooleanSchema {
  readonly kind: 'boolean';
  readonly default?: boolean;
}

export interface ParsedArraySchema {
  readonly kind: 'array';
  readonly default?: readonly string[];
}

export interface ParsedDateSchema {
  readonly kind: 'date';
  readonly default?: string;
}

export interface ParsedOptionalSchema {
  readonly kind: 'optional';
  readonly inner: ParsedSchema;
}

export type ParsedSchema =
  | ParsedStringSchema
  | ParsedNumberSchema
  | ParsedBooleanSchema
  | ParsedArraySchema
  | ParsedDateSchema
  | ParsedOptionalSchema;

export type ParsedSchemaRecord = Readonly<
  Record<string, ParsedSchema>
>;

export interface ParsedRouteEntryBase {
  readonly path: string;
  readonly sourceText: string;
  readonly name?: string;
  readonly outlet?: string;
  readonly policy?: ParsedRoutePolicy;
  readonly paramsSchema?: ParsedSchemaRecord;
  readonly querySchema?: ParsedSchemaRecord;
  readonly source: SourceReference;
  readonly branchSource?: SourceReference;
}

export interface ParsedRouteEntryLayout
  extends ParsedRouteEntryBase {
  readonly kind: 'layout';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly entries: readonly ParsedRouteEntry[];
}

export interface ParsedRouteEntryRoute
  extends ParsedRouteEntryBase {
  readonly kind: 'route';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
}

export interface ParsedRouteEntryRedirect
  extends ParsedRouteEntryBase {
  readonly kind: 'redirect';
  readonly redirectTo: string;
}

export type ParsedRouteEntry =
  | ParsedRouteEntryLayout
  | ParsedRouteEntryRoute
  | ParsedRouteEntryRedirect;

export interface ParsedRouteGraph {
  readonly entry: string;
  readonly routes: readonly ParsedRouteEntry[];
}

export interface CompiledLayoutSummary {
  readonly path: string;
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly policy?: ParsedRoutePolicy;
}

export interface CompiledOutletSummary {
  readonly path: string;
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly outlet: string;
}

export interface CompiledRouteBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly pageType?: string;
  readonly loadMode?: 'eager' | 'lazy';
  readonly redirectTo?: string;
  readonly paramsSchema?: ParsedSchemaRecord;
  readonly querySchema?: ParsedSchemaRecord;
  readonly layouts: readonly CompiledLayoutSummary[];
  readonly outlets: readonly CompiledOutletSummary[];
  readonly policies: readonly ParsedRoutePolicy[];
  readonly source?: SourceReference;
}

export interface ServerRouteShardDescriptor {
  readonly prefix: string;
  readonly file: string;
  readonly branchCount: number;
}

export interface ServerRouteIndexDocument {
  readonly version: 1;
  readonly entry: string;
  readonly generatedAt: string;
  readonly shards: readonly ServerRouteShardDescriptor[];
}

export interface ServerRouteShardDocument {
  readonly version: 1;
  readonly prefix: string;
  readonly branches: readonly CompiledRouteBranch[];
}

export interface RouteArtifactManifestDocument {
  readonly version: 1;
  readonly generatedAt: string;
  readonly routes: readonly {
    readonly id: string;
    readonly path: string;
    readonly staticPrefix: string;
    readonly name?: string;
    readonly artifactKey: string;
  }[];
}

export interface RouteCompilerResult {
  readonly planned: PlannedCompilerOutputs;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
  readonly implemented: boolean;
}
