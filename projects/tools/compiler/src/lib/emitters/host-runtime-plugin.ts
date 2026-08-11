import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import type { Plugin } from 'esbuild';

export const WAYPOINT_HOST_RUNTIME_SYMBOL_KEY =
  '@epikodelabs/waypoint/server-navigation-host-runtime/v1';

export type HostModuleExportIndex = ReadonlyMap<string, ReadonlySet<string>>;

/** Angular and Waypoint must use the host application's runtime identities. */
export function isDefaultHostModule(specifier: string): boolean {
  return specifier === '@epikodelabs/waypoint'
    || specifier.startsWith('@angular/');
}


export function createHostModulePredicate(
  additional: readonly string[] = [],
): (specifier: string) => boolean {
  const configured = new Set(additional.map(value => value.trim()).filter(Boolean));
  return specifier => isDefaultHostModule(specifier) || configured.has(specifier);
}

/**
 * Reads AOT JavaScript and records the static exports required from host-shared
 * modules. Angular AOT commonly emits namespace imports (i0.ɵɵ...), so the
 * scanner also records namespace property reads instead of requiring a full
 * package export catalog.
 */
export async function collectHostModuleExports(
  root: string,
  isHostModule: (specifier: string) => boolean = isDefaultHostModule,
): Promise<HostModuleExportIndex> {
  const result = new Map<string, Set<string>>();
  const files = await listJavaScriptFiles(root);

  for (const file of files) {
    const text = await fs.readFile(file, 'utf8');
    collectFromSource(text, file, result, isHostModule);
  }

  return new Map(
    [...result.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([specifier, names]) => [specifier, new Set([...names].sort())]),
  );
}

