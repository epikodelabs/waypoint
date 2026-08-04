import { createHash } from 'node:crypto';
import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import {
  deriveStaticPrefix,
  joinRoutePath,
} from './route-path.js';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  ExpandedLayout,
  ExpandedOutlet,
  ExpandedRouteBranch,
  ExpandedNavigationModel,
  ExpandedRouteSet,
  ExpandedRouteSlot,
  SemanticEntry,
  SemanticLayout,
  SemanticRedirect,
  SemanticRoute,
  SemanticNavigationProgram,
  SemanticPolicy,
  SemanticRoutesFor,
  SourceReference,
} from './model.js';

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
  readonly compiled: ExpandedRouteSlot;
  readonly context: RouteContext;
}

interface PendingGroup {
  readonly path: string;
  readonly context: RouteContext;
  readonly slotId?: string;
  readonly routeSetId?: string;
  primary?: SemanticRoute | SemanticRedirect;
  readonly outlets: SemanticRoute[];
}

export function expandNavigation(graph: SemanticNavigationProgram): ExpandNavigationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const slots = new Map<string, SlotRecord>();
  const routeSets: ExpandedRouteSet[] = [];
  const groups = new Map<string, PendingGroup>();
  let layoutContextId = 0;

  const rootContext: RouteContext = { path: '/' };
  visitEntries(graph.routes, rootContext, undefined, undefined);

  const routeSetBranchIds = new Map<string, string[]>();
  for (const routeSet of graph.routeSets) {
    const slot = slots.get(routeSet.slotId);
    const routeSetId = createRouteSetId(routeSet);
    if (!slot) {
      diagnostics.push(diagnostic(
        'WPT2002',
        'error',
        `routesFor() export "${routeSet.source.exportName ?? routeSetId}" targets unknown route slot "${routeSet.slotId}".`,
        routeSet.source,
      ));
      continue;
    }

    if (routeSetBranchIds.has(routeSetId)) {
      diagnostics.push(diagnostic(
        'WPT2003',
        'error',
        `Duplicate routesFor() identity "${routeSetId}".`,
        routeSet.source,
      ));
      continue;
    }

    routeSetBranchIds.set(routeSetId, []);
    visitEntries(routeSet.entries, slot.context, routeSet.slotId, routeSetId);
  }

  const branches: ExpandedRouteBranch[] = [];
  for (const pending of groups.values()) {
    if (!pending.primary) {
      const first = pending.outlets[0];
      diagnostics.push(diagnostic(
        'WPT2101',
        'error',
        `Named outlet route for "${pending.path}" has no primary route in the same layout context.`,
        first?.source,
        { routePath: pending.path },
      ));
      continue;
    }

    const branch = createBranch(pending);
    branches.push(branch);
    if (branch.routeSetId) {
      routeSetBranchIds.get(branch.routeSetId)?.push(branch.id);
    }
  }

  for (const routeSet of graph.routeSets) {
    const id = createRouteSetId(routeSet);
    if (!routeSetBranchIds.has(id)) continue;
    routeSets.push({
      id,
      slotId: routeSet.slotId,
      source: routeSet.source,
      branchIds: Object.freeze(routeSetBranchIds.get(id)!),
    });
  }

  return {
    model: {
      branches: Object.freeze(branches.sort(compareBranches)),
      slots: Object.freeze(Array.from(slots.values(), item => item.compiled)
        .sort((left, right) => left.id.localeCompare(right.id))),
      routeSets: Object.freeze(routeSets.sort((left, right) => left.id.localeCompare(right.id))),
    },
    diagnostics,
  };

  function visitEntries(
    entries: readonly SemanticEntry[],
    context: RouteContext,
    slotId: string | undefined,
    routeSetId: string | undefined,
  ): void {
    for (const entry of entries) {
      if (entry.kind === 'layout') {
        const path = joinRoutePath(context.path, entry.path);
        const layouts: LayoutContext = {
          id: ++layoutContextId,
          parent: context.layouts,
          summary: {
            path,
            pageType: entry.pageType,
            loadMode: entry.loadMode,
            policy: entry.policy,
          },
          depth: (context.layouts?.depth ?? 0) + 1,
        };
        const policies = entry.policy
          ? { parent: context.policies, policy: entry.policy, depth: (context.policies?.depth ?? 0) + 1 }
          : context.policies;
        visitEntries(entry.entries, { path, layouts, policies }, slotId, routeSetId);
        continue;
      }

      if (entry.kind === 'slot') {
        if (slots.has(entry.id)) {
          diagnostics.push(diagnostic(
            'WPT2001',
            'error',
            `Duplicate route slot id "${entry.id}".`,
            entry.source,
          ));
          continue;
        }
        slots.set(entry.id, {
          compiled: {
            id: entry.id,
            parentPath: context.path,
            layoutDepth: context.layouts?.depth ?? 0,
            source: entry.source,
          },
          context,
        });
        continue;
      }

      const fullPath = joinRoutePath(context.path, entry.path);
      const key = `${context.layouts?.id ?? 0}\u0000${fullPath}\u0000${slotId ?? ''}\u0000${routeSetId ?? ''}`;
      let group = groups.get(key);
      if (!group) {
        group = { path: fullPath, context, slotId, routeSetId, outlets: [] };
        groups.set(key, group);
      }

      if (entry.outlet && entry.kind === 'route') {
        group.outlets.push(entry);
      } else if (group.primary) {
        diagnostics.push(diagnostic(
          'WPT2102',
          'error',
          `Duplicate primary route for compiled path "${fullPath}".`,
          entry.source,
          { routePath: fullPath, routeName: entry.name },
        ));
      } else {
        group.primary = entry;
      }
    }
  }
}

