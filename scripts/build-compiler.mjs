import fs from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import {
  compilerModule,
  compilerProject,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

const force = process.argv.includes('--force');

if (!force && await exists(compilerModule)) {
  process.exitCode = 0;
} else {
  const tscCli = resolvePath(
    workspaceRoot,
    'node_modules/typescript/bin/tsc',
  );

  const code = await run(
    process.execPath,
    [tscCli, '-p', compilerProject],
    { cwd: workspaceRoot },
  );

  process.exitCode = code;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}
