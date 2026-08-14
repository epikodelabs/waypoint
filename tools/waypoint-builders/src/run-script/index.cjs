const { spawn } = require('node:child_process');
const path = require('node:path');

const { createBuilder } = require('@angular-devkit/architect');

module.exports = createBuilder(async (options, context) => {
  const scriptPath = path.resolve(
    context.workspaceRoot,
    options.script,
  );
  const cwd = options.workingDirectory
    ? path.resolve(
        context.workspaceRoot,
        options.workingDirectory,
      )
    : context.workspaceRoot;

  context.reportStatus(
    `Running ${path.relative(context.workspaceRoot, scriptPath)}.`,
  );

  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [scriptPath, ...(options.args ?? [])],
      {
        cwd,
        env: process.env,
        shell: false,
        stdio: 'inherit',
      },
    );

    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    context.logger.error(
      `Script "${options.script}" failed with exit code ${exitCode}.`,
    );
  }

  return { success: exitCode === 0 };
});
