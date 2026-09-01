import type {
  LayoutDefinition,
  NavigationTree,
  RedirectRouteDefinition,
  RenderableRoute,
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

interface CompiledRouteBase {
  readonly path: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly slotId?: string;
  readonly contributionId?: string;
}

interface CompiledRenderableRoute extends CompiledRouteBase {
  readonly route: RenderableRoute;
  readonly redirectTo?: never;
}

interface CompiledRedirectRoute extends CompiledRouteBase {
  readonly route: RedirectRouteDefinition;
  readonly redirectTo: string;
}

type CompiledRoute =
  | CompiledRenderableRoute
  | CompiledRedirectRoute;

interface CompiledRouteGroup {
  readonly primary: CompiledRoute;
  readonly outlets: readonly CompiledRenderableRoute[];
}

interface RouteRegistry {
  readonly namedRoutes: ReadonlyMap<string, CompiledRoute>;
  readonly groups: readonly CompiledRouteGroup[];
}

interface CompileContext {
  readonly contributionsBySlot: ReadonlyMap<
    string,
    readonly RouteContributionDefinition[]
  >;
  readonly slots: Set<string>;
  readonly output: CompiledRoute[];
}

function compileRedirect(
  parentPath: string,
  redirectTo: string,
): string {
  if (!redirectTo) {
    throw new Error('Redirect target must not be empty.');
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

    const path = joinRoutePath(parentPath, entry.path);
    const compiledBase = {
      path,
      layouts,
      slotId: provenance?.slotId,
      contributionId: provenance?.contributionId,
    } as const;

    context.output.push(
      entry.kind === 'redirect'
        ? {
            ...compiledBase,
            route: entry,
            redirectTo: compileRedirect(parentPath, entry.redirectTo),
          }
        : {
            ...compiledBase,
            route: entry,
          },
    );
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

  context.slots.add(id);

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

  compileEntries(
    definition.entries,
    parentPath,
    layouts,
    context,
    { slotId, contributionId: id },
  );
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

function assertNamedOutlet(
  route: CompiledRoute,
  primary: CompiledRoute,
  existing: readonly CompiledRenderableRoute[],
): asserts route is CompiledRenderableRoute {
  if (primary.route.kind === 'redirect') {
    throw new Error(
      `A redirect route cannot have named outlets. Path: "${primary.path}"`,
    );
  }

  if (route.route.kind === 'redirect') {
    throw new Error(
      `Named outlet routes cannot be redirects. Route path: "${primary.path}"`,
    );
  }

  const outletName = route.route.outlet;
  if (!outletName) {
    throw new Error(
      `Duplicate primary route for path "${route.path}" under the same layout chain.`,
    );
  }

  if (existing.some(outlet => outlet.route.outlet === outletName)) {
    throw new Error(
      `Duplicate outlet named "${outletName}" for route path "${primary.path}".`,
    );
  }

  if (route.route.name) {
    throw new Error(
      `Named outlet routes cannot have a "name" property. Route path: ` +
      `"${primary.path}", outlet: "${outletName}"`,
    );
  }
  if (route.route.paramsSchema || route.route.querySchema) {
    throw new Error(
      'Named outlet routes cannot define paramsSchema or querySchema.',
    );
  }
  if (route.route.viewTransition !== undefined) {
    throw new Error('Named outlet routes cannot define viewTransition.');
  }
  if (route.route.preload !== undefined) {
    throw new Error('Named outlet routes cannot define preload.');
  }
}

function groupRoutes(
  compiled: readonly CompiledRoute[],
): readonly CompiledRouteGroup[] {
  const groups = new Map<string, CompiledRouteGroup>();

  for (const route of compiled) {
    const key = `${route.path}#${route.layouts.map(layout => layout.path).join('/')}`;
    const group = groups.get(key);

    if (!group) {
      if (route.route.kind === 'route' && route.route.outlet) {
        throw new Error(
          `Named outlet route "${route.route.name ?? route.path}" with path ` +
          `"${route.path}" has no corresponding primary outlet route with the same path.`,
        );
      }

      groups.set(key, {
        primary: route,
        outlets: Object.freeze([]),
      });
      continue;
    }

    assertNamedOutlet(route, group.primary, group.outlets);
    groups.set(key, {
      primary: group.primary,
      outlets: Object.freeze([...group.outlets, route]),
    });
  }

  return Object.freeze(Array.from(groups.values()));
}

export function createRouteRegistry(
  entries: NavigationTree,
  contributions: readonly RouteContributionDefinition[] = [],
): RouteRegistry {
  const context: CompileContext = {
    contributionsBySlot: indexContributions(contributions),
    slots: new Set(),
    output: [],
  };

  compileEntries(entries, '/', Object.freeze([]), context);

  for (const contribution of contributions) {
    const id = normalizeRouteIdentity(contribution.id, 'Route contribution');
    const slotId = normalizeRouteIdentity(
      contribution.slotId,
      `Route contribution "${id}" slot`,
    );

    if (!context.slots.has(slotId)) {
      throw new Error(
        `Route contribution "${id}" targets unknown route slot "${slotId}".`,
      );
    }
  }

  const groups = groupRoutes(context.output);
  const namedRoutes = new Map<string, CompiledRoute>();
  const literalPaths = new Map<string, RouteDefinition>();
  const patterns = new Map<string, string>();

  for (const compiledRoute of groups.flatMap(group => [
    group.primary,
    ...group.outlets,
  ])) {
    const { route, path } = compiledRoute;
    validateCompiledRouteParams(route, path);

    const previous = literalPaths.get(path);
    if (
      previous &&
      previous.kind === 'route' &&
      route.kind === 'route' &&
      !previous.outlet &&
      !route.outlet
    ) {
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

    namedRoutes.set(route.name, compiledRoute);
  }

  return {
    namedRoutes,
    groups,
  };
}

function validateCompiledRouteParams(
  route: RouteDefinition,
  path: string,
): void {
  if (route.kind === 'redirect') {
    return;
  }

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
