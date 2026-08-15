import type {
  NavigationModuleProgram,
} from '../resolution/navigation-module.js';
import type {
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

export function validateNavigationModule(
  module: NavigationModuleProgram,
): readonly RouteCompilerDiagnostic[] {
  const diagnostics: RouteCompilerDiagnostic[] = [];

  const identities = new Set<string>();

  for (const item of [
    ...module.trees,
    ...module.contributions,
  ]) {
    const key = `${item.file}#${item.exportName}`;

    if (identities.has(key)) {
      diagnostics.push({
        code: 'WPT2108',
        level: 'error',
        message:
          `Navigation module exports "${key}" more than once.`,
      });
    }

    identities.add(key);
  }

  return Object.freeze(diagnostics);
}
