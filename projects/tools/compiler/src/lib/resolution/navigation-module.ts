import ts from 'typescript';

export interface NavigationModuleExport {
  readonly file: string;
  readonly exportName: string;
  readonly kind: 'tree' | 'contribution';
}

export interface NavigationModuleProgram {
  readonly entry: string;
  readonly trees: readonly NavigationModuleExport[];
  readonly contributions: readonly NavigationModuleExport[];
}

/**
 * Treats the authored entry as a navigation module rather than requiring one
 * privileged root export.
 *
 * The collector follows re-exports and classifies exported values by their
 * static authored shape. Static evaluation/semantic resolution remains the
 * authoritative validation step afterwards.
 */
export function collectNavigationModuleProgram(
  program: ts.Program,
  entryFile: string,
): NavigationModuleProgram {
  const source = program.getSourceFile(entryFile);
  if (!source) {
    throw new Error(`Navigation entry "${entryFile}" is not part of the TypeScript program.`);
  }

  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(source);

  if (!moduleSymbol) {
    throw new Error(`Cannot resolve module exports for "${entryFile}".`);
  }

  const trees: NavigationModuleExport[] = [];
  const contributions: NavigationModuleExport[] = [];

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const target = resolveAlias(checker, exported);
    const declaration = target.valueDeclaration ?? target.declarations?.[0];

    if (!declaration) continue;

    const classified = classifyExport(declaration);
    if (!classified) continue;

    const item = Object.freeze({
      file: declaration.getSourceFile().fileName,
      exportName: exported.name,
      kind: classified,
    });

    if (classified === 'tree') trees.push(item);
    else contributions.push(item);
  }

  return Object.freeze({
    entry: entryFile,
    trees: Object.freeze(sortExports(trees)),
    contributions: Object.freeze(sortExports(contributions)),
  });
}

function resolveAlias(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
}

function classifyExport(
  declaration: ts.Declaration,
): 'tree' | 'contribution' | undefined {
  if (!ts.isVariableDeclaration(declaration)) return undefined;
  if (!declaration.initializer) return undefined;

  const expression = unwrap(declaration.initializer);

  if (ts.isArrayLiteralExpression(expression)) {
    return 'tree';
  }

  if (ts.isCallExpression(expression)) {
    const name = calledName(expression.expression);

    if (name === 'routesFor') return 'contribution';

    if (
      name === 'navigation'
      || name === 'defineRoutes'
    ) {
      return 'tree';
    }
  }

  return undefined;
}

function unwrap(expression: ts.Expression): ts.Expression {
  while (
    ts.isAsExpression(expression)
    || ts.isSatisfiesExpression(expression)
    || ts.isParenthesizedExpression(expression)
  ) {
    expression = expression.expression;
  }

  return expression;
}

function calledName(
  expression: ts.Expression,
): string | undefined {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text;
  }

  return undefined;
}

function sortExports<T extends NavigationModuleExport>(
  values: readonly T[],
): T[] {
  return [...values].sort((left, right) =>
    left.file.localeCompare(right.file)
    || left.exportName.localeCompare(right.exportName),
  );
}
