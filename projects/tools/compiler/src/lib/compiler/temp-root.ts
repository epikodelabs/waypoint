import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function createWaypointTempRoot(label: string): Promise<string> {
  const safe = label.replace(/[^a-zA-Z0-9_-]/g, '-');
  return fs.mkdtemp(path.join(os.tmpdir(), `waypoint-${safe}-`));
}
