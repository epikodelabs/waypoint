import ts from 'typescript';
import type { RouteProgramContext } from './program.js';
import type {
  ParsedRouteEntry,
  ParsedRouteEntryLayout,
  ParsedRouteEntryRedirect,
  ParsedRouteEntryRoute,
  ParsedRouteGraph,
  ParsedRoutePolicy,
  ParsedSchema,
  ParsedSchemaRecord,
  SourceReference,
  RouteCompilerDiagnostic,
} from './types.js';

export interface AnalyzeRouteGraphResult {
  readonly graph: ParsedRouteGraph;
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}

interface AnalyzerContext {
  readonly programContext: RouteProgramContext;
  readonly diagnostics: RouteCompilerDiagnostic[];
  readonly bindingCache: WeakMap<
    ts.SourceFile,
    ReadonlyMap<string, ts.VariableDeclaration>
  >;
}

type ParsedRouteOptions = Pick<
  ParsedRouteEntryRoute,
  'name' | 'outlet' | 'policy' | 'paramsSchema' | 'querySchema'
>;

export function analyzeRouteGraph(
  programContext: RouteProgramContext,
): AnalyzeRouteGraphResult {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const context: AnalyzerContext = {
    programContext,
    diagnostics,
    bindingCache:
      new WeakMap(),
  };
  const routesDeclaration =
    collectBindings(
      context,
      programContext.sourceFile,
    ).get('routes');

  if (
    !routesDeclaration?.initializer
  ) {
    throw new Error(
      `Could not find a "routes" declaration in ${programContext.entry}.`,
    );
  }

  return {
    graph: {
      entry:
        programContext.entry,
      routes: parseRouteArray(
        context,
        routesDeclaration.initializer,
        undefined,
        new Set<string>(),
      ),
    },
    diagnostics,
  };
}

function collectBindings(
  context: AnalyzerContext,
  sourceFile: ts.SourceFile,
): ReadonlyMap<
  string,
  ts.VariableDeclaration
> {
  const existing =
    context.bindingCache.get(
      sourceFile,
    );

  if (existing) {
    return existing;
  }

  const bindings =
    new Map<
      string,
      ts.VariableDeclaration
    >();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) {
        continue;
      }

      bindings.set(
        declaration.name.text,
        declaration,
      );
    }
  }

  context.bindingCache.set(
    sourceFile,
    bindings,
  );
  return bindings;
}

function parseRouteArray(
  context: AnalyzerContext,
  expression: ts.Expression,
  branchSource:
    | SourceReference
    | undefined,
  resolutionStack: Set<string>,
): readonly ParsedRouteEntry[] {
  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (!ts.isArrayLiteralExpression(current)) {
    throw new Error(
      `Expected a route array but found "${current.getText()}".`,
    );
  }

  const output: ParsedRouteEntry[] = [];

  for (const element of current.elements) {
    if (ts.isSpreadElement(element)) {
      const nestedBranchSource =
        readSourceReference(
          context,
          element.expression,
        )
        ?? branchSource;

      output.push(
        ...parseRouteArray(
          context,
          element.expression,
          nestedBranchSource,
          resolutionStack,
        ),
      );
      continue;
    }

    output.push(
      parseRouteEntry(
        context,
        element,
        branchSource,
        resolutionStack,
      ),
    );
  }

  return Object.freeze(output);
}

function parseRouteEntry(
  context: AnalyzerContext,
  expression: ts.Expression,
  branchSource:
    | SourceReference
    | undefined,
  resolutionStack: Set<string>,
): ParsedRouteEntry {
  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );
  const source =
    readSourceReference(
      context,
      expression,
    ) ?? {
      filePath:
        current
          .getSourceFile()
          .fileName,
    };

  if (!ts.isCallExpression(current)) {
    throw new Error(
      `Expected a route helper call but found "${current.getText()}".`,
    );
  }

  switch (
    readRouteHelperKind(
      context,
      current.expression,
      resolutionStack,
    )
  ) {
    case 'route':
      return parsePageRoute(
        context,
        current,
        'eager',
        source,
        branchSource,
        resolutionStack,
      );
    case 'lazyRoute':
      return parsePageRoute(
        context,
        current,
        'lazy',
        source,
        branchSource,
        resolutionStack,
      );
    case 'layout':
      return parseLayoutRoute(
        context,
        current,
        'eager',
        source,
        branchSource,
        resolutionStack,
      );
    case 'lazyLayout':
      return parseLayoutRoute(
        context,
        current,
        'lazy',
        source,
        branchSource,
        resolutionStack,
      );
    case 'redirectRoute':
      return parseRedirectRoute(
        context,
        current,
        source,
        branchSource,
        resolutionStack,
      );
    default:
      throw new Error(
        `Unsupported route helper "${current.expression.getText()}".`,
      );
  }
}