export function createHostRuntimePlugin(
  exportsByModule: HostModuleExportIndex,
): Plugin {
  return {
    name: 'waypoint-host-runtime',
    setup(build) {
      build.onResolve({ filter: /.*/ }, args => {
        if (!exportsByModule.has(args.path)) return undefined;
        return {
          path: args.path,
          namespace: 'waypoint-host-runtime',
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: 'waypoint-host-runtime' },
        args => ({
          contents: hostModuleSource(
            args.path,
            exportsByModule.get(args.path) ?? new Set(),
          ),
          loader: 'js',
        }),
      );
    },
  };
}

export function hostModuleSource(
  specifier: string,
  exportNames: ReadonlySet<string>,
): string {
  const lines = [
    `const key = Symbol.for(${JSON.stringify(WAYPOINT_HOST_RUNTIME_SYMBOL_KEY)});`,
    'const runtime = globalThis[key];',
    `const module = runtime?.modules?.get(${JSON.stringify(specifier)});`,
    `if (!module) throw new Error(${JSON.stringify(
      `Waypoint artifact requires host module "${specifier}". Register it with createServerNavigationResolver({ hostModules: ... }).`,
    )});`,
  ];

  for (const name of [...exportNames].sort()) {
    if (name === 'default') {
      lines.push('export default module["default"];');
      continue;
    }
    if (!isIdentifier(name)) {
      throw new Error(
        `Cannot bridge non-identifier export ${JSON.stringify(name)} from ${JSON.stringify(specifier)}.`,
      );
    }
    lines.push(`export const ${name} = module[${JSON.stringify(name)}];`);
  }

  return `${lines.join('\n')}\n`;
}

function collectFromSource(
  text: string,
  fileName: string,
  result: Map<string, Set<string>>,
  isHostModule: (specifier: string) => boolean,
): void {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const namespaceImports = new Map<string, { specifier: string; names: Set<string> }>();

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      if (!isHostModule(specifier)) continue;
      const names = requireSet(result, specifier);
      const clause = statement.importClause;
      if (!clause) continue;

      if (clause.name) names.add('default');
      const bindings = clause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const item of bindings.elements) {
          names.add((item.propertyName ?? item.name).text);
        }
      } else if (bindings && ts.isNamespaceImport(bindings)) {
        namespaceImports.set(bindings.name.text, { specifier, names });
      }
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const resolved = resolveRequiredHostModule(declaration.initializer, isHostModule);
        if (!resolved) continue;

        const names = requireSet(result, resolved.specifier);
        if (ts.isIdentifier(declaration.name)) {
          if (resolved.defaultOnly) names.add('default');
          else namespaceImports.set(declaration.name.text, { specifier: resolved.specifier, names });
          continue;
        }

        if (ts.isObjectBindingPattern(declaration.name)) {
          for (const element of declaration.name.elements) {
            if (element.dotDotDotToken) continue;
            const propertyName = element.propertyName ?? element.name;
            if (ts.isIdentifier(propertyName)) names.add(propertyName.text);
            else if (ts.isStringLiteral(propertyName)) names.add(propertyName.text);
          }
        }
      }
    }

    if (ts.isExportDeclaration(statement)
      && statement.moduleSpecifier
      && ts.isStringLiteral(statement.moduleSpecifier)
      && isHostModule(statement.moduleSpecifier.text)) {
      const specifier = statement.moduleSpecifier.text;
      const names = requireSet(result, specifier);
      if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
        throw new Error(
          `Host-shared export * is not supported in AOT output ${JSON.stringify(fileName)} for ${JSON.stringify(specifier)}.`,
        );
      }
      for (const item of statement.exportClause.elements) {
        names.add((item.propertyName ?? item.name).text);
      }
    }
  }

  if (namespaceImports.size === 0) return;

  const visit = (node: ts.Node): void => {
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
      namespaceImports.get(node.expression.text)?.names.add(node.name.text);
    } else if (
      ts.isElementAccessExpression(node)
      && ts.isIdentifier(node.expression)
      && node.argumentExpression
      && ts.isStringLiteral(node.argumentExpression)
    ) {
      namespaceImports.get(node.expression.text)?.names.add(node.argumentExpression.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

function resolveRequiredHostModule(
  initializer: ts.Expression | undefined,
  isHostModule: (specifier: string) => boolean,
): { specifier: string; defaultOnly: boolean } | undefined {
  if (!initializer) return undefined;

  const direct = requiredSpecifier(initializer);
  if (direct && isHostModule(direct)) {
    return { specifier: direct, defaultOnly: false };
  }

  if (
    ts.isCallExpression(initializer)
    && ts.isIdentifier(initializer.expression)
    && (initializer.expression.text === '__importStar' || initializer.expression.text === '__importDefault')
    && initializer.arguments.length === 1
  ) {
    const wrapped = requiredSpecifier(initializer.arguments[0]!);
    if (wrapped && isHostModule(wrapped)) {
      return {
        specifier: wrapped,
        defaultOnly: initializer.expression.text === '__importDefault',
      };
    }
  }

  return undefined;
}

function requiredSpecifier(initializer: ts.Expression): string | undefined {
  if (
    ts.isCallExpression(initializer)
    && ts.isIdentifier(initializer.expression)
    && initializer.expression.text === 'require'
    && initializer.arguments.length === 1
  ) {
    const [first] = initializer.arguments;
    if (first && ts.isStringLiteral(first)) return first.text;
  }
  return undefined;
}

function requireSet(
  result: Map<string, Set<string>>,
  specifier: string,
): Set<string> {
  const existing = result.get(specifier);
  if (existing) return existing;
  const created = new Set<string>();
  result.set(specifier, created);
  return created;
}

async function listJavaScriptFiles(root: string): Promise<readonly string[]> {
  const result: string[] = [];

  async function visit(directory: string): Promise<void> {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(target);
      else if (entry.isFile() && /\.(?:mjs|cjs|js)$/.test(entry.name)) result.push(target);
    }
  }

  await visit(root);
  return result.sort();
}

function isIdentifier(value: string): boolean {
  if (!value) return false;
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    value,
  );
  return scanner.scan() === ts.SyntaxKind.Identifier
    && scanner.getTokenText() === value
    && scanner.scan() === ts.SyntaxKind.EndOfFileToken;
}
