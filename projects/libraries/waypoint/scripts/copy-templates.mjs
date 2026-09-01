import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, '../../../..');
const sourceRoot = path.join(workspaceRoot, 'templates');
const outputRoot = path.join(workspaceRoot, 'dist/waypoint/templates');

await rm(outputRoot, { recursive: true, force: true });

for (const name of ['server-aspnet-core', 'server-node-ts']) {
  await cp(path.join(sourceRoot, name), path.join(outputRoot, name), {
    recursive: true,
    filter: source => !source.endsWith('.spec.ts')
      && path.basename(source) !== 'tsconfig.spec.json',
  });
}
