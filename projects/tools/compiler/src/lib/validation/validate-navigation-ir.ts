import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';
import { diagnostic } from '../compiler/diagnostics.js';
import type { SemanticSchema, SemanticSchemaRecord } from '../ir/model.js';
import {
  NAVIGATION_IR_VERSION,
  NO_IR_REF,
  NavigationIrEntryKind,
  readIrString,
  type NavigationIr,
  type NavigationIrEntryRecord,
} from '../ir/navigation-ir.js';
import { NavigationDiagnosticCode as Code } from './diagnostic-codes.js';
import { decodeIrSource } from './ir-readers.js';
import type { NavigationValidationResult } from './validation-result.js';

export function validateNavigationIr(
  ir: NavigationIr,
): NavigationValidationResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];

  if (ir.version !== NAVIGATION_IR_VERSION) {
    diagnostics.push(diagnostic(
      Code.invalidIrVersion,
      'error',
      `Unsupported Navigation IR version "${ir.version}". Expected ${NAVIGATION_IR_VERSION}.`,
    ));
    return { diagnostics };
  }

  validateRange(ir.rootFirstEntry, ir.rootEntryCount, ir.entryRefs.length, 'root entry', diagnostics);

  for (let index = 0; index < ir.sources.length; index++) {
    const source = ir.sources[index]!;
    validateStringRef(ir, source.filePath, `source ${index} filePath`, diagnostics, false);
    validateStringRef(ir, source.exportName, `source ${index} exportName`, diagnostics, true);
    validateStringRef(ir, source.localName, `source ${index} localName`, diagnostics, true);
  }

  const slotSources = new Map<string, number>();
  for (let index = 0; index < ir.entries.length; index++) {
    const entry = ir.entries[index];
    if (!entry) {
      diagnostics.push(diagnostic(Code.invalidIrReference, 'error', `Navigation IR entry ${index} is missing.`));
      continue;
    }
    validateEntry(ir, entry, index, diagnostics);
    if (entry.kind === NavigationIrEntryKind.Slot) {
      const id = readRequiredString(ir, entry.id, `slot entry ${index} id`, diagnostics);
      if (!id) continue;
      const previous = slotSources.get(id);
      if (previous !== undefined) {
        diagnostics.push(diagnostic(
          Code.duplicateSlot,
          'error',
          `Duplicate route slot id "${id}".`,
          decodeIrSource(ir, entry.source),
        ));
      } else {
        slotSources.set(id, entry.source);
      }
    }
  }

  for (let index = 0; index < ir.entryRefs.length; index++) {
    const ref = ir.entryRefs[index];
    if (ref === undefined || ref < 0 || ref >= ir.entries.length) {
      diagnostics.push(diagnostic(
        Code.invalidIrReference,
        'error',
        `Navigation IR entryRefs[${index}] references missing entry ${String(ref)}.`,
      ));
    }
  }

  const ownerBySlot = new Map<string, number>();
  const routeSetIdentities = new Set<string>();
  for (let index = 0; index < ir.routeSets.length; index++) {
    const routeSet = ir.routeSets[index]!;
    validateRange(routeSet.firstEntry, routeSet.entryCount, ir.entryRefs.length, `route set ${index} entry`, diagnostics);
    validateSourceRef(ir, routeSet.source, `route set ${index} source`, diagnostics, false);
    const slotId = readRequiredString(ir, routeSet.slotId, `route set ${index} slotId`, diagnostics);
    if (!slotId) continue;
    const source = decodeIrSource(ir, routeSet.source);
    if (!slotSources.has(slotId)) {
      diagnostics.push(diagnostic(
        Code.unknownRouteSlot,
        'error',
        `routesFor() targets unknown route slot "${slotId}".`,
        source,
      ));
    }
    const previousOwner = ownerBySlot.get(slotId);
    if (previousOwner !== undefined) {
      diagnostics.push(diagnostic(
        Code.multipleRouteSetOwners,
        'error',
        `Route slot "${slotId}" has more than one routesFor() owner.`,
        source,
      ));
    } else {
      ownerBySlot.set(slotId, index);
    }
    if (!source?.exportName) {
      diagnostics.push(diagnostic(
        Code.missingRouteSetExport,
        'error',
        `routesFor() for slot "${slotId}" must be declared by an exported variable.`,
        source,
      ));
    }
    const identity = `${slotId}\u0000${source?.filePath ?? ''}\u0000${source?.exportName ?? source?.localName ?? ''}`;
    if (routeSetIdentities.has(identity)) {
      diagnostics.push(diagnostic(
        Code.duplicateRouteSetIdentity,
        'error',
        `Duplicate routesFor() source identity for route slot "${slotId}".`,
        source,
      ));
    }
    routeSetIdentities.add(identity);
  }


  validateOwnershipHierarchy(ir, diagnostics);

  return { diagnostics };
}

