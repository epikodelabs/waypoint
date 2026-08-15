import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface DependencyFingerprint {
  readonly key: string;
  readonly files: readonly string[];
}

/**
 * Fingerprints only files that participate in Waypoint's navigation/protected
 * build graph. Host-only application edits do not invalidate this fingerprint.
 */
export async function fingerprintFiles(
  files: readonly string[],
): Promise<DependencyFingerprint> {
  const normalized = [...new Set(
    files.map(file => path.resolve(file)),
  )].sort();

  const hash = crypto.createHash('sha256');

  for (const file of normalized) {
    hash.update(file);
    hash.update('\0');

    try {
      const stat = await fs.stat(file);

      hash.update(String(stat.size));
      hash.update('\0');
      hash.update(String(stat.mtimeMs));
      hash.update('\0');
    } catch {
      hash.update('missing');
      hash.update('\0');
    }
  }

  return Object.freeze({
    key: hash.digest('hex'),
    files: Object.freeze(normalized),
  });
}
