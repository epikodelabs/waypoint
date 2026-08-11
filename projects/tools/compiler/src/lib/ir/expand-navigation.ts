import { createHash } from 'node:crypto';
import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import { diagnostic } from '../compiler/diagnostics.js';
import {
  deriveStaticPrefix,
  joinRoutePath,
} from './route-path.js';
import type {
  ExpandedLayout,
  ExpandedNavigationModel,
  ExpandedOutlet,
  ExpandedRouteBranch,
  ExpandedRouteSet,
  ExpandedRouteSlot,
  SemanticPolicy,
  SemanticSchemaRecord,
  SourceReference,
} from './model.js';
import {
  NO_IR_REF,
  NavigationIrEntryKind,
  NavigationIrLoadMode,
  readIrString,
  type IrEntryRef,
  type IrSourceRef,
  type NavigationIr,
  type NavigationIrLayoutRecord,
  type NavigationIrRedirectRecord,
  type NavigationIrRouteRecord,
  type NavigationIrRouteSetRecord,
} from './navigation-ir.js';

export interface ExpandNavigationResult {
  readonly model: ExpandedNavigationModel;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

interface LayoutContext {
  readonly id: number;
  readonly parent?: LayoutContext;
  readonly summary: ExpandedLayout;
  readonly depth: number;
}

interface PolicyContext {
  readonly parent?: PolicyContext;
  readonly policy: SemanticPolicy;
  readonly depth: number;
}

interface RouteContext {
  readonly path: string;
  readonly layouts?: LayoutContext;
  readonly policies?: PolicyContext;
}

interface SlotRecord {
  readonly expanded: ExpandedRouteSlot;
  readonly context: RouteContext;
}

interface PendingGroup {
  readonly path: string;
  readonly context: RouteContext;
  readonly slotId?: string;
  readonly routeSetId?: string;
  primary?: NavigationIrRouteRecord | NavigationIrRedirectRecord;
  readonly outlets: NavigationIrRouteRecord[];
}

const enum RouteSetVisitState {
  Unvisited = 0,
  Visiting = 1,
  Visited = 2,
}

export function expandNavigation(ir: NavigationIr): ExpandNavigationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const slots = new Map<string, SlotRecord>();
  const routeSets: ExpandedRouteSet[] = [];
  const groups = new Map<string, PendingGroup>();
  const ownerIndexBySlot = new Map<string, number>();
  const routeSetIds = new Array<string>(ir.routeSets.length);
  const routeSetIndexById = new Map<string, number>();
  const routeSetBranchIds = new Array<string[]>(ir.routeSets.length);
  const routeSetStates = new Uint8Array(ir.routeSets.length);
  let layoutContextId = 0;

  for (let index = 0; index < ir.routeSets.length; index++) {
    const routeSet = ir.routeSets[index]!;
    const slotId = requireIrString(ir, routeSet.slotId, 'route-set slot id');
    ownerIndexBySlot.set(slotId, index);
    routeSetIds[index] = createRouteSetId(ir, routeSet);
    routeSetIndexById.set(routeSetIds[index]!, index);
    routeSetBranchIds[index] = [];
  }

  const rootContext: RouteContext = { path: '/' };
  visitEntryRange(
    ir.rootFirstEntry,
    ir.rootEntryCount,
    rootContext,
    undefined,
    undefined,
  );

  const branches: ExpandedRouteBranch[] = [];
  for (const pending of groups.values()) {
    if (!pending.primary) {
      const first = pending.outlets[0];
      diagnostics.push(diagnostic(
        'NAV1402',
        'error',
        `Named outlet route for "${pending.path}" has no primary route in the same layout context.`,
        first ? sourceFromIr(ir, first.source) : undefined,
        { routePath: pending.path },
      ));
      continue;
    }

    const branch = createBranch(ir, pending);
    branches.push(branch);
    if (branch.routeSetId) {
      const routeSetIndex = routeSetIndexById.get(branch.routeSetId);
      if (routeSetIndex !== undefined) routeSetBranchIds[routeSetIndex]!.push(branch.id);
    }
  }

  for (let index = 0; index < ir.routeSets.length; index++) {
    if (routeSetStates[index] !== RouteSetVisitState.Visited) continue;
    const routeSet = ir.routeSets[index]!;
    const slotId = requireIrString(ir, routeSet.slotId, 'route-set slot id');
    const targetSlot = slots.get(slotId);
    routeSets.push({
      id: routeSetIds[index]!,
      slotId,
      source: sourceFromIr(ir, routeSet.source)!,
      branchIds: Object.freeze(routeSetBranchIds[index]!),
      parentRouteSetId: targetSlot?.expanded.declaredByRouteSetId,
    });
  }

  return {
    model: {
      branches: Object.freeze(branches.sort(compareBranches)),
      slots: Object.freeze(Array.from(slots.values(), item => item.expanded)
        .sort((left, right) => left.id.localeCompare(right.id))),
      routeSets: Object.freeze(routeSets.sort((left, right) => left.id.localeCompare(right.id))),
    },
    diagnostics,
  };

