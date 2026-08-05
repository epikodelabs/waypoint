import type {
  SemanticEntry,
  SemanticNavigationProgram,
  SemanticPolicy,
  SemanticSchemaRecord,
  SourceReference,
} from './model.js';
import {
  NAVIGATION_IR_VERSION,
  NO_IR_REF,
  NavigationIrEntryKind,
  NavigationIrLoadMode,
  type IrEntryRef,
  type IrPolicyRef,
  type IrSchemaRef,
  type IrSourceRef,
  type IrStringRef,
  type NavigationIr,
  type NavigationIrEntryRecord,
  type NavigationIrRouteSetRecord,
  type NavigationIrSourceRecord,
} from './navigation-ir.js';

export function buildNavigationIr(
  program: SemanticNavigationProgram,
): NavigationIr {
  const strings: string[] = [];
  const stringRefs = new Map<string, number>();
  const sources: NavigationIrSourceRecord[] = [];
  const sourceRefs = new Map<string, number>();
  const policies: SemanticPolicy[] = [];
  const policyRefs = new Map<string, number>();
  const schemas: SemanticSchemaRecord[] = [];
  const schemaRefs = new Map<string, number>();
  const entries: NavigationIrEntryRecord[] = [];
  const entryRefs: IrEntryRef[] = [];
  const routeSets: NavigationIrRouteSetRecord[] = [];

  const internString = (value: string | undefined): IrStringRef => {
    if (value === undefined) return NO_IR_REF;
    const existing = stringRefs.get(value);
    if (existing !== undefined) return existing;
    const ref = strings.length;
    strings.push(value);
    stringRefs.set(value, ref);
    return ref;
  };

  const internSource = (source: SourceReference | undefined): IrSourceRef => {
    if (!source) return NO_IR_REF;
    const key = [
      source.filePath,
      source.exportName ?? '',
      source.localName ?? '',
      source.start ?? -1,
      source.length ?? -1,
    ].join('\u0000');
    const existing = sourceRefs.get(key);
    if (existing !== undefined) return existing;
    const ref = sources.length;
    sources.push({
      filePath: internString(source.filePath),
      exportName: internString(source.exportName),
      localName: internString(source.localName),
      start: source.start ?? 0,
      length: source.length ?? 0,
    });
    sourceRefs.set(key, ref);
    return ref;
  };

  const internPolicy = (policy: SemanticPolicy | undefined): IrPolicyRef => {
    if (!policy) return NO_IR_REF;
    const key = stableKey(policy);
    const existing = policyRefs.get(key);
    if (existing !== undefined) return existing;
    const ref = policies.length;
    policies.push(policy);
    policyRefs.set(key, ref);
    return ref;
  };

  const internSchema = (schema: SemanticSchemaRecord | undefined): IrSchemaRef => {
    if (!schema) return NO_IR_REF;
    const key = stableKey(schema);
    const existing = schemaRefs.get(key);
    if (existing !== undefined) return existing;
    const ref = schemas.length;
    schemas.push(schema);
    schemaRefs.set(key, ref);
    return ref;
  };

  const buildEntryList = (items: readonly SemanticEntry[]): readonly [number, number] => {
    const refs = new Array<IrEntryRef>(items.length);
    for (let index = 0; index < items.length; index++) {
      refs[index] = buildEntry(items[index]!);
    }
    const first = entryRefs.length;
    entryRefs.push(...refs);
    return [first, refs.length];
  };

  const buildEntry = (entry: SemanticEntry): IrEntryRef => {
    const ref = entries.length;

    if (entry.kind === 'slot') {
      entries.push({
        kind: NavigationIrEntryKind.Slot,
        id: internString(entry.id),
        source: internSource(entry.source),
      });
      return ref;
    }

    const common = {
      path: internString(entry.path),
      name: internString(entry.name),
      outlet: internString(entry.outlet),
      policy: internPolicy(entry.policy),
      paramsSchema: internSchema(entry.paramsSchema),
      querySchema: internSchema(entry.querySchema),
      source: internSource(entry.source),
      branchSource: internSource(entry.branchSource),
    } as const;

    if (entry.kind === 'layout') {
      // Reserve the entry before recursively building children so its numeric
      // identity is stable and independent of subtree size.
      entries.push(undefined as unknown as NavigationIrEntryRecord);
      const [firstChild, childCount] = buildEntryList(entry.entries);
      entries[ref] = {
        kind: NavigationIrEntryKind.Layout,
        ...common,
        pageType: internString(entry.pageType),
        loadMode: toLoadMode(entry.loadMode),
        firstChild,
        childCount,
      };
      return ref;
    }

    if (entry.kind === 'route') {
      entries.push({
        kind: NavigationIrEntryKind.Route,
        ...common,
        pageType: internString(entry.pageType),
        loadMode: toLoadMode(entry.loadMode),
      });
      return ref;
    }

    entries.push({
      kind: NavigationIrEntryKind.Redirect,
      ...common,
      redirectTo: internString(entry.redirectTo),
    });
    return ref;
  };

  const [rootFirstEntry, rootEntryCount] = buildEntryList(program.routes);

  for (const routeSet of program.routeSets) {
    const [firstEntry, entryCount] = buildEntryList(routeSet.entries);
    routeSets.push({
      id: internString(routeSet.id),
      slotId: internString(routeSet.slotId),
      source: internSource(routeSet.source),
      firstEntry,
      entryCount,
    });
  }

  return Object.freeze({
    version: NAVIGATION_IR_VERSION,
    entry: internString(program.entry),
    strings: Object.freeze(strings),
    sources: Object.freeze(sources),
    policies: Object.freeze(policies),
    schemas: Object.freeze(schemas),
    entries: Object.freeze(entries),
    entryRefs: Object.freeze(entryRefs),
    rootFirstEntry,
    rootEntryCount,
    routeSets: Object.freeze(routeSets),
  });
}

function toLoadMode(
  mode: 'eager' | 'lazy',
): NavigationIrLoadMode.Eager | NavigationIrLoadMode.Lazy {
  return mode === 'lazy'
    ? NavigationIrLoadMode.Lazy
    : NavigationIrLoadMode.Eager;
}

function stableKey(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableKey).join(',')}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, child]) => `${JSON.stringify(key)}:${stableKey(child)}`)
    .join(',')}}`;
}