function parsePageRoute(
  context: AnalyzerContext,
  call: ts.CallExpression,
  loadMode: 'eager' | 'lazy',
  source: SourceReference,
  branchSource:
    | SourceReference
    | undefined,
  resolutionStack: Set<string>,
): ParsedRouteEntryRoute {
  return {
    kind: 'route',
    path: readStringLiteral(
      call.arguments[0],
    ),
    pageType: readPageType(
      context,
      call.arguments[1],
      resolutionStack,
    ),
    loadMode,
    sourceText:
      call.getText(),
    source,
    branchSource,
    ...parseRouteOptions(
      context,
      call.arguments[2],
      resolutionStack,
    ),
  };
}

function parseLayoutRoute(
  context: AnalyzerContext,
  call: ts.CallExpression,
  loadMode: 'eager' | 'lazy',
  source: SourceReference,
  branchSource:
    | SourceReference
    | undefined,
  resolutionStack: Set<string>,
): ParsedRouteEntryLayout {
  return {
    kind: 'layout',
    path: readStringLiteral(
      call.arguments[0],
    ),
    pageType: readPageType(
      context,
      call.arguments[1],
      resolutionStack,
    ),
    loadMode,
    entries: parseRouteArray(
      context,
      call.arguments[2],
      undefined,
      resolutionStack,
    ),
    sourceText:
      call.getText(),
    source,
    branchSource,
    ...parseRouteOptions(
      context,
      call.arguments[3],
      resolutionStack,
    ),
  };
}

function parseRedirectRoute(
  context: AnalyzerContext,
  call: ts.CallExpression,
  source: SourceReference,
  branchSource:
    | SourceReference
    | undefined,
  resolutionStack: Set<string>,
): ParsedRouteEntryRedirect {
  return {
    kind: 'redirect',
    path: readStringLiteral(
      call.arguments[0],
    ),
    redirectTo:
      readStringLiteral(
        call.arguments[1],
      ),
    sourceText:
      call.getText(),
    source,
    branchSource,
    ...parseRouteOptions(
      context,
      call.arguments[2],
      resolutionStack,
    ),
  };
}

function parseRouteOptions(
  context: AnalyzerContext,
  expression:
    | ts.Expression
    | undefined,
  resolutionStack: Set<string>,
): ParsedRouteOptions {
  if (!expression) {
    return {};
  }

  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (!ts.isObjectLiteralExpression(current)) {
    context.diagnostics.push({
      level: 'warning',
      message:
        `Skipping non-literal route options: ${current.getText()}`,
    });
    return {};
  }

  let name: string | undefined;
  let outlet: string | undefined;
  let policy:
    | ParsedRoutePolicy
    | undefined;
  let paramsSchema:
    | ParsedSchemaRecord
    | undefined;
  let querySchema:
    | ParsedSchemaRecord
    | undefined;

  for (const property of current.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    switch (
      readObjectPropertyName(
        property.name,
      )
    ) {
      case 'name':
        name =
          readStringLiteral(
            property.initializer,
          );
        break;
      case 'outlet':
        outlet =
          readStringLiteral(
            property.initializer,
          );
        break;
      case 'policy':
        policy = parsePolicy(
          context,
          property.initializer,
          resolutionStack,
        );
        break;
      case 'paramsSchema':
        paramsSchema =
          parseSchemaRecord(
            context,
            property.initializer,
            resolutionStack,
          );
        break;
      case 'querySchema':
        querySchema =
          parseSchemaRecord(
            context,
            property.initializer,
            resolutionStack,
          );
        break;
      default:
        break;
    }
  }

  return {
    name,
    outlet,
    policy,
    paramsSchema,
    querySchema,
  };
}

