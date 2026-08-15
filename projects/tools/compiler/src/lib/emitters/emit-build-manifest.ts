import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  WaypointBuildManifestDocument,
} from '../compiler/contracts.js';

export async function emitBuildManifest(
  outputPath: string | undefined,
  manifest: WaypointBuildManifestDocument,
): Promise<readonly string[]> {
  if (!outputPath) return Object.freeze([]);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const temporary = `${outputPath}.tmp-${process.pid}`;
  await fs.writeFile(
    temporary,
    JSON.stringify(manifest, null, 2),
    'utf8',
  );
  await fs.rename(temporary, outputPath);

  return Object.freeze([outputPath]);
}
