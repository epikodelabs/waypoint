import {
  WAYPOINT_HOST_RUNTIME_GLOBAL_KEY,
} from './host-runtime-plugin.js';

export function createHostRoutesSource(
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
    `// Waypoint generated public route host.`,
    ...imports,
    ``,
    `const key = ${JSON.stringify(WAYPOINT_HOST_RUNTIME_GLOBAL_KEY)};`,
    `const host = globalThis as typeof globalThis & Record<string, any>;`,
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
    `const { routeSlot } = module${modules.indexOf('@epikodelabs/waypoint')};`,
    ``,
    `export const routes = [`,
    `  routeSlot('public'),`,
    `  routeSlot('application'),`,
    `];`,
    ``,
  ].join('\n');
}