function parsePolicy(
  context: AnalyzerContext,
  expression: ts.Expression,
  resolutionStack: Set<string>,
): ParsedRoutePolicy | undefined {
  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (!ts.isObjectLiteralExpression(current)) {
    context.diagnostics.push({
      level: 'warning',
      message:
        `Skipping non-literal policy: ${current.getText()}`,
    });
    return undefined;
  }

  let allowAnonymous:
    | boolean
    | undefined;
  let roles:
    | readonly string[]
    | undefined;
  let permissions:
    | readonly string[]
    | undefined;

  for (const property of current.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    switch (
      readObjectPropertyName(
        property.name,
      )
    ) {
      case 'allowAnonymous':
        allowAnonymous =
          readBooleanLiteral(
            property.initializer,
          );
        break;
      case 'roles':
        roles =
          readStringArrayLiteral(
            property.initializer,
          );
        break;
      case 'permissions':
        permissions =
          readStringArrayLiteral(
            property.initializer,
          );
        break;
      default:
        break;
    }
  }

  return {
    allowAnonymous,
    roles,
    permissions,
  };
}

function parseSchemaRecord(
  context: AnalyzerContext,
  expression: ts.Expression,
  resolutionStack: Set<string>,
): ParsedSchemaRecord | undefined {
  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (!ts.isObjectLiteralExpression(current)) {
    context.diagnostics.push({
      level: 'warning',
      message:
        `Skipping non-literal schema: ${current.getText()}`,
    });
    return undefined;
  }

  const record:
    Record<
      string,
      ParsedSchema
    > = {};

  for (const property of current.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    record[
      readObjectPropertyName(
        property.name,
      )
    ] = parseSchema(
      context,
      property.initializer,
      resolutionStack,
    );
  }

  return Object.freeze(record);
}

function parseSchema(
  context: AnalyzerContext,
  expression: ts.Expression,
  resolutionStack: Set<string>,
): ParsedSchema {
  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (!ts.isCallExpression(current)) {
    throw new Error(
      `Unsupported schema expression "${current.getText()}".`,
    );
  }

  switch (
    readSchemaHelperKind(
      context,
      current.expression,
      resolutionStack,
    )
  ) {
    case 'string':
      return {
        kind: 'string',
        default:
          readOptionalStringLiteral(
            current.arguments[0],
          ),
      };
    case 'number':
      return {
        kind: 'number',
        ...readNumberOptions(
          current.arguments[0],
        ),
      };
    case 'boolean':
      return {
        kind: 'boolean',
        default:
          readOptionalBooleanLiteral(
            current.arguments[0],
          ),
      };
    case 'array':
      return {
        kind: 'array',
        default:
          readOptionalStringArrayLiteral(
            current.arguments[0],
          ),
      };
    case 'date':
      return {
        kind: 'date',
        default:
          current.arguments[0]
            ?.getText(),
      };
    case 'optional':
      return {
        kind: 'optional',
        inner: parseSchema(
          context,
          current.arguments[0],
          resolutionStack,
        ),
      };
    default:
      throw new Error(
        `Unsupported schema helper "${current.expression.getText()}".`,
      );
  }
}

function readNumberOptions(
  expression:
    | ts.Expression
    | undefined,
): {
  readonly default?: number;
  readonly min?: number;
  readonly max?: number;
} {
  if (!expression) {
    return {};
  }

  if (!ts.isObjectLiteralExpression(expression)) {
    throw new Error(
      `Expected a number schema options object but found "${expression.getText()}".`,
    );
  }

  let defaultValue:
    | number
    | undefined;
  let min:
    | number
    | undefined;
  let max:
    | number
    | undefined;

  for (const property of expression.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const value =
      readNumberLiteral(
        property.initializer,
      );

    switch (
      readObjectPropertyName(
        property.name,
      )
    ) {
      case 'default':
        defaultValue = value;
        break;
      case 'min':
        min = value;
        break;
      case 'max':
        max = value;
        break;
      default:
        break;
    }
  }

  return {
    default: defaultValue,
    min,
    max,
  };
}

