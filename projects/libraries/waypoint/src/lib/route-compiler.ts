import type {
  LayoutDefinition,
  NavigationTree,
  RouteContributionDefinition,
  RouteDefinition,
  RouteSlotDefinition,
} from './navigation-definitions';
import {
  compileRoutePath,
  extractRouteParamNames,
  joinRoutePath,
} from './route-path';
import { normalizeRouteIdentity } from './route-slots';

export interface CompiledRoute {
  readonly route: RouteDefinition;
  readonly path: string;
  readonly redirectTo?: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly slotId?: string;
  readonly contributionId?: string;
}

export interface CompiledRouteGroup {
  readonly path: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly primary: CompiledRoute;
  readonly outlets: readonly CompiledRoute[];
}

export interface CompiledRouteSlot {
  readonly id: string;
  readonly parentPath: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly definition: RouteSlotDefinition;
}

export interface CompiledRouteContribution {
  readonly id: string;
  readonly slotId: string;
  readonly definition: RouteContributionDefinition;
  readonly routes: readonly CompiledRoute[];
}

export interface CompiledNavigation {
  readonly routes: readonly CompiledRoute[];
  readonly slots: ReadonlyMap<string, CompiledRouteSlot>;
  readonly contributions: ReadonlyMap<string, CompiledRouteContribution>;
}

export interface RouteRegistryRecord {
  readonly route: RouteDefinition;
  readonly fullPath: string;
  readonly slotId?: string;
  readonly contributionId?: string;
}

export interface RouteRegistry {
  readonly namedRoutes: ReadonlyMap<string, RouteRegistryRecord>;
  readonly groups: readonly CompiledRouteGroup[];
  readonly slots: ReadonlyMap<string, CompiledRouteSlot>;
  readonly contributions: ReadonlyMap<string, CompiledRouteContribution>;
}

interface CompileContext {
  readonly contributionsBySlot: ReadonlyMap<
    string,
    readonly RouteContributionDefinition[]
  >;
  readonly contributionIds: Set<string>;
  readonly activeContributionIds: Set<string>;
  readonly slots: Map<string, CompiledRouteSlot>;
  readonly contributions: Map<string, CompiledRouteContribution>;
  readonly output: CompiledRoute[];
}

export { joinRoutePath } from './route-path';

export function compileRedirect(
  parentPath: string,
  redirectTo: string | undefined,
): string | undefined {
  if (!redirectTo) {
    return undefined;
  }

  if (
    /^[A-Za-z][A-Za-z\d+.-]*:/.test(redirectTo) ||
    redirectTo.startsWith('//')
  ) {
    return redirectTo;
  }

  return redirectTo.startsWith('/')
    ? joinRoutePath('/', redirectTo)
    : joinRoutePath(parentPath, redirectTo);
}

export function compileNavigation(
  entries: NavigationTree,
  contributions: readonly RouteContributionDefinition[] = [],
): CompiledNavigation {
  const contributionsBySlot = indexContributions(contributions);
  const context: CompileContext = {
    contributionsBySlot,
    contributionIds: new Set(),
    activeContributionIds: new Set(),
    slots: new Map(),
    contributions: new Map(),
    output: [],
  };

  compileEntries(entries, '/', Object.freeze([]), context);

  for (const contribution of contributions) {
    if (!context.slots.has(contribution.slotId)) {
      throw new Error(
        `Route contribution "${contribution.id}" targets unknown route slot ` +
        `"${contribution.slotId}".`,
      );
    }
  }

  return Object.freeze({
    routes: Object.freeze([...context.output]),
    slots: context.slots,
    contributions: context.contributions,
  });
}

export function compileRoutes(
  entries: NavigationTree,
  parentPath = '/',
  layouts: readonly LayoutDefinition[] = [],
  output: CompiledRoute[] = [],
): readonly CompiledRoute[] {
  const context: CompileContext = {
    contributionsBySlot: new Map(),
    contributionIds: new Set(),
    activeContributionIds: new Set(),
    slots: new Map(),
    contributions: new Map(),
    output,
  };

  compileEntries(entries, parentPath, layouts, context);
  return output;
}

