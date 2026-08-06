import { spawn } from 'node:child_process';

export function executable(name) {
  if (
    process.platform === 'win32'
    && (name === 'npm' || name === 'npx')
  ) {
    return `${name}.cmd`;
  }

  return name;
}

export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      shell: false,
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
}
