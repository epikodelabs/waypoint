import fs from 'node:fs/promises';
import path from 'node:path';

import {
  createHostModulePredicate,
} from './host-runtime-plugin.js';

/**
 * Discovers identity-sensitive package imports from AOT-compiled protected
 * sources. Application code does not configure these modules.
 */
export async function discoverHostRuntimeModules(
  outputRoot: string,
): Promise<readonly string[]> {
  const predicate = createHostModulePredicate();
  const modules = new Set<string>();

  for (const file of await javascriptFiles(outputRoot)) {
    const source = await fs.readFile(file, 'utf8');

    for (const specifier of importSpecifiers(source)) {
      if (predicate(specifier)) modules.add(specifier);
    }
  }

  return Object.freeze([...modules].sort());
}

function importSpecifiers(source: string): readonly string[] {
  const values = new Set<string>();
  const pattern =
    /(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g;

  for (const match of source.matchAll(pattern)) {
    if (match[1]) values.add(match[1]);
  }

  return [...values];
}

async function javascriptFiles(root: string): Promise<string[]> {
  const result: string[] = [];

  async function visit(directory: string): Promise<void> {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(candidate);
      else if (/\.(?:m?js|cjs)$/i.test(entry.name)) result.push(candidate);
    }
  }

  await visit(root);
  return result.sort();
}
