import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { build } from 'esbuild';
import ts from 'typescript';

export interface LoadedContribution {
  readonly definition: any;
  readonly sourceFile: string;
  readonly exportName: string;
}

export interface NavigationSnapshot {
  readonly rootRoutes: readonly any[];
  readonly contributions: readonly LoadedContribution[];
}

export async function loadNavigationSnapshot(
  projectRoot: string,
  entry: string,
  metadataRoot: string,
): Promise<NavigationSnapshot> {
  const routeFiles = await discoverRouteModules(
    path.join(projectRoot, 'src'),
    entry,
  );

  const generatedRoot = path.join(
    metadataRoot,
    'analysis',
  );
  const generatedSourceRoot = path.join(
    generatedRoot,
    'sources',
  );

  await fs.mkdir(
    generatedSourceRoot,
    { recursive: true },
  );

  const waypointStubFile = path.join(
    generatedSourceRoot,
    'waypoint-stub.ts',
  );

  await fs.writeFile(
    waypointStubFile,
    waypointStubSource(),
    'utf8',
  );

  const transformedModules = await Promise.all(
    [entry, ...routeFiles].map(
      (file, index) =>
        writeTransformedRouteModule(
          file,
          path.join(
            generatedSourceRoot,
            `module-${index}.ts`,
          ),
          waypointStubFile,
        ),
    ),
  );

  const [transformedEntry, ...transformedRoutes] =
    transformedModules;

  const sourceFile = path.join(
    generatedRoot,
    'navigation-snapshot.entry.ts',
  );

  const bundleFile = path.join(
    generatedRoot,
    'navigation-snapshot.mjs',
  );

  const imports = transformedRoutes.map(
    (file, index) =>
      `import * as routeModule${index} from ${JSON.stringify(asImportPath(file))};`,
  );

  const moduleDescriptors = routeFiles.map(
    (file, index) =>
      `{ sourceFile: ${JSON.stringify(file)}, exports: routeModule${index} }`,
  );

  await fs.writeFile(
    sourceFile,
    [
      `import { routes as rootRoutes } from ${JSON.stringify(asImportPath(transformedEntry!))};`,
      ...imports,
      '',
      `export default {`,
      `  rootRoutes,`,
      `  modules: [${moduleDescriptors.join(',')}],`,
      `};`,
      '',
    ].join('\n'),
    'utf8',
  );

  await build({
    entryPoints: [sourceFile],
    outfile: bundleFile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    sourcemap: false,
    logLevel: 'silent',
  });

  const loaded = await import(
    `${pathToFileURL(bundleFile).href}?t=${Date.now()}`,
  );

  const payload = loaded.default as {
    readonly rootRoutes?: unknown;
    readonly modules?: readonly {
      readonly sourceFile?: unknown;
      readonly exports?: unknown;
    }[];
  };

  if (!Array.isArray(payload.rootRoutes)) {
    throw new Error(
      `Waypoint entry "${entry}" did not export a NavigationTree named "routes".`,
    );
  }

  const contributions: LoadedContribution[] = [];

  for (const module of payload.modules ?? []) {
    if (
      typeof module.sourceFile !== 'string'
      || !module.exports
      || typeof module.exports !== 'object'
    ) {
      continue;
    }

    for (const [exportName, value] of Object.entries(
      module.exports as Record<string, unknown>,
    )) {
      if (!isContribution(value)) continue;

      contributions.push(Object.freeze({
        definition: value,
        sourceFile: module.sourceFile,
        exportName,
      }));
    }
  }

  return Object.freeze({
    rootRoutes: Object.freeze([...payload.rootRoutes]),
    contributions: Object.freeze(contributions),
  });
}

async function discoverRouteModules(
  sourceRoot: string,
  entry: string,
): Promise<readonly string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    let entries: import('node:fs').Dirent[];

    try {
      entries = await fs.readdir(
        directory,
        { withFileTypes: true },
      );
    } catch {
      return;
    }

    for (const item of entries) {
      const absolute = path.join(
        directory,
        item.name,
      );

      if (item.isDirectory()) {
        await visit(absolute);
        continue;
      }

      if (
        !item.isFile()
        || !item.name.endsWith('.routes.ts')
        || path.resolve(absolute) === path.resolve(entry)
        || item.name.endsWith('.spec.ts')
      ) {
        continue;
      }

      files.push(path.resolve(absolute));
    }
  }

  await visit(sourceRoot);

  return Object.freeze(
    files.sort(),
  );
}

