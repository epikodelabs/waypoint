import { productionOutputRoot, workspaceRoot } from './config.mjs';
import { executable, run } from './process.mjs';

const buildCode = await run(
  executable('npx'),
  ['ng', 'build', 'server'],
  { cwd: workspaceRoot },
);

if (buildCode !== 0) {
  process.exitCode = buildCode;
} else {
  process.exitCode = await run(
    executable('node'),
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