function readPageType(
  context: AnalyzerContext,
  expression:
    | ts.Expression
    | undefined,
  resolutionStack: Set<string>,
): string | undefined {
  if (!expression) {
    return undefined;
  }

  const current =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (ts.isIdentifier(current)) {
    return current.text;
  }

  if (
    ts.isPropertyAccessExpression(
      current,
    )
  ) {
    return current.name.text;
  }

  if (ts.isCallExpression(current)) {
    const helperKind =
      readRouteHelperKind(
        context,
        current.expression,
        resolutionStack,
      );

    if (
      helperKind === 'frame'
      || helperKind === 'lazyFrame'
    ) {
      return readPageType(
        context,
        current.arguments[0],
        resolutionStack,
      );
    }
  }

  if (
    ts.isArrowFunction(current)
    || ts.isFunctionExpression(current)
  ) {
    return readLazyFactoryPageType(
      readReturnedExpression(
        current.body,
      ),
    );
  }

  context.diagnostics.push({
    level: 'warning',
    message:
      `Could not derive a page type from "${current.getText()}".`,
  });
  return undefined;
}

function readLazyFactoryPageType(
  expression:
    | ts.Expression
    | undefined,
): string | undefined {
  if (
    !expression
    || !ts.isCallExpression(expression)
  ) {
    return undefined;
  }

  if (
    !ts.isPropertyAccessExpression(
      expression.expression,
    )
    || expression.expression.name.text
      !== 'then'
  ) {
    return undefined;
  }

  const callback =
    expression.arguments[0];

  if (
    !callback
    || !(
      ts.isArrowFunction(callback)
      || ts.isFunctionExpression(
        callback,
      )
    )
  ) {
    return undefined;
  }

  const callbackResult =
    readReturnedExpression(
      callback.body,
    );

  if (
    callbackResult
    && ts.isPropertyAccessExpression(
      callbackResult,
    )
  ) {
    return callbackResult.name.text;
  }

  if (
    callbackResult
    && ts.isIdentifier(
      callbackResult,
    )
  ) {
    return callbackResult.text;
  }

  return undefined;
}

function readReturnedExpression(
  body: ts.ConciseBody,
): ts.Expression | undefined {
  if (!ts.isBlock(body)) {
    return body;
  }

  for (const statement of body.statements) {
    if (
      ts.isReturnStatement(statement)
      && statement.expression
    ) {
      return statement.expression;
    }
  }

  return undefined;
}

function readRouteHelperKind(
  context: AnalyzerContext,
  expression: ts.LeftHandSideExpression,
  resolutionStack: Set<string>,
): string {
  const resolved =
    resolveLeftHandSideExpression(
      context,
      expression,
      resolutionStack,
    );

  if (ts.isIdentifier(resolved)) {
    const importedName =
      readWaypointImportedName(
        context,
        resolved,
      );

    if (importedName) {
      return importedName;
    }

    return resolved.text;
  }

  throw new Error(
    `Unsupported helper expression "${resolved.getText()}".`,
  );
}

function readSchemaHelperKind(
  context: AnalyzerContext,
  expression: ts.LeftHandSideExpression,
  resolutionStack: Set<string>,
): string {
  const resolved =
    resolveLeftHandSideExpression(
      context,
      expression,
      resolutionStack,
    );

  if (
    ts.isPropertyAccessExpression(
      resolved,
    )
  ) {
    return resolved.name.text;
  }

  if (ts.isIdentifier(resolved)) {
    return resolved.text;
  }

  throw new Error(
    `Unsupported schema helper expression "${resolved.getText()}".`,
  );
}

function resolveLeftHandSideExpression(
  context: AnalyzerContext,
  expression: ts.LeftHandSideExpression,
  resolutionStack: Set<string>,
): ts.LeftHandSideExpression {
  if (
    !ts.isIdentifier(expression)
  ) {
    return expression;
  }

  const resolved =
    resolveExpression(
      context,
      expression,
      resolutionStack,
    );

  if (
    !ts.isLeftHandSideExpression(
      resolved,
    )
  ) {
    throw new Error(
      `Expected a callable expression but found "${resolved.getText()}".`,
    );
  }

  return resolved;
}

