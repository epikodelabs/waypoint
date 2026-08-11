import fs from 'node:fs/promises';
import path from 'node:path';
import { workspaceRoot } from './config.mjs';

const packagePath = path.join(workspaceRoot, 'package.json');
const fragmentPath = path.join(workspaceRoot, 'package.scripts.json');

const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
const fragment = JSON.parse(await fs.readFile(fragmentPath, 'utf8'));

packageJson.scripts = {
  ...(packageJson.scripts ?? {}),
  ...fragment.scripts,
};

await fs.writeFile(
  packagePath,
  `${JSON.stringify(packageJson, null, 2)}\n`,
  'utf8',
);

process.stdout.write('Waypoint package scripts installed.\n');