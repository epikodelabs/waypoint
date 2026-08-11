/**
 * AST-free implementation of Waypoint Semantic Model v1.
 *
 * This module contains navigation meaning only. It has no dependency on
 * TypeScript, Angular, Node filesystem APIs, artifact planning, or emitters.
 */
export const NAVIGATION_SEMANTIC_MODEL_VERSION = 1 as const;
export type NavigationSemanticModelVersion = typeof NAVIGATION_SEMANTIC_MODEL_VERSION;

export interface SourceReference {
  readonly filePath: string;
  readonly exportName?: string;
  readonly localName?: string;
  readonly start?: number;
  readonly length?: number;
}

export interface SemanticPolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface SemanticStringSchema { readonly kind: 'string'; readonly default?: string; }
export interface SemanticNumberSchema { readonly kind: 'number'; readonly default?: number; readonly min?: number; readonly max?: number; }
export interface SemanticBooleanSchema { readonly kind: 'boolean'; readonly default?: boolean; }
export interface SemanticArraySchema { readonly kind: 'array'; readonly default?: readonly string[]; }
export interface SemanticDateSchema { readonly kind: 'date'; readonly default?: string; }
export interface SemanticOptionalSchema { readonly kind: 'optional'; readonly inner: SemanticSchema; }
export type SemanticSchema = SemanticStringSchema | SemanticNumberSchema | SemanticBooleanSchema | SemanticArraySchema | SemanticDateSchema | SemanticOptionalSchema;
export type SemanticSchemaRecord = Readonly<Record<string, SemanticSchema>>;

export interface SemanticEntryBase {
  readonly path: string;
  readonly name?: string;
  readonly outlet?: string;
  readonly policy?: SemanticPolicy;
  readonly paramsSchema?: SemanticSchemaRecord;
  readonly querySchema?: SemanticSchemaRecord;
  readonly source: SourceReference;
  readonly branchSource?: SourceReference;
}

export interface SemanticLayout extends SemanticEntryBase {
  readonly kind: 'layout';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly entries: readonly SemanticEntry[];
}

export interface SemanticRoute extends SemanticEntryBase {
  readonly kind: 'route';
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
}

export interface SemanticRedirect extends SemanticEntryBase {
  readonly kind: 'redirect';
  readonly redirectTo: string;
}

export interface SemanticRouteSlot {
  readonly kind: 'slot';
  readonly id: string;
  readonly source: SourceReference;
}

export type SemanticEntry = SemanticLayout | SemanticRoute | SemanticRedirect | SemanticRouteSlot;

export interface SemanticRoutesFor {
  readonly kind: 'routes-for';
  /** Stable authored identity supplied as the second routesFor() argument. */
  readonly id: string;
  readonly slotId: string;
  readonly entries: readonly SemanticEntry[];
  readonly source: SourceReference;
}

export interface SemanticNavigationProgram {
  readonly entry: string;
  readonly routes: readonly SemanticEntry[];
  readonly routeSets: readonly SemanticRoutesFor[];
}

export interface ExpandedLayout {
  readonly path: string;
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly policy?: SemanticPolicy;
}

export interface ExpandedOutlet {
  readonly path: string;
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly outlet: string;
}

export interface ExpandedRouteSlot {
  readonly id: string;
  readonly parentPath: string;
  readonly layoutDepth: number;
  readonly source: SourceReference;
  /** Slot whose owned route set declared this slot. */
  readonly parentSlotId?: string;
  /** Route set whose entries declared this slot. */
  readonly declaredByRouteSetId?: string;
}

export interface ExpandedRouteSet {
  readonly id: string;
  readonly slotId: string;
  readonly source: SourceReference;
  readonly branchIds: readonly string[];
  /** Owning route set that declared the target slot, when nested. */
  readonly parentRouteSetId?: string;
}

export interface ExpandedRouteBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly pageType?: string;
  readonly loadMode?: 'eager' | 'lazy';
  readonly redirectTo?: string;
  readonly paramsSchema?: SemanticSchemaRecord;
  readonly querySchema?: SemanticSchemaRecord;
  readonly layouts: readonly ExpandedLayout[];
  readonly outlets: readonly ExpandedOutlet[];
  readonly policies: readonly SemanticPolicy[];
  readonly source?: SourceReference;
  readonly slotId?: string;
  readonly routeSetId?: string;
}

export interface ExpandedNavigationModel {
  readonly branches: readonly ExpandedRouteBranch[];
  readonly slots: readonly ExpandedRouteSlot[];
  readonly routeSets: readonly ExpandedRouteSet[];
}