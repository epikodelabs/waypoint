import { watch } from 'node:fs';
import { dirname } from 'node:path';

import {
  routeEntry,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

let running = false;
let queued = false;
let timer;

async function compile() {
  if (running) {
    queued = true;
    return;
  }

  running = true;

  try {
    const code = await run(
      process.execPath,
      ['scripts/compile-routes.mjs'],
      { cwd: workspaceRoot },
    );

    if (code !== 0) {
      console.error(`Route compilation failed with code ${code}.`);
    }
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : String(error),
    );
  } finally {
    running = false;

    if (queued) {
      queued = false;
      await compile();
    }
  }
}

await compile();

const directory = dirname(routeEntry);
console.log(`Watching ${directory}`);

watch(directory, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => void compile(), 100);
});