function validateOwnershipHierarchy(
  ir: NavigationIr,
  diagnostics: RouteCompilerDiagnostic[],
): void {
  const declaredBy = new Map<string, number>();

  collectSlots(ir.rootFirstEntry, ir.rootEntryCount, -1);
  for (let routeSetIndex = 0; routeSetIndex < ir.routeSets.length; routeSetIndex++) {
    const routeSet = ir.routeSets[routeSetIndex]!;
    collectSlots(routeSet.firstEntry, routeSet.entryCount, routeSetIndex);
  }

  const parentRouteSet = new Int32Array(ir.routeSets.length);
  parentRouteSet.fill(-1);
  for (let index = 0; index < ir.routeSets.length; index++) {
    const routeSet = ir.routeSets[index]!;
    const slotId = readIrString(ir, routeSet.slotId);
    if (!slotId) continue;
    const parent = declaredBy.get(slotId);
    if (parent !== undefined && parent >= 0) parentRouteSet[index] = parent;
  }

  const states = new Uint8Array(ir.routeSets.length);
  const stack: number[] = [];
  for (let index = 0; index < ir.routeSets.length; index++) visit(index);

  function collectSlots(first: number, count: number, owner: number): void {
    const end = Math.min(first + count, ir.entryRefs.length);
    for (let offset = first; offset < end; offset++) {
      const entryRef = ir.entryRefs[offset];
      if (entryRef === undefined) continue;
      const entry = ir.entries[entryRef];
      if (!entry) continue;
      if (entry.kind === NavigationIrEntryKind.Slot) {
        const id = readIrString(ir, entry.id);
        if (id && !declaredBy.has(id)) declaredBy.set(id, owner);
      } else if (entry.kind === NavigationIrEntryKind.Layout) {
        collectSlots(entry.firstChild, entry.childCount, owner);
      }
    }
  }

  function visit(index: number): void {
    if (states[index] === 2) return;
    if (states[index] === 1) {
      const cycleStart = stack.indexOf(index);
      const cycle = [...stack.slice(cycleStart), index]
        .map(routeSetIndex => {
          const routeSet = ir.routeSets[routeSetIndex]!;
          return readIrString(ir, routeSet.slotId) ?? `routeSet#${routeSetIndex}`;
        });
      diagnostics.push(diagnostic(
        Code.ownershipCycle,
        'error',
        `Route ownership cycle detected: ${cycle.map(id => `"${id}"`).join(' → ')}.`,
        decodeIrSource(ir, ir.routeSets[index]!.source),
      ));
      return;
    }

    states[index] = 1;
    stack.push(index);
    const parent = parentRouteSet[index];
    if (parent >= 0) visit(parent);
    stack.pop();
    states[index] = 2;
  }
}

function validateEntry(
  ir: NavigationIr,
  entry: NavigationIrEntryRecord,
  index: number,
  diagnostics: RouteCompilerDiagnostic[],
): void {
  validateSourceRef(ir, entry.source, `entry ${index} source`, diagnostics, false);
  if (entry.kind === NavigationIrEntryKind.Slot) {
    validateStringRef(ir, entry.id, `slot entry ${index} id`, diagnostics, false);
    return;
  }

  validateStringRef(ir, entry.path, `entry ${index} path`, diagnostics, false);
  validateStringRef(ir, entry.name, `entry ${index} name`, diagnostics, true);
  validateStringRef(ir, entry.outlet, `entry ${index} outlet`, diagnostics, true);
  validateSourceRef(ir, entry.branchSource, `entry ${index} branchSource`, diagnostics, true);
  validatePolicyRef(ir, entry.policy, `entry ${index} policy`, diagnostics);
  validateSchemaRef(ir, entry.paramsSchema, `entry ${index} paramsSchema`, diagnostics, true);
  validateSchemaRef(ir, entry.querySchema, `entry ${index} querySchema`, diagnostics, false);

  if (entry.kind === NavigationIrEntryKind.Layout) {
    validateRange(entry.firstChild, entry.childCount, ir.entryRefs.length, `layout entry ${index} child`, diagnostics);
    validateStringRef(ir, entry.pageType, `layout entry ${index} pageType`, diagnostics, true);
  } else if (entry.kind === NavigationIrEntryKind.Route) {
    validateStringRef(ir, entry.pageType, `route entry ${index} pageType`, diagnostics, true);
  } else {
    validateStringRef(ir, entry.redirectTo, `redirect entry ${index} redirectTo`, diagnostics, false);
  }
}

