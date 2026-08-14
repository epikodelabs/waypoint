import fs from 'node:fs/promises';
import path from 'node:path';
import type { PlannedHostEntry } from '../planning/plan-host-entry.js';

export async function emitHostEntry(entry: PlannedHostEntry): Promise<string> {
  await fs.mkdir(path.dirname(entry.outputPath), { recursive: true });
  await fs.writeFile(entry.outputPath, entry.contents, 'utf8');
  return entry.outputPath;
}
