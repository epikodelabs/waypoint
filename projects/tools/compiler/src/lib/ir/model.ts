/**
 * AST-free Navigation IR.
 *
 * This module implements the concepts defined by semantic-model.md. It has no
 * dependency on TypeScript, Node filesystem APIs, emitters, or output paths.
 */
export interface SourceReference {
  readonly filePath: string;
  readonly exportName?: string;
  readonly localName?: string;
  readonly start?: number;
  readonly length?: number;
}

export interface ParsedRoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface ParsedStringSchema { readonly kind: 'string'; readonly default?: string; }
export interface ParsedNumberSchema { readonly kind: 'number'; readonly default?: number; readonly min?: number; readonly max?: number; }
export interface ParsedBooleanSchema { readonly kind: 'boolean'; readonly default?: boolean; }
export interface ParsedArraySchema { readonly kind: 'array'; readonly default?: readonly string[]; }
export interface ParsedDateSchema { readonly kind: 'date'; readonly default?: string; }
export interface ParsedOptionalSchema { readonly kind: 'optional'; readonly inner: ParsedSchema; }
export type ParsedSchema = ParsedStringSchema | ParsedNumberSchema | ParsedBooleanSchema | ParsedArraySchema | ParsedDateSchema | ParsedOptionalSchema;
export type ParsedSchemaRecord = Readonly<Record<string, ParsedSchema>>;

export interface ParsedRouteEntryBase {
  readonly path: string;
  readonly name?: string;
  readonly outlet?: string;
  readonly policy?: ParsedRoutePolicy;
  readonly paramsSchema?: ParsedSchemaRecord;
  readonly querySchema?: ParsedSchemaRecord;
  readonly source: SourceReference;
  readonly branchSource?: SourceReference;
}

export interface ParsedRouteEntryLayout extends ParsedRouteEntryBase {
  readonly kind: 'layout';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly entries: readonly ParsedRouteEntry[];
}

export interface ParsedRouteEntryRoute extends ParsedRouteEntryBase {
  readonly kind: 'route';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
}

export interface ParsedRouteEntryRedirect extends ParsedRouteEntryBase {
  readonly kind: 'redirect';
  readonly redirectTo: string;
}

export interface ParsedRouteSlot {
  readonly kind: 'slot';
  readonly id: string;
  readonly source: SourceReference;
}

export type ParsedRouteEntry = ParsedRouteEntryLayout | ParsedRouteEntryRoute | ParsedRouteEntryRedirect | ParsedRouteSlot;

export interface ParsedRoutesFor {
  readonly kind: 'routes-for';
  readonly slotId: string;
  readonly entries: readonly ParsedRouteEntry[];
  readonly source: SourceReference;
}

export interface ParsedRouteGraph {
  readonly entry: string;
  readonly routes: readonly ParsedRouteEntry[];
  readonly routeSets: readonly ParsedRoutesFor[];
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

export interface CompiledRouteSlot {
  readonly id: string;
  readonly parentPath: string;
  readonly layoutDepth: number;
  readonly source: SourceReference;
}

export interface CompiledRouteSet {
  readonly id: string;
  readonly slotId: string;
  readonly source: SourceReference;
  readonly branchIds: readonly string[];
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
  readonly slotId?: string;
  readonly routeSetId?: string;
}

export interface CompiledRouteModel {
  readonly branches: readonly CompiledRouteBranch[];
  readonly slots: readonly CompiledRouteSlot[];
  readonly routeSets: readonly CompiledRouteSet[];
}

/** Semantic model produced by source resolution. */
export type ResolvedNavigationModel = ParsedRouteGraph;

/** Expanded matcher and ownership model produced from the semantic model. */
export type ExpandedNavigationModel = CompiledRouteModel;