function validateSchemaRecord(
  schema: SemanticSchemaRecord,
  label: string,
  diagnostics: RouteCompilerDiagnostic[],
  pathParameters: boolean,
): void {
  for (const [name, value] of Object.entries(schema)) {
    if (pathParameters && value.kind === 'optional') {
      diagnostics.push(diagnostic(
        Code.optionalPathParameterSchema,
        'error',
        `Path parameter schema "${name}" cannot be optional.`,
      ));
    }
    validateSchema(value, `${label}.${name}`, diagnostics);
  }
}

function validateSchema(
  schema: SemanticSchema,
  label: string,
  diagnostics: RouteCompilerDiagnostic[],
): void {
  if (schema.kind === 'optional') {
    validateSchema(schema.inner, `${label}.inner`, diagnostics);
    return;
  }
  if (schema.kind !== 'number') return;
  if (schema.min !== undefined && schema.max !== undefined && schema.min > schema.max) {
    diagnostics.push(diagnostic(
      Code.invalidNumberSchemaRange,
      'error',
      `${label} has minimum ${schema.min} greater than maximum ${schema.max}.`,
    ));
  }
  if (schema.default !== undefined) {
    if (schema.min !== undefined && schema.default < schema.min) {
      diagnostics.push(diagnostic(
        Code.invalidNumberSchemaDefault,
        'error',
        `${label} default ${schema.default} is below minimum ${schema.min}.`,
      ));
    }
    if (schema.max !== undefined && schema.default > schema.max) {
      diagnostics.push(diagnostic(
        Code.invalidNumberSchemaDefault,
        'error',
        `${label} default ${schema.default} is above maximum ${schema.max}.`,
      ));
    }
  }
}

function validateStringRef(ir: NavigationIr, ref: number, label: string, diagnostics: RouteCompilerDiagnostic[], optional: boolean): void {
  if (ref === NO_IR_REF && optional) return;
  if (ref < 0 || ref >= ir.strings.length) {
    diagnostics.push(diagnostic(Code.invalidIrReference, 'error', `${label} references missing string ${ref}.`));
  }
}

function readRequiredString(ir: NavigationIr, ref: number, label: string, diagnostics: RouteCompilerDiagnostic[]): string | undefined {
  validateStringRef(ir, ref, label, diagnostics, false);
  return ref >= 0 && ref < ir.strings.length ? ir.strings[ref] : undefined;
}

function validateSourceRef(ir: NavigationIr, ref: number, label: string, diagnostics: RouteCompilerDiagnostic[], optional: boolean): void {
  if (ref === NO_IR_REF && optional) return;
  if (ref < 0 || ref >= ir.sources.length) diagnostics.push(diagnostic(Code.invalidIrReference, 'error', `${label} references missing source ${ref}.`));
}

function validatePolicyRef(ir: NavigationIr, ref: number, label: string, diagnostics: RouteCompilerDiagnostic[]): void {
  if (ref === NO_IR_REF) return;
  if (ref < 0 || ref >= ir.policies.length) diagnostics.push(diagnostic(Code.invalidIrReference, 'error', `${label} references missing policy ${ref}.`));
}

function validateSchemaRef(ir: NavigationIr, ref: number, label: string, diagnostics: RouteCompilerDiagnostic[], pathParameters: boolean): void {
  if (ref === NO_IR_REF) return;
  const schema = ir.schemas[ref];
  if (!schema) {
    diagnostics.push(diagnostic(Code.invalidIrReference, 'error', `${label} references missing schema ${ref}.`));
    return;
  }
  validateSchemaRecord(schema, label, diagnostics, pathParameters);
}

function validateRange(first: number, count: number, length: number, label: string, diagnostics: RouteCompilerDiagnostic[]): void {
  if (!Number.isInteger(first) || !Number.isInteger(count) || first < 0 || count < 0 || first + count > length) {
    diagnostics.push(diagnostic(Code.invalidIrRange, 'error', `Invalid ${label} range [${first}, ${first + count}) for collection length ${length}.`));
  }
}
