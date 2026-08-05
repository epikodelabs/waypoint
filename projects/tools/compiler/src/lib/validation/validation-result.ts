import type { RouteCompilerDiagnostic } from '../compiler/contracts.js';

export interface NavigationValidationResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
}