function readWaypointImportedName(
  context: AnalyzerContext,
  identifier: ts.Identifier,
): string | undefined {
  const symbol =
    context.programContext.checker.getSymbolAtLocation(
      identifier,
    );

  if (!symbol) {
    return undefined;
  }

  for (const declaration of symbol.declarations ?? []) {
    const imported =
      readImportSpecifierName(
        declaration,
      );

    if (imported?.moduleName === '@epikodelabs/waypoint') {
      return imported.importedName;
    }
  }

  if (
    symbol.flags
    & ts.SymbolFlags.Alias
  ) {
    for (const declaration of symbol.declarations ?? []) {
      const imported =
        readImportSpecifierName(
          declaration,
        );

      if (imported?.moduleName === '@epikodelabs/waypoint') {
        return imported.importedName;
      }
    }
  }

  return undefined;
}

function readImportSpecifierName(
  declaration: ts.Declaration,
): {
  readonly moduleName: string;
  readonly importedName: string;
} | undefined {
  if (!ts.isImportSpecifier(declaration)) {
    return undefined;
  }

  const clause =
    declaration.parent
      .parent
      .parent;

  if (
    !ts.isStringLiteral(
      clause.moduleSpecifier,
    )
  ) {
    return undefined;
  }

  return {
    moduleName:
      clause.moduleSpecifier.text,
    importedName:
      declaration.propertyName?.text
      ?? declaration.name.text,
  };
}

function readSourceReference(
  context: AnalyzerContext,
  expression: ts.Expression,
): SourceReference | undefined {
  if (!ts.isIdentifier(expression)) {
    return undefined;
  }

  const importedReference =
    readImportedValueReference(
      context,
      expression,
    );

  if (importedReference) {
    return importedReference;
  }

  const declaration =
    resolveIdentifierDeclaration(
      context,
      expression,
    );

  if (!declaration) {
    return undefined;
  }

  const localName =
    ts.isIdentifier(declaration.name)
      ? declaration.name.text
      : undefined;

  return {
    filePath:
      declaration
        .getSourceFile()
        .fileName,
    exportName:
      isExportedVariableDeclaration(
        declaration,
      )
        ? localName
        : undefined,
    localName,
  };
}

function readImportedValueReference(
  context: AnalyzerContext,
  identifier: ts.Identifier,
): SourceReference | undefined {
  const symbol =
    context.programContext.checker.getSymbolAtLocation(
      identifier,
    );

  if (
    !symbol
    || !(
      symbol.flags
      & ts.SymbolFlags.Alias
    )
  ) {
    return undefined;
  }

  const importDeclaration =
    symbol.declarations?.find(
      ts.isImportSpecifier,
    );

  if (!importDeclaration) {
    return undefined;
  }

  const target =
    context.programContext.checker.getAliasedSymbol(
      symbol,
    );
  const valueDeclaration =
    target.valueDeclaration;

  if (
    !valueDeclaration
    || !ts.isVariableDeclaration(
      valueDeclaration,
    )
    || !ts.isIdentifier(
      valueDeclaration.name,
    )
  ) {
    return undefined;
  }

  return {
    filePath:
      valueDeclaration
        .getSourceFile()
        .fileName,
    exportName:
      importDeclaration.propertyName?.text
      ?? importDeclaration.name.text,
    localName:
      valueDeclaration.name.text,
  };
}

function resolveIdentifierDeclaration(
  context: AnalyzerContext,
  identifier: ts.Identifier,
): ts.VariableDeclaration | undefined {
  const local =
    collectBindings(
      context,
      identifier.getSourceFile(),
    ).get(identifier.text);

  if (local) {
    return local;
  }

  const symbol =
    context.programContext.checker.getSymbolAtLocation(
      identifier,
    );

  if (!symbol) {
    return undefined;
  }

  const target =
    symbol.flags
      & ts.SymbolFlags.Alias
      ? context.programContext.checker.getAliasedSymbol(
          symbol,
        )
      : symbol;

  for (const declaration of target.declarations ?? []) {
    if (
      ts.isVariableDeclaration(
        declaration,
      )
    ) {
      return declaration;
    }
  }

  return undefined;
}

function isExportedVariableDeclaration(
  declaration: ts.VariableDeclaration,
): boolean {
  const statement =
    declaration.parent
      .parent
      .parent;

  return (
    ts.isVariableStatement(
      statement,
    )
    && statement.modifiers?.some(
      modifier =>
        modifier.kind
        === ts.SyntaxKind.ExportKeyword,
    ) === true
  );
}

