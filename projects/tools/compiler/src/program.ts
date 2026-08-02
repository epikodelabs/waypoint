import path from 'node:path';
import ts from 'typescript';

export interface RouteProgramContext {
  readonly entry: string;
  readonly tsconfigPath: string;
  readonly program: ts.Program;
  readonly checker: ts.TypeChecker;
  readonly sourceFile: ts.SourceFile;
}

export function createRouteProgram(
  entry: string,
): RouteProgramContext {
  const tsconfigPath =
    ts.findConfigFile(
      path.dirname(entry),
      ts.sys.fileExists,
      'tsconfig.json',
    );

  if (!tsconfigPath) {
    throw new Error(
      `Could not find tsconfig.json for ${entry}.`,
    );
  }

  const configFile =
    ts.readConfigFile(
      tsconfigPath,
      ts.sys.readFile,
    );

  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(
        configFile.error.messageText,
        '\n',
      ),
    );
  }

  const parsedConfig =
    ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(tsconfigPath),
      undefined,
      tsconfigPath,
    );
  const rootNames =
    parsedConfig.fileNames.includes(entry)
      ? parsedConfig.fileNames
      : [...parsedConfig.fileNames, entry];
  const program =
    ts.createProgram({
      rootNames,
      options: {
        ...parsedConfig.options,
        noEmit: true,
      },
    });
  const sourceFile =
    program.getSourceFile(entry);

  if (!sourceFile) {
    throw new Error(
      `Could not load route entry source ${entry}.`,
    );
  }

  return {
    entry,
    tsconfigPath,
    program,
    checker:
      program.getTypeChecker(),
    sourceFile,
  };
}
