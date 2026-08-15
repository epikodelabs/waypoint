import ts from 'typescript';

export interface NavigationExportCandidate {
  readonly name: string;
  readonly position: number;
}

/**
 * Finds exported variable declarations that look like authored navigation roots.
 *
 * The resolver intentionally does not require the identifier to be named
 * `routes`. If exactly one candidate exists, it becomes the root export.
 *
 * This is a syntactic discovery step; semantic/static evaluation still validates
 * that the selected export is a valid Waypoint navigation tree.
 */
export function discoverNavigationExports(
  sourceFile: ts.SourceFile,
): readonly NavigationExportCandidate[] {
  const candidates: NavigationExportCandidate[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (!hasExportModifier(statement)) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (!declaration.initializer) continue;

      if (looksLikeNavigationRoot(declaration.initializer)) {
        candidates.push(Object.freeze({
          name: declaration.name.text,
          position: declaration.name.getStart(sourceFile),
        }));
      }
    }
  }

  return Object.freeze(candidates);
}

export function selectNavigationExport(
  sourceFile: ts.SourceFile,
  explicitName?: string,
): string {
  if (explicitName) {
    const exported = exportedVariableNames(sourceFile);

    if (!exported.includes(explicitName)) {
      throw new Error(
        `Navigation export "${explicitName}" was not found in "${sourceFile.fileName}".`,
      );
    }

    return explicitName;
  }

  const candidates = discoverNavigationExports(sourceFile);

  if (candidates.length === 1) {
    return candidates[0]!.name;
  }

  if (candidates.length === 0) {
    throw new Error(
      `No exported Waypoint navigation root was discovered in "${sourceFile.fileName}". ` +
      `Export one navigation tree or configure waypoint.routesExport explicitly.`,
    );
  }

  throw new Error(
    `Multiple exported Waypoint navigation roots were discovered in "${sourceFile.fileName}": ` +
    `${candidates.map(candidate => candidate.name).join(', ')}. ` +
    `Configure waypoint.routesExport explicitly.`,
  );
}

function looksLikeNavigationRoot(expression: ts.Expression): boolean {
  expression = unwrap(expression);

  if (ts.isArrayLiteralExpression(expression)) {
    return true;
  }

  if (ts.isCallExpression(expression)) {
    const name = calledName(expression.expression);

    return name === 'routesFor'
      || name === 'routeSlot'
      || name === 'navigation'
      || name === 'defineRoutes';
  }

  return false;
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

function calledName(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text;
  }

  return undefined;
}

function hasExportModifier(node: ts.Node): boolean {
  return !!node.modifiers?.some(
    modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function exportedVariableNames(sourceFile: ts.SourceFile): readonly string[] {
  const names: string[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (!hasExportModifier(statement)) continue;

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        names.push(declaration.name.text);
      }
    }
  }

  return names;
}