async function writeTransformedRouteModule(
  sourcePath: string,
  outputPath: string,
  waypointStubFile: string,
): Promise<string> {
  const sourceText = await fs.readFile(
    sourcePath,
    'utf8',
  );

  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  let cursor = 0;
  let transformed = '';

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    transformed += sourceText.slice(
      cursor,
      statement.getFullStart(),
    );
    transformed += transformImportDeclaration(
      statement,
      outputPath,
      waypointStubFile,
    );
    cursor = statement.getEnd();
  }

  transformed += sourceText.slice(cursor);
  transformed = transformed.replace(
    /\bimport\s*\(/g,
    '__waypointDynamicImport(',
  );

  const prelude = [
    `const __waypointStubValue = new Proxy(function () {}, {`,
    `  get() { return __waypointStubValue; },`,
    `  apply() { return undefined; },`,
    `  construct() { return {}; },`,
    `});`,
    `const __waypointDynamicImport = async () => ({});`,
    '',
  ].join('\n');

  await fs.writeFile(
    outputPath,
    `${prelude}${transformed}`,
    'utf8',
  );

  return outputPath;
}

function transformImportDeclaration(
  statement: ts.ImportDeclaration,
  outputPath: string,
  waypointStubFile: string,
): string {
  const specifier = (
    statement.moduleSpecifier as ts.StringLiteral
  ).text;
  const clause = statement.importClause;

  if (!clause || clause.isTypeOnly) {
    return '';
  }

  if (specifier === '@epikodelabs/waypoint') {
    const relative = toRelativeImport(
      outputPath,
      waypointStubFile,
    );

    return rewriteImportSpecifier(
      clause,
      relative,
    );
  }

  return stubImportBindings(clause);
}

function rewriteImportSpecifier(
  clause: ts.ImportClause,
  specifier: string,
): string {
  const parts: string[] = [];

  if (clause.name) {
    parts.push(clause.name.text);
  }

  if (
    clause.namedBindings
    && ts.isNamespaceImport(
      clause.namedBindings
    )
  ) {
    parts.push(
      `* as ${clause.namedBindings.name.text}`,
    );
  } else if (
    clause.namedBindings
    && ts.isNamedImports(
      clause.namedBindings
    )
  ) {
    parts.push(
      `{ ${clause.namedBindings.elements
        .map(element =>
          element.propertyName
            ? `${element.propertyName.text} as ${element.name.text}`
            : element.name.text,
        )
        .join(', ')} }`,
    );
  }

  if (parts.length === 0) {
    return '';
  }

  return `import ${parts.join(', ')} from ${JSON.stringify(asImportPath(specifier))};`;
}

function stubImportBindings(
  clause: ts.ImportClause,
): string {
  const statements: string[] = [];

  if (clause.name) {
    statements.push(
      `const ${clause.name.text} = __waypointStubValue;`,
    );
  }

  if (
    clause.namedBindings
    && ts.isNamespaceImport(
      clause.namedBindings
    )
  ) {
    statements.push(
      `const ${clause.namedBindings.name.text} = __waypointStubValue;`,
    );
  } else if (
    clause.namedBindings
    && ts.isNamedImports(
      clause.namedBindings
    )
  ) {
    for (const element of clause.namedBindings.elements) {
      statements.push(
        `const ${element.name.text} = __waypointStubValue;`,
      );
    }
  }

  return statements.join('\n');
}

function toRelativeImport(
  fromFile: string,
  toFile: string,
): string {
  const relative = path.relative(
    path.dirname(fromFile),
    toFile,
  );

  return relative.startsWith('.')
    ? relative
    : `./${relative}`;
}

function waypointStubSource(): string {
  return [
    `export function routeSlot(id) {`,
    `  return { kind: 'route-slot', id };`,
    `}`,
    ``,
    `export function routesFor(slotId, id, entries) {`,
    `  return { kind: 'route-contribution', slotId, id, entries };`,
    `}`,
    ``,
    `export function route(path, view, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function redirect(path, redirectTo, options = {}) {`,
    `  return { kind: 'redirect', path, redirectTo, ...options };`,
    `}`,
    ``,
    `export function layout(path, view, entries, options = {}) {`,
    `  return { kind: 'layout', path, entries, ...options };`,
    `}`,
    ``,
    `export function frame(component, options = {}) {`,
    `  return { component, ...options };`,
    `}`,
    ``,
    `export const s = Object.freeze({`,
    `  number(options = {}) { return { kind: 'number', ...options }; },`,
    `  string(value) { return { kind: 'string', value }; },`,
    `  array() { return { kind: 'array' }; },`,
    `  optional(value) { return { kind: 'optional', value }; },`,
    `  boolean() { return { kind: 'boolean' }; },`,
    `});`,
    '',
  ].join('\n');
}

function isContribution(
  value: unknown,
): value is {
  readonly kind: 'route-contribution';
  readonly slotId: string;
  readonly id: string;
  readonly entries: readonly unknown[];
} {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as any;

  return candidate.kind === 'route-contribution'
    && typeof candidate.slotId === 'string'
    && candidate.slotId.trim().length > 0
    && typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && Array.isArray(candidate.entries);
}

function asImportPath(
  file: string,
): string {
  return file.split(path.sep).join('/');
}