function resolveExpression(
  context: AnalyzerContext,
  expression: ts.Expression,
  resolutionStack: Set<string>,
): ts.Expression {
  let current =
    unwrapExpression(
      expression,
    );

  while (ts.isIdentifier(current)) {
    const declaration =
      resolveIdentifierDeclaration(
        context,
        current,
      );

    if (
      !declaration?.initializer
    ) {
      break;
    }

    const key =
      `${declaration.getSourceFile().fileName}#${current.text}`;

    if (
      resolutionStack.has(key)
    ) {
      throw new Error(
        `Detected a recursive route declaration through "${current.text}".`,
      );
    }

    resolutionStack.add(key);
    current =
      unwrapExpression(
        declaration.initializer,
      );
    context.diagnostics.push({
      level: 'info',
      message:
        `Resolved route declaration "${declaration.name.getText()}".`,
    });
    resolutionStack.delete(key);
  }

  return current;
}

function unwrapExpression(
  expression: ts.Expression,
): ts.Expression {
  let current = expression;

  while (true) {
    if (
      ts.isParenthesizedExpression(
        current,
      )
      || ts.isAsExpression(current)
      || ts.isSatisfiesExpression(
        current,
      )
    ) {
      current =
        current.expression;
      continue;
    }

    return current;
  }
}

function readObjectPropertyName(
  name: ts.PropertyName,
): string {
  if (
    ts.isIdentifier(name)
    || ts.isStringLiteral(name)
  ) {
    return name.text;
  }

  throw new Error(
    `Unsupported property name "${name.getText()}".`,
  );
}

function readStringLiteral(
  expression:
    | ts.Expression
    | undefined,
): string {
  if (!expression) {
    throw new Error(
      'Expected a string literal but found nothing.',
    );
  }

  if (
    ts.isStringLiteral(expression)
    || ts.isNoSubstitutionTemplateLiteral(
      expression,
    )
  ) {
    return expression.text;
  }

  throw new Error(
    `Expected a string literal but found "${expression.getText()}".`,
  );
}

function readOptionalStringLiteral(
  expression:
    | ts.Expression
    | undefined,
): string | undefined {
  return expression
    ? readStringLiteral(
        expression,
      )
    : undefined;
}

function readStringArrayLiteral(
  expression: ts.Expression,
): readonly string[] {
  if (
    !ts.isArrayLiteralExpression(
      expression,
    )
  ) {
    throw new Error(
      `Expected a string array literal but found "${expression.getText()}".`,
    );
  }

  return Object.freeze(
    expression.elements.map(
      element =>
        readStringLiteral(
          element,
        ),
    ),
  );
}

function readOptionalStringArrayLiteral(
  expression:
    | ts.Expression
    | undefined,
): readonly string[] | undefined {
  return expression
    ? readStringArrayLiteral(
        expression,
      )
    : undefined;
}

function readBooleanLiteral(
  expression: ts.Expression,
): boolean {
  if (
    expression.kind
    === ts.SyntaxKind.TrueKeyword
  ) {
    return true;
  }

  if (
    expression.kind
    === ts.SyntaxKind.FalseKeyword
  ) {
    return false;
  }

  throw new Error(
    `Expected a boolean literal but found "${expression.getText()}".`,
  );
}

function readOptionalBooleanLiteral(
  expression:
    | ts.Expression
    | undefined,
): boolean | undefined {
  return expression
    ? readBooleanLiteral(
        expression,
      )
    : undefined;
}

function readNumberLiteral(
  expression: ts.Expression,
): number {
  if (
    ts.isNumericLiteral(
      expression,
    )
  ) {
    return Number(
      expression.text,
    );
  }

  if (
    ts.isPrefixUnaryExpression(
      expression,
    )
    && expression.operator
      === ts.SyntaxKind.MinusToken
    && ts.isNumericLiteral(
      expression.operand,
    )
  ) {
    return -Number(
      expression.operand.text,
    );
  }

  throw new Error(
    `Expected a numeric literal but found "${expression.getText()}".`,
  );
}
