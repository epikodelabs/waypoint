import { resolve as resolvePath } from 'node:path';

import {
  developmentOutputRoot,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

const compileCode = await run(
  process.execPath,
  ['scripts/compile-routes.mjs'],
  { cwd: workspaceRoot },
);

if (compileCode !== 0) {
  process.exitCode = compileCode;
} else {
  const ngCli = resolvePath(
    workspaceRoot,
    'node_modules/@angular/cli/bin/ng.js',
  );

  process.exitCode = await run(
    process.execPath,
    [ngCli, 'serve', 'server', '--port', '4300'],
    {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        WAYPOINT_OUTPUT_ROOT: developmentOutputRoot,
      },
    },
  );
}
