import fs from 'node:fs/promises';
import { compilerModule, compilerProject, workspaceRoot } from './config.mjs';
import { executable, run } from './process.mjs';

const force = process.argv.includes('--force');

if (!force && await exists(compilerModule)) {
  process.exitCode = 0;
} else {
  const code = await run(
    executable('npx'),
    ['tsc', '-p', compilerProject],
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