import fs from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

import {
  developmentOutputRoot,
  resolveCompilerCli,
  workspaceRoot,
} from './config.mjs';
import { run } from './process.mjs';

const compilerBuildCode = await run(
  process.execPath,
  [
    'scripts/build-compiler.mjs',
    '--force',
  ],
  { cwd: workspaceRoot },
);

if (compilerBuildCode !== 0) {
  process.exitCode = compilerBuildCode;
} else {
  // Fail early if the just-built CLI is not where config expects it.
  resolveCompilerCli();

  const compileCode = await run(
    process.execPath,
    ['scripts/compile-routes.mjs'],
    { cwd: workspaceRoot },
  );

  if (compileCode !== 0) {
    process.exitCode = compileCode;
  } else {
    const serverIndex =
      resolvePath(
        developmentOutputRoot,
        'server-index.json',
      );

    try {
      await fs.access(serverIndex);
    } catch {
      throw new Error(
        `Route compiler reported success but did not publish "${serverIndex}".`,
      );
    }

  const ngCli = resolvePath(
    workspaceRoot,
    'node_modules/@angular/cli/bin/ng.js',
  );

  process.exitCode = await run(
    process.execPath,
    [ngCli, 'serve', 'app2-server', '--port', '4300'],
    {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        WAYPOINT_OUTPUT_ROOT: developmentOutputRoot,
      },
    },
  );
}
  }
}
