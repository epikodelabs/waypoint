import type {
  SemanticPolicy,
  SemanticSchemaRecord,
} from './model.js';

export const NAVIGATION_IR_VERSION = 1 as const;
export const NO_IR_REF = -1 as const;

export type IrRef = number;
export type IrStringRef = IrRef;
export type IrSourceRef = IrRef;
export type IrPolicyRef = IrRef;
export type IrSchemaRef = IrRef;
export type IrEntryRef = IrRef;
export type IrRouteSetRef = IrRef;

export const enum NavigationIrEntryKind {
  Layout = 1,
  Route = 2,
  Redirect = 3,
  Slot = 4,
}

export const enum NavigationIrLoadMode {
  None = 0,
  Eager = 1,
  Lazy = 2,
}

export interface NavigationIrSourceRecord {
  readonly filePath: IrStringRef;
  readonly exportName: IrStringRef;
  readonly localName: IrStringRef;
  readonly start: number;
  readonly length: number;
}

interface NavigationIrAddressableEntryRecord {
  readonly path: IrStringRef;
  readonly name: IrStringRef;
  readonly outlet: IrStringRef;
  readonly policy: IrPolicyRef;
  readonly paramsSchema: IrSchemaRef;
  readonly querySchema: IrSchemaRef;
  readonly source: IrSourceRef;
  readonly branchSource: IrSourceRef;
}

export interface NavigationIrLayoutRecord
  extends NavigationIrAddressableEntryRecord {
  readonly kind: NavigationIrEntryKind.Layout;
  readonly pageType: IrStringRef;
  readonly loadMode: NavigationIrLoadMode.Eager | NavigationIrLoadMode.Lazy;
  readonly firstChild: number;
  readonly childCount: number;
}

export interface NavigationIrRouteRecord
  extends NavigationIrAddressableEntryRecord {
  readonly kind: NavigationIrEntryKind.Route;
  readonly pageType: IrStringRef;
  readonly loadMode: NavigationIrLoadMode.Eager | NavigationIrLoadMode.Lazy;
}

export interface NavigationIrRedirectRecord
  extends NavigationIrAddressableEntryRecord {
  readonly kind: NavigationIrEntryKind.Redirect;
  readonly redirectTo: IrStringRef;
}

export interface NavigationIrSlotRecord {
  readonly kind: NavigationIrEntryKind.Slot;
  readonly id: IrStringRef;
  readonly source: IrSourceRef;
}

export type NavigationIrEntryRecord =
  | NavigationIrLayoutRecord
  | NavigationIrRouteRecord
  | NavigationIrRedirectRecord
  | NavigationIrSlotRecord;

export interface NavigationIrRouteSetRecord {
  readonly slotId: IrStringRef;
  readonly source: IrSourceRef;
  readonly firstEntry: number;
  readonly entryCount: number;
}

/**
 * Compact, AST-free intermediate representation of a Waypoint navigation
 * program. Repeated strings, sources, policies, and schemas are interned.
 * Child relationships are stored as ranges into `entryRefs`.
 */
export interface NavigationIr {
  readonly version: typeof NAVIGATION_IR_VERSION;
  readonly entry: IrStringRef;
  readonly strings: readonly string[];
  readonly sources: readonly NavigationIrSourceRecord[];
  readonly policies: readonly SemanticPolicy[];
  readonly schemas: readonly SemanticSchemaRecord[];
  readonly entries: readonly NavigationIrEntryRecord[];
  readonly entryRefs: readonly IrEntryRef[];
  readonly rootFirstEntry: number;
  readonly rootEntryCount: number;
  readonly routeSets: readonly NavigationIrRouteSetRecord[];
}

export function readIrString(
  ir: NavigationIr,
  ref: IrStringRef,
): string | undefined {
  return ref === NO_IR_REF ? undefined : ir.strings[ref];
}

export function readIrSource(
  ir: NavigationIr,
  ref: IrSourceRef,
): NavigationIrSourceRecord | undefined {
  return ref === NO_IR_REF ? undefined : ir.sources[ref];
}

export function* iterateIrEntryRefs(
  ir: NavigationIr,
  first: number,
  count: number,
): IterableIterator<IrEntryRef> {
  const end = first + count;
  for (let index = first; index < end; index++) {
    const ref = ir.entryRefs[index];
    if (ref !== undefined) yield ref;
  }
}
