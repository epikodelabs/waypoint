import { developmentOutputRoot, workspaceRoot } from './config.mjs';
import { executable, run } from './process.mjs';

const compileCode = await run(
  executable('node'),
  ['scripts/compile-routes.mjs'],
  { cwd: workspaceRoot },
);

if (compileCode !== 0) {
  process.exitCode = compileCode;
} else {
  process.exitCode = await run(
    executable('npx'),
    ['ng', 'serve', 'app2', '--port', '4300'],
    {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        WAYPOINT_OUTPUT_ROOT: developmentOutputRoot,
      },
    },
  );
}
