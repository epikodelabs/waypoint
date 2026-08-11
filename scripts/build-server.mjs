import { resolve as resolvePath } from 'node:path';

import {
  productionOutputRoot,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

const ngCli = resolvePath(
  workspaceRoot,
  'node_modules/@angular/cli/bin/ng.js',
);

const buildCode = await run(
  process.execPath,
  [ngCli, 'build', 'server'],
  { cwd: workspaceRoot },
);

if (buildCode !== 0) {
  process.exitCode = buildCode;
} else {
  process.exitCode = await run(
    process.execPath,
    [
      'scripts/compile-routes.mjs',
      '--production',
      '--profile',
      '--output',
      productionOutputRoot,
    ],
    { cwd: workspaceRoot },
  );
}
