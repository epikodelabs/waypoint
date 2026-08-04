import type {
  CompiledLayoutSummary,
  CompiledOutletSummary,
  CompiledRouteBranch,
  ParsedRouteEntry,
  ParsedRouteEntryLayout,
  ParsedRouteEntryRedirect,
  ParsedRouteEntryRoute,
  ParsedRouteGraph,
  ParsedRoutePolicy,
  RouteCompilerDiagnostic,
} from './types.js';

export interface BuildRouteGraphResult {
  readonly branches: readonly CompiledRouteBranch[];
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

interface FlattenedLayoutRecord {
  readonly path: string;
  readonly pageType?: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly policy?: ParsedRoutePolicy;
}

interface FlattenedRouteRecord {
  readonly entry:
    | ParsedRouteEntryRoute
    | ParsedRouteEntryRedirect;
  readonly fullPath: string;
  readonly layouts: readonly FlattenedLayoutRecord[];
}

export function buildRouteGraph(
  graph: ParsedRouteGraph,
): BuildRouteGraphResult {
  return {
    branches:
      compileRouteBranches(
        graph.routes,
      ),
    diagnostics: [],
  };
}

function compileRouteBranches(
  routes: readonly ParsedRouteEntry[],
): readonly CompiledRouteBranch[] {
  const flattened =
    flattenRoutes(routes);
  const groups =
    new Map<
      string,
      FlattenedRouteRecord[]
    >();

  for (const route of flattened) {
    const key =
      `${route.fullPath}#${route.layouts.map(layout => layout.path).join('/')}`;
    const current =
      groups.get(key) ?? [];
    current.push(route);
    groups.set(key, current);
  }

  const branches: CompiledRouteBranch[] = [];
  let anonymousCount = 0;

  for (const members of groups.values()) {
    const primary =
      members.find(
        member => !member.entry.outlet,
      );

    if (!primary) {
      continue;
    }

    const outlets: CompiledOutletSummary[] = [];

    for (const member of members) {
      if (
        member.entry.kind !== 'route'
        || !member.entry.outlet
      ) {
        continue;
      }

      outlets.push({
        path: member.fullPath,
        pageType:
          member.entry.pageType,
        loadMode:
          member.entry.loadMode,
        outlet:
          member.entry.outlet,
      });
    }

    const id =
      primary.entry.name
      ?? `branch_${++anonymousCount}`;
    const staticPrefix =
      deriveStaticPrefix(
        primary.fullPath,
      );
    const layouts =
      primary.layouts.map(
        layout => ({
          path: layout.path,
          pageType:
            layout.pageType,
          loadMode:
            layout.loadMode,
          policy:
            layout.policy,
        }) satisfies CompiledLayoutSummary,
      );
    const policies =
      [
        ...primary.layouts
          .map(layout => layout.policy)
          .filter(
            (
              policy,
            ): policy is ParsedRoutePolicy => !!policy,
          ),
        ...(primary.entry.policy
          ? [primary.entry.policy]
          : []),
      ];
    const source =
      primary.entry.branchSource
      ?? primary.entry.source;

    branches.push({
      id,
      kind: primary.entry.kind,
      path: primary.fullPath,
      staticPrefix,
      name: primary.entry.name,
      pageType:
        primary.entry.kind === 'route'
          ? primary.entry.pageType
          : undefined,
      loadMode:
        primary.entry.kind === 'route'
          ? primary.entry.loadMode
          : undefined,
      redirectTo:
        primary.entry.kind === 'redirect'
          ? primary.entry.redirectTo
          : undefined,
      paramsSchema:
        primary.entry.kind === 'route'
          ? primary.entry.paramsSchema
          : undefined,
      querySchema:
        primary.entry.kind === 'route'
          ? primary.entry.querySchema
          : undefined,
      layouts,
      outlets,
      policies,
      source,
    });
  }

  return Object.freeze(branches);
}

function flattenRoutes(
  entries: readonly ParsedRouteEntry[],
  parentPath = '/',
  layouts: readonly FlattenedLayoutRecord[] = [],
  output: FlattenedRouteRecord[] = [],
): readonly FlattenedRouteRecord[] {
  for (const entry of entries) {
    if (entry.kind === 'layout') {
      const fullLayoutPath =
        joinRoutePath(
          parentPath,
          entry.path,
        );
      flattenRoutes(
        entry.entries,
        fullLayoutPath,
        Object.freeze([
          ...layouts,
          {
            path: fullLayoutPath,
            pageType:
              entry.pageType,
            loadMode:
              entry.loadMode,
            policy:
              entry.policy,
          },
        ]),
        output,
      );
      continue;
    }

    output.push({
      entry,
      fullPath: joinRoutePath(
        parentPath,
        entry.path,
      ),
      layouts,
    });
  }

  return output;
}

function joinRoutePath(
  parent: string,
  child: string,
): string {
  const parentSegments =
    parent
      .split('/')
      .filter(Boolean);
  const childSegments =
    child
      .split('/')
      .filter(Boolean);
  const joined = [
    ...parentSegments,
    ...childSegments,
  ].join('/');

  return joined
    ? `/${joined}`
    : '/';
}

function deriveStaticPrefix(
  fullPath: string,
): string {
  const segments =
    fullPath
      .split('/')
      .filter(Boolean);
  const staticSegments: string[] = [];

  for (const segment of segments) {
    if (segment.startsWith(':')) {
      break;
    }

    staticSegments.push(segment);
  }

  return staticSegments.length > 0
    ? `/${staticSegments.join('/')}`
    : '/';
}
