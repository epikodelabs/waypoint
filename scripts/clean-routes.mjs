import { rm } from 'node:fs/promises';
import { outputRoot } from './config.mjs';

await rm(outputRoot, { recursive: true, force: true });
console.log(`Removed ${outputRoot}`);