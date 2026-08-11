import ts from 'typescript';

import type {
  RouteProgramContext,
} from './program.js';

/**
 * AST-bearing compiler stage.
 *
 * No TypeScript AST node escapes beyond the resolution pipeline.
 */
export interface RouteDiscovery {
  readonly entry: string;
  readonly rootRoutes: ts.VariableDeclaration;
  readonly exportedCandidates:
    readonly ts.VariableDeclaration[];
}

export function discoverRouteSources(
  programContext: RouteProgramContext,
  routesExport = 'routes',
): RouteDiscovery {
  const rootRoutes =
    resolveExportedVariableDeclaration(
      programContext,
      routesExport,
    );

  if (!rootRoutes?.initializer) {
    throw new Error(
      `Could not resolve an exported "${routesExport}" declaration from ${programContext.entry}.`,
    );
  }

  const exportedCandidates =
    discoverExportedCandidates(
      programContext.program,
    );

  return {
    entry: programContext.entry,
    rootRoutes,
    exportedCandidates:
      Object.freeze(exportedCandidates),
  };
}

/**
 * Resolves an export from the compiler entry module through:
 *
 * - direct exports;
 * - named re-exports;
 * - export-star barrels;
 * - chained aliases.
 *
 * For example:
 *
 * public-api.ts
 *   export * from './lib';
 *
 * lib/index.ts
 *   export * from './routes';
 *
 * routes/index.ts
 *   export * from './routes.authored';
 *
 * routes.authored.ts
 *   export const routes = [...];
 */
function resolveExportedVariableDeclaration(
  context: RouteProgramContext,
  exportName: string,
): ts.VariableDeclaration | undefined {
  const moduleSymbol =
    context.checker.getSymbolAtLocation(
      context.sourceFile,
    );

  if (!moduleSymbol) {
    return undefined;
  }

  const exportedSymbol =
    context.checker
      .getExportsOfModule(moduleSymbol)
      .find(symbol =>
        symbol.getName() === exportName,
      );

  if (!exportedSymbol) {
    return undefined;
  }

  const targetSymbol =
    resolveAliasedSymbol(
      context.checker,
      exportedSymbol,
    );

  return findVariableDeclaration(
    targetSymbol,
  );
}

/**
 * Resolves aliases defensively.
 *
 * getAliasedSymbol() normally returns the final target, but the loop keeps
 * discovery correct if TypeScript exposes another alias in a barrel chain.
 */
function resolveAliasedSymbol(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
): ts.Symbol {
  let current = symbol;
  const visited = new Set<ts.Symbol>();

  while (
    current.flags & ts.SymbolFlags.Alias
  ) {
    if (visited.has(current)) {
      break;
    }

    visited.add(current);

    const resolved =
      checker.getAliasedSymbol(current);

    if (resolved === current) {
      break;
    }

    current = resolved;
  }

  return current;
}

function findVariableDeclaration(
  symbol: ts.Symbol,
): ts.VariableDeclaration | undefined {
  for (
    const declaration
    of symbol.declarations ?? []
  ) {
    if (
      ts.isVariableDeclaration(
        declaration,
      )
      && declaration.initializer
    ) {
      return declaration;
    }
  }

  const valueDeclaration =
    symbol.valueDeclaration;

  if (
    valueDeclaration
    && ts.isVariableDeclaration(
      valueDeclaration,
    )
    && valueDeclaration.initializer
  ) {
    return valueDeclaration;
  }

  return undefined;
}

function discoverExportedCandidates(
  program: ts.Program,
): ts.VariableDeclaration[] {
  const candidates:
    ts.VariableDeclaration[] = [];

  for (
    const sourceFile
    of program.getSourceFiles()
  ) {
    if (
      sourceFile.isDeclarationFile
      || isDependencyFile(
        sourceFile.fileName,
      )
    ) {
      continue;
    }

    for (
      const statement
      of sourceFile.statements
    ) {
      if (
        !ts.isVariableStatement(
          statement,
        )
        || !isExported(statement)
      ) {
        continue;
      }

      for (
        const declaration
        of statement
          .declarationList
          .declarations
      ) {
        if (
          ts.isIdentifier(
            declaration.name,
          )
          && declaration.initializer
        ) {
          candidates.push(
            declaration,
          );
        }
      }
    }
  }

  const unique = new Map<string, ts.VariableDeclaration>();

  for (const candidate of candidates) {
    const sourceFile = candidate.getSourceFile();
    const key = `${sourceFile.fileName}\u0000${candidate.pos}\u0000${candidate.end}`;
    unique.set(key, candidate);
  }

  return [...unique.values()].sort((left, right) => {
    const leftFile = left.getSourceFile().fileName;
    const rightFile = right.getSourceFile().fileName;
    return leftFile.localeCompare(rightFile) || left.pos - right.pos;
  });
}

function isExported(
  statement: ts.VariableStatement,
): boolean {
  return statement.modifiers?.some(
    modifier =>
      modifier.kind
      === ts.SyntaxKind.ExportKeyword,
  ) === true;
}

function isDependencyFile(
  fileName: string,
): boolean {
  return (
    fileName.includes(
      '/node_modules/',
    )
    || fileName.includes(
      '\\node_modules\\',
    )
  );
}