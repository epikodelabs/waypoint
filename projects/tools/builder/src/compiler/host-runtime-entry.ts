import {
  WAYPOINT_HOST_RUNTIME_GLOBAL_KEY,
} from './host-runtime-plugin.js';

/**
 * Generates the browser bootstrap that publishes the host application's exact
 * framework module namespaces for independently delivered route artifacts.
 */
export function createHostRuntimeSource(
  specifiers: readonly string[],
): string {
  const modules = [
    ...new Set([
      '@epikodelabs/waypoint',
      ...specifiers,
    ]),
  ].sort();

  const imports = modules.map(
    (specifier, index) =>
      `import * as module${index} from ${JSON.stringify(specifier)};`,
  );

  const entries = modules.map(
    (specifier, index) =>
      `  [${JSON.stringify(specifier)}, module${index}],`,
  );

  return [
    `// Waypoint generated host runtime bootstrap.`,
    ...imports,
    ``,
    `const key = ${JSON.stringify(WAYPOINT_HOST_RUNTIME_GLOBAL_KEY)};`,
    `const host = globalThis;`,
    `let runtime = host[key];`,
    ``,
    `if (!runtime) {`,
    `  runtime = { version: 1, modules: new Map() };`,
    `  host[key] = runtime;`,
    `}`,
    ``,
    `for (const [specifier, module] of [`,
    ...entries,
    `]) {`,
    `  const existing = runtime.modules.get(specifier);`,
    ``,
    `  if (existing && existing !== module) {`,
    `    throw new Error(`,
    `      \`Waypoint host module \${JSON.stringify(specifier)} was registered with a different module identity.\`,`,
    `    );`,
    `  }`,
    ``,
    `  runtime.modules.set(specifier, module);`,
    `}`,
    ``,
  ].join('\n');
}
