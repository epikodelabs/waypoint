import ts from 'typescript';
import type { RouteProgramContext } from './program.js';

/** AST-bearing compiler stage. No AST node escapes into the resolved model. */
export interface RouteDiscovery {
  readonly entry: string;
  readonly rootRoutes: ts.VariableDeclaration;
  readonly exportedCandidates: readonly ts.VariableDeclaration[];
}

export function discoverRouteSources(
  programContext: RouteProgramContext,
  routesExport = 'routes',
): RouteDiscovery {
  const rootRoutes = findRootRoutes(programContext.sourceFile, routesExport);
  if (!rootRoutes?.initializer) {
    throw new Error(
      `Could not find a "${routesExport}" declaration in ${programContext.entry}.`,
    );
  }

  const exportedCandidates: ts.VariableDeclaration[] = [];
  for (const sourceFile of programContext.program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || isDependencyFile(sourceFile.fileName)) {
      continue;
    }

    for (const statement of sourceFile.statements) {
      if (!ts.isVariableStatement(statement) || !isExported(statement)) {
        continue;
      }

      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          exportedCandidates.push(declaration);
        }
      }
    }
  }

  return {
    entry: programContext.entry,
    rootRoutes,
    exportedCandidates: Object.freeze(exportedCandidates),
  };
}

function findRootRoutes(
  sourceFile: ts.SourceFile,
  exportName: string,
): ts.VariableDeclaration | undefined {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === exportName) {
        return declaration;
      }
    }
  }
  return undefined;
}

function isExported(statement: ts.VariableStatement): boolean {
  return statement.modifiers?.some(
    modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
  ) === true;
}

function isDependencyFile(fileName: string): boolean {
  return fileName.includes('/node_modules/') || fileName.includes('\\node_modules\\');
}