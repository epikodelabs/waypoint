const { spawn } = require('node:child_process');
const path = require('node:path');
const { createBuilder, targetFromTargetString } = require('@angular-devkit/architect');

function exec(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code ?? 'unknown'}.`)));
  });
}

async function waypointBuild(options, context) {
  try {
    const root = context.workspaceRoot;
    const metadata = context.target ? await context.getProjectMetadata(context.target.project) : {};
    const projectRoot = typeof metadata.root === 'string' ? metadata.root : '';
    const entry = path.resolve(root, projectRoot, options.entry || 'src/app/app.routes.ts');
    const compiler = path.resolve(root, 'dist/projects/tools/compiler/cli/route-compiler.js');
    const args = [compiler, 'compile', '--entry', entry,
      '--artifact-tsconfig', path.resolve(root, options.artifactTsconfig),
      '--server-output', path.resolve(root, options.serverOutput),
      '--entries-output', path.resolve(root, options.entriesOutput),
      '--manifest-output', path.resolve(root, options.manifestOutput),
      '--artifacts-output', path.resolve(root, options.artifactsOutput),
      '--routes-export', options.routesExport || 'routes'];
    if (options.profile) args.push('--profile');
    await exec(process.execPath, args, root);

    const scheduled = await context.scheduleTarget(targetFromTargetString(options.buildTarget));
    try {
      const result = await scheduled.result;
      return result.success ? { success: true } : { success: false, error: result.error || 'Angular build failed.' };
    } finally { await scheduled.stop(); }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return { success: false, error: message };
  }
}
module.exports = createBuilder(waypointBuild);
