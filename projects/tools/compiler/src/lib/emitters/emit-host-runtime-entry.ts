import fs from 'node:fs/promises';
import path from 'node:path';

import {
  WAYPOINT_HOST_RUNTIME_SYMBOL_KEY,
} from './host-runtime-plugin.js';

export interface HostRuntimeEntry {
  readonly outputPath: string;
  readonly modules: readonly string[];
}

/**
 * Generates a host-side registrar compiled by the ordinary Angular build.
 *
 * Because this module is inside the host build graph, its Angular/Waypoint
 * imports resolve to exactly the same runtime identities used by the app.
 */
export async function emitHostRuntimeEntry(
  outputPath: string,
  modules: readonly string[],
): Promise<HostRuntimeEntry> {
  const sorted = [...new Set(modules)].sort();

  const imports = sorted.map(
    (specifier, index) =>
      `import * as module${index} from ${JSON.stringify(specifier)};`,
  );

  const registrations = sorted.map(
    (specifier, index) =>
      `modules.set(${JSON.stringify(specifier)}, module${index});`,
  );

  const source = [
    ...imports,
    '',
    `const key = Symbol.for(${JSON.stringify(WAYPOINT_HOST_RUNTIME_SYMBOL_KEY)});`,
    'const global = globalThis;',
    'let runtime = global[key];',
    'if (!runtime) {',
    '  runtime = Object.freeze({ version: 1, modules: new Map() });',
    '  global[key] = runtime;',
    '}',
    'const modules = runtime.modules;',
    ...registrations,
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, source, 'utf8');

  return Object.freeze({
    outputPath: path.resolve(outputPath),
    modules: Object.freeze(sorted),
  });
}