  function visitEntryRange(
    first: number,
    count: number,
    context: RouteContext,
    parentSlotId: string | undefined,
    routeSetId: string | undefined,
  ): void {
    const end = first + count;
    for (let offset = first; offset < end; offset++) {
      const entryRef = ir.entryRefs[offset];
      if (entryRef === undefined) continue;
      visitEntry(entryRef, context, parentSlotId, routeSetId);
    }
  }

  function visitEntry(
    entryRef: IrEntryRef,
    context: RouteContext,
    parentSlotId: string | undefined,
    routeSetId: string | undefined,
  ): void {
    const entry = ir.entries[entryRef];
    if (!entry) return;

    if (entry.kind === NavigationIrEntryKind.Layout) {
      const path = joinRoutePath(context.path, requireIrString(ir, entry.path, 'layout path'));
      const policy = readPolicy(ir, entry.policy);
      const layouts: LayoutContext = {
        id: ++layoutContextId,
        parent: context.layouts,
        summary: {
          path,
          pageType: readIrString(ir, entry.pageType),
          loadMode: readLoadMode(entry.loadMode),
          policy,
        },
        depth: (context.layouts?.depth ?? 0) + 1,
      };
      const policies = policy
        ? {
            parent: context.policies,
            policy,
            depth: (context.policies?.depth ?? 0) + 1,
          }
        : context.policies;
      visitEntryRange(
        entry.firstChild,
        entry.childCount,
        { path, layouts, policies },
        parentSlotId,
        routeSetId,
      );
      return;
    }

    if (entry.kind === NavigationIrEntryKind.Slot) {
      const id = requireIrString(ir, entry.id, 'route slot id');
      if (slots.has(id)) {
        diagnostics.push(diagnostic(
          'NAV1500',
          'error',
          `Duplicate route slot id "${id}".`,
          sourceFromIr(ir, entry.source),
        ));
        return;
      }

      const record: SlotRecord = {
        expanded: {
          id,
          parentPath: context.path,
          layoutDepth: context.layouts?.depth ?? 0,
          source: sourceFromIr(ir, entry.source)!,
          parentSlotId,
          declaredByRouteSetId: routeSetId,
        },
        context,
      };
      slots.set(id, record);

      const ownerIndex = ownerIndexBySlot.get(id);
      if (ownerIndex !== undefined) {
        expandRouteSet(ownerIndex, record);
      }
      return;
    }

    const fullPath = joinRoutePath(context.path, requireIrString(ir, entry.path, 'route path'));
    const key = `${context.layouts?.id ?? 0}\u0000${fullPath}\u0000${parentSlotId ?? ''}\u0000${routeSetId ?? ''}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        path: fullPath,
        context,
        slotId: parentSlotId,
        routeSetId,
        outlets: [],
      };
      groups.set(key, group);
    }

    if (entry.kind === NavigationIrEntryKind.Route && entry.outlet !== NO_IR_REF) {
      group.outlets.push(entry);
    } else if (group.primary) {
      diagnostics.push(diagnostic(
        'NAV1301',
        'error',
        `Duplicate primary route for compiled path "${fullPath}".`,
        sourceFromIr(ir, entry.source),
        {
          routePath: fullPath,
          routeName: readIrString(ir, entry.name),
        },
      ));
    } else {
      group.primary = entry;
    }
  }

  function expandRouteSet(index: number, slot: SlotRecord): void {
    const state = routeSetStates[index];
    if (state === RouteSetVisitState.Visited) return;
    if (state === RouteSetVisitState.Visiting) {
      diagnostics.push(diagnostic(
        'NAV1510',
        'error',
        `Route ownership cycle detected while expanding slot "${slot.expanded.id}".`,
        slot.expanded.source,
      ));
      return;
    }

    routeSetStates[index] = RouteSetVisitState.Visiting;
    const routeSet = ir.routeSets[index]!;
    visitEntryRange(
      routeSet.firstEntry,
      routeSet.entryCount,
      slot.context,
      slot.expanded.id,
      routeSetIds[index],
    );
    routeSetStates[index] = RouteSetVisitState.Visited;
  }
}
function createBranch(
  ir: NavigationIr,
  group: PendingGroup,
): ExpandedRouteBranch {
  const primary = group.primary!;
  const layouts = materializeLayouts(group.context.layouts);
  const policies = materializePolicies(group.context.policies, readPolicy(ir, primary.policy));
  const outlets = new Array<ExpandedOutlet>(group.outlets.length);
  for (let index = 0; index < group.outlets.length; index++) {
    const outlet = group.outlets[index]!;
    outlets[index] = {
      path: group.path,
      pageType: readIrString(ir, outlet.pageType),
      loadMode: readLoadMode(outlet.loadMode),
      outlet: requireIrString(ir, outlet.outlet, 'outlet name'),
    };
  }

  const source = sourceFromIr(
    ir,
    primary.branchSource !== NO_IR_REF ? primary.branchSource : primary.source,
  );
  const name = readIrString(ir, primary.name);
  const id = name ?? createBranchId(group.path, layouts, source, group.routeSetId);

  return {
    id,
    kind: primary.kind === NavigationIrEntryKind.Redirect ? 'redirect' : 'route',
    path: group.path,
    staticPrefix: deriveStaticPrefix(group.path),
    name,
    pageType: primary.kind === NavigationIrEntryKind.Route
      ? readIrString(ir, primary.pageType)
      : undefined,
    loadMode: primary.kind === NavigationIrEntryKind.Route
      ? readLoadMode(primary.loadMode)
      : undefined,
    redirectTo: primary.kind === NavigationIrEntryKind.Redirect
      ? compileRedirect(group.context.path, requireIrString(ir, primary.redirectTo, 'redirect target'))
      : undefined,
    paramsSchema: primary.kind === NavigationIrEntryKind.Route
      ? readSchema(ir, primary.paramsSchema)
      : undefined,
    querySchema: primary.kind === NavigationIrEntryKind.Route
      ? readSchema(ir, primary.querySchema)
      : undefined,
    layouts,
    outlets: Object.freeze(outlets),
    policies,
    source,
    slotId: group.slotId,
    routeSetId: group.routeSetId,
  };
}

function sourceFromIr(
  ir: NavigationIr,
  ref: IrSourceRef,
): SourceReference | undefined {
  if (ref === NO_IR_REF) return undefined;
  const source = ir.sources[ref];
  if (!source) return undefined;
  return {
    filePath: requiredString(source.filePath, 'source file'),
    exportName: readIrString(ir, source.exportName),
    localName: readIrString(ir, source.localName),
    start: source.start,
    length: source.length,
  };

  function requiredString(stringRef: number, label: string): string {
    const value = readIrString(ir, stringRef);
    if (value === undefined) throw new Error(`Navigation IR is missing ${label}.`);
    return value;
  }
}

function readPolicy(ir: NavigationIr, ref: number): SemanticPolicy | undefined {
  return ref === NO_IR_REF ? undefined : ir.policies[ref];
}

function readSchema(ir: NavigationIr, ref: number): SemanticSchemaRecord | undefined {
  return ref === NO_IR_REF ? undefined : ir.schemas[ref];
}

function readLoadMode(mode: NavigationIrLoadMode): 'eager' | 'lazy' {
  return mode === NavigationIrLoadMode.Lazy ? 'lazy' : 'eager';
}

function materializeLayouts(context: LayoutContext | undefined): readonly ExpandedLayout[] {
  if (!context) return Object.freeze([]);
  const result = new Array<ExpandedLayout>(context.depth);
  let current: LayoutContext | undefined = context;
  while (current) {
    result[current.depth - 1] = current.summary;
    current = current.parent;
  }
  return Object.freeze(result);
}

function materializePolicies(
  context: PolicyContext | undefined,
  routePolicy: SemanticPolicy | undefined,
): readonly SemanticPolicy[] {
  const count = (context?.depth ?? 0) + (routePolicy ? 1 : 0);
  if (!count) return Object.freeze([]);
  const result = new Array<SemanticPolicy>(count);
  let current = context;
  while (current) {
    result[current.depth - 1] = current.policy;
    current = current.parent;
  }
  if (routePolicy) result[count - 1] = routePolicy;
  return Object.freeze(result);
}

function compileRedirect(parentPath: string, redirectTo: string): string {
  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(redirectTo) || redirectTo.startsWith('//')) return redirectTo;
  return redirectTo.startsWith('/')
    ? joinRoutePath('/', redirectTo)
    : joinRoutePath(parentPath, redirectTo);
}

function createRouteSetId(ir: NavigationIr, routeSet: NavigationIrRouteSetRecord): string {
  const id = readIrString(ir, routeSet.id);
  if (!id) {
    throw new Error('Navigation IR route set is missing its required id.');
  }
  return id;
}

function createBranchId(
  path: string,
  layouts: readonly ExpandedLayout[],
  source: SourceReference | undefined,
  routeSetId: string | undefined,
): string {
  return `route_${shortHash([
    path,
    layouts.map(layout => layout.path).join('|'),
    source?.filePath ?? '',
    source?.exportName ?? '',
    routeSetId ?? '',
  ].join('\u0000'))}`;
}

function shortHash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}


function compareBranches(left: ExpandedRouteBranch, right: ExpandedRouteBranch): number {
  return left.path.localeCompare(right.path) || left.id.localeCompare(right.id);
}

function requireIrString(ir: NavigationIr, ref: number, label: string): string {
  const value = readIrString(ir, ref);
  if (value === undefined) throw new Error(`Navigation IR is missing ${label}.`);
  return value;
}