import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface OutputSnapshot {
  restore(): Promise<void>;
  discard(): Promise<void>;
}

export async function snapshotDirectory(
  target: string,
): Promise<OutputSnapshot> {
  const absolute = path.resolve(target);
  const parent = path.dirname(absolute);
  const backup = path.join(
    parent,
    `.${path.basename(absolute)}.waypoint-snapshot-${process.pid}-${randomUUID()}`,
  );

  const existed = await exists(absolute);
  if (existed) {
    await fs.rm(backup, { recursive: true, force: true });
    await fs.cp(absolute, backup, { recursive: true });
  }

  let settled = false;

  return Object.freeze({
    async restore() {
      if (settled) return;
      settled = true;

      await fs.rm(absolute, { recursive: true, force: true });
      if (existed) {
        await fs.cp(backup, absolute, { recursive: true });
      }
      await fs.rm(backup, { recursive: true, force: true });
    },

    async discard() {
      if (settled) return;
      settled = true;
      await fs.rm(backup, { recursive: true, force: true });
    },
  });
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
