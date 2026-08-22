import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Verifies that server-delivered routesFor() identities are absent from the
 * public Angular host output. Contribution ids are runtime strings and survive
 * bundling/minification; the browser should learn them only after authorization.
 */
export async function assertNoRouteArtifactKeysInHost(
  publicRoot: string,
  artifactKeys: readonly string[],
): Promise<void> {
  const keys = [...new Set(
    artifactKeys
      .map(key => key.trim())
      .filter(Boolean),
  )];

  if (keys.length === 0) return;

  const files = await readableHostFiles(publicRoot);

  for (const file of files) {
    const contents = await fs.readFile(file, 'utf8');

    for (const artifactKey of keys) {
      if (!contents.includes(artifactKey)) continue;

      throw new Error(
        `Server-delivered route artifact "${artifactKey}" leaked into public host output: ${file}. ` +
        'Remove static routesFor() imports from the Angular host configuration.',
      );
    }
  }
}

async function readableHostFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(file);
      } else if (/\.(?:m?js|cjs|html|json|map)$/i.test(entry.name)) {
        files.push(file);
      }
    }
  }

  await visit(root);
  return files.sort();
}