import fs from 'node:fs/promises';
import path from 'node:path';

export interface HostIsolationProbe {
  readonly name: string;
  readonly marker: string;
}

export interface HostIsolationResult {
  readonly publicFiles: readonly string[];
  readonly protectedFiles: readonly string[];
}

/**
 * Build-level security assertion.
 *
 * A marker belonging to a protected implementation must:
 *  1. not occur anywhere in the public Angular browser output;
 *  2. occur in at least one protected Waypoint artifact.
 *
 * Markers are deliberately test-only sentinels, not production security metadata.
 */
export async function assertHostIsolation(
  publicRoot: string,
  protectedRoot: string,
  probes: readonly HostIsolationProbe[],
): Promise<HostIsolationResult> {
  const publicFiles = await readableFiles(publicRoot);
  const protectedFiles = await readableFiles(protectedRoot);

  const publicContents = await readAll(publicFiles);
  const protectedContents = await readAll(protectedFiles);

  for (const probe of probes) {
    const leaked = publicContents.find(file => file.contents.includes(probe.marker));
    if (leaked) {
      throw new Error(
        `Protected implementation "${probe.name}" leaked into public host output: ${leaked.file}.`,
      );
    }

    const emitted = protectedContents.some(file => file.contents.includes(probe.marker));
    if (!emitted) {
      throw new Error(
        `Protected implementation "${probe.name}" was not found in protected artifacts.`,
      );
    }
  }

  return Object.freeze({
    publicFiles: Object.freeze(publicFiles),
    protectedFiles: Object.freeze(protectedFiles),
  });
}

async function readableFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (/\.(?:m?js|cjs|css|html|json|map)$/i.test(entry.name)) files.push(file);
    }
  }
  await visit(root);
  return files.sort();
}

async function readAll(files: readonly string[]) {
  return Promise.all(
    files.map(async file => ({
      file,
      contents: await fs.readFile(file, 'utf8'),
    })),
  );
}