function createBranch(group: PendingGroup): ExpandedRouteBranch {
  const primary = group.primary!;
  const layouts = materializeLayouts(group.context.layouts);
  const routePolicy = primary.policy;
  const policies = materializePolicies(group.context.policies, routePolicy);
  const outlets: ExpandedOutlet[] = group.outlets.map(outlet => ({
    path: group.path,
    pageType: outlet.pageType,
    loadMode: outlet.loadMode,
    outlet: outlet.outlet!,
  }));
  const source = primary.branchSource ?? primary.source;
  const id = primary.name ?? createBranchId(group.path, layouts, source, group.routeSetId);

  return {
    id,
    kind: primary.kind,
    path: group.path,
    staticPrefix: deriveStaticPrefix(group.path),
    name: primary.name,
    pageType: primary.kind === 'route' ? primary.pageType : undefined,
    loadMode: primary.kind === 'route' ? primary.loadMode : undefined,
    redirectTo: primary.kind === 'redirect' ? compileRedirect(group.context.path, primary.redirectTo) : undefined,
    paramsSchema: primary.kind === 'route' ? primary.paramsSchema : undefined,
    querySchema: primary.kind === 'route' ? primary.querySchema : undefined,
    layouts,
    outlets: Object.freeze(outlets),
    policies,
    source,
    slotId: group.slotId,
    routeSetId: group.routeSetId,
  };
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
  return redirectTo.startsWith('/') ? joinRoutePath('/', redirectTo) : joinRoutePath(parentPath, redirectTo);
}

function createRouteSetId(routeSet: SemanticRoutesFor): string {
  const exportName = routeSet.source.exportName ?? routeSet.source.localName ?? 'routes';
  const hash = shortHash(`${routeSet.slotId}\u0000${routeSet.source.filePath}\u0000${exportName}`);
  return `${safeStem(routeSet.slotId)}__${safeStem(exportName)}__${hash}`;
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

function safeStem(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'routes';
}

function compareBranches(left: ExpandedRouteBranch, right: ExpandedRouteBranch): number {
  return left.path.localeCompare(right.path) || left.id.localeCompare(right.id);
}