function compileEntries(
  entries: NavigationTree,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
  provenance?: {
    readonly slotId: string;
    readonly contributionId: string;
  },
): void {
  for (const entry of entries) {
    if (entry.kind === 'route-slot') {
      compileSlot(entry, parentPath, layouts, context);
      continue;
    }

    if (entry.kind === 'layout') {
      compileEntries(
        entry.entries,
        joinRoutePath(parentPath, entry.path),
        Object.freeze([...layouts, entry]),
        context,
        provenance,
      );
      continue;
    }

    context.output.push({
      route: entry,
      path: joinRoutePath(parentPath, entry.path),
      redirectTo: compileRedirect(parentPath, entry.redirectTo),
      layouts,
      slotId: provenance?.slotId,
      contributionId: provenance?.contributionId,
    });
  }
}

function compileSlot(
  definition: RouteSlotDefinition,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
): void {
  const id = normalizeRouteIdentity(definition.id, 'Route slot');

  if (context.slots.has(id)) {
    throw new Error(
      `Duplicate route slot id "${id}". ` +
      'Route slot ids must be globally unique.',
    );
  }

  context.slots.set(id, Object.freeze({
    id,
    parentPath,
    layouts,
    definition,
  }));

  for (const contribution of context.contributionsBySlot.get(id) ?? []) {
    compileContribution(contribution, parentPath, layouts, context);
  }
}

function compileContribution(
  definition: RouteContributionDefinition,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
): void {
  const id = normalizeRouteIdentity(definition.id, 'Route contribution');
  const slotId = normalizeRouteIdentity(
    definition.slotId,
    `Route contribution "${id}" slot`,
  );

  if (context.contributionIds.has(id)) {
    throw new Error(
      `Duplicate route contribution id "${id}". ` +
      'Route contribution ids must be globally unique.',
    );
  }

  if (context.activeContributionIds.has(id)) {
    throw new Error(
      `Recursive route contribution "${id}" was detected.`,
    );
  }

  context.contributionIds.add(id);
  context.activeContributionIds.add(id);

  const start = context.output.length;
  try {
    compileEntries(
      definition.entries,
      parentPath,
      layouts,
      context,
      { slotId, contributionId: id },
    );
  } finally {
    context.activeContributionIds.delete(id);
  }

  const routes = Object.freeze(context.output.slice(start));
  context.contributions.set(id, Object.freeze({
    id,
    slotId,
    definition,
    routes,
  }));
}

function indexContributions(
  contributions: readonly RouteContributionDefinition[],
): ReadonlyMap<string, readonly RouteContributionDefinition[]> {
  const bySlot = new Map<string, RouteContributionDefinition[]>();
  const ids = new Set<string>();

  for (const contribution of contributions) {
    const id = normalizeRouteIdentity(contribution.id, 'Route contribution');
    const slotId = normalizeRouteIdentity(
      contribution.slotId,
      `Route contribution "${id}" slot`,
    );

    if (ids.has(id)) {
      throw new Error(
        `Duplicate route contribution id "${id}". ` +
        'Route contribution ids must be globally unique.',
      );
    }

    ids.add(id);
    const current = bySlot.get(slotId) ?? [];
    current.push(contribution);
    bySlot.set(slotId, current);
  }

  return bySlot;
}

export function groupRoutes(
  compiled: readonly CompiledRoute[],
): readonly CompiledRouteGroup[] {
  const groups = new Map<string, CompiledRouteGroup>();

  for (const route of compiled) {
    const key = `${route.path}#${route.layouts.map(layout => layout.path).join('/')}`;
    let group = groups.get(key);

    if (!group) {
      if (route.route.outlet) {
        throw new Error(
          `Named outlet route "${route.route.name ?? route.path}" with path ` +
          `"${route.path}" has no corresponding primary outlet route with the same path.`,
        );
      }

      group = {
        path: route.path,
        layouts: route.layouts,
        primary: route,
        outlets: [],
      };
      groups.set(key, group);
      continue;
    }

    if (!route.route.outlet) {
      throw new Error(
        `Duplicate primary route for path "${route.path}" under the same layout chain.`,
      );
    }

    groups.set(key, {
      ...group,
      outlets: [...group.outlets, route],
    });
  }

  return Array.from(groups.values());
}

