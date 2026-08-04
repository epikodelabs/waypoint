import type { RouteCompilerDiagnostic, SourceSpan } from './contracts.js';
import type { SourceReference } from '../ir/model.js';

export function toSourceSpan(source: SourceReference | undefined): SourceSpan | undefined {
  if (!source) return undefined;
  return {
    file: source.filePath,
    start: source.start ?? 0,
    length: source.length ?? 0,
  };
}

export function diagnostic(
  code: string,
  level: RouteCompilerDiagnostic['level'],
  message: string,
  source?: SourceReference,
  details: Pick<RouteCompilerDiagnostic, 'routePath' | 'routeName'> = {},
): RouteCompilerDiagnostic {
  return { code, level, message, source: toSourceSpan(source), ...details };
}

export function hasErrors(diagnostics: readonly RouteCompilerDiagnostic[]): boolean {
  return diagnostics.some(item => item.level === 'error');
}