export function createRouteRegistry(
  entries: NavigationTree,
  contributions: readonly RouteContributionDefinition[] = [],
): RouteRegistry {
  const compiled = compileNavigation(entries, contributions);
  const groups = groupRoutes(compiled.routes);
  validateRouteGroups(groups);

  const namedRoutes = new Map<string, RouteRegistryRecord>();
  const literalPaths = new Map<string, RouteDefinition>();
  const patterns = new Map<string, string>();

  for (const compiledRoute of groups.flatMap(group => [
    group.primary,
    ...group.outlets,
  ])) {
    const { route, path } = compiledRoute;
    validateCompiledRouteParams(route, path);

    const previous = literalPaths.get(path);
    if (previous && !previous.outlet && !route.outlet) {
      throw new Error(`Duplicate compiled route path "${path}".`);
    }
    literalPaths.set(path, route);

    const pattern = compileRoutePath(path).patternKey;
    const previousPattern = patterns.get(pattern);
    if (previousPattern && previousPattern !== path) {
      throw new Error(
        `Conflicting route patterns "${previousPattern}" and "${path}".`,
      );
    }
    patterns.set(pattern, path);

    if (!route.name) {
      continue;
    }

    if (namedRoutes.has(route.name)) {
      throw new Error(
        `Duplicate route name "${route.name}". ` +
        'Route names must be globally unique.',
      );
    }

    namedRoutes.set(route.name, {
      route,
      fullPath: path,
      slotId: compiledRoute.slotId,
      contributionId: compiledRoute.contributionId,
    });
  }

  return {
    namedRoutes,
    groups,
    slots: compiled.slots,
    contributions: compiled.contributions,
  };
}

function validateCompiledRouteParams(
  route: RouteDefinition,
  path: string,
): void {
  const paramNames = extractRouteParamNames(path);
  const seen = new Set<string>();

  for (const name of paramNames) {
    if (seen.has(name)) {
      throw new Error(
        `Duplicate path parameter ":${name}" in compiled route "${path}". ` +
        'Path parameter names must be unique across the complete layout and route path.',
      );
    }
    seen.add(name);
  }

  const schema = route.paramsSchema;
  if (!schema) {
    return;
  }

  const schemaNames = Object.keys(schema);
  for (const name of schemaNames) {
    if (!seen.has(name)) {
      throw new Error(
        `paramsSchema declares "${name}", but compiled route "${path}" ` +
        `does not contain ":${name}".`,
      );
    }
  }

  const declared = new Set(schemaNames);
  for (const name of paramNames) {
    if (!declared.has(name)) {
      throw new Error(
        `Compiled route "${path}" contains ":${name}", but paramsSchema ` +
        'does not declare it. Declare every path parameter when paramsSchema is present.',
      );
    }
  }
}

function validateRouteGroups(
  groups: readonly CompiledRouteGroup[],
): void {
  const names = new Set<string>();

  for (const group of groups) {
    const primaryName = group.primary.route.name;
    if (primaryName) {
      if (names.has(primaryName)) {
        throw new Error(
          `Duplicate route name "${primaryName}". Route names must be globally unique.`,
        );
      }
      names.add(primaryName);
    }

    if (group.primary.redirectTo && group.outlets.length > 0) {
      throw new Error(
        `A redirect route cannot have named outlets. Path: "${group.path}"`,
      );
    }

    const outletNames = new Set<string>();
    for (const outlet of group.outlets) {
      const outletName = outlet.route.outlet!;
      if (outletNames.has(outletName)) {
        throw new Error(
          `Duplicate outlet named "${outletName}" for route path "${group.path}".`,
        );
      }
      outletNames.add(outletName);

      if (outlet.route.name) {
        throw new Error(
          `Named outlet routes cannot have a "name" property. Route path: ` +
          `"${group.path}", outlet: "${outletName}"`,
        );
      }
      if (outlet.redirectTo) {
        throw new Error(
          `Named outlet routes cannot be redirects. Route path: ` +
          `"${group.path}", outlet: "${outletName}"`,
        );
      }
      if (outlet.route.paramsSchema || outlet.route.querySchema) {
        throw new Error(
          'Named outlet routes cannot define paramsSchema or querySchema.',
        );
      }
      if (outlet.route.viewTransition !== undefined) {
        throw new Error(
          'Named outlet routes cannot define viewTransition.',
        );
      }
      if (outlet.route.preload !== undefined) {
        throw new Error('Named outlet routes cannot define preload.');
      }
    }
  }
}
