/*
Create/retain one INTERNAL aggregation barrel.

Export only what waypoint-build needs:

export { analyze } from './compiler/analyze.js';
export { createBuildLayout } from './compiler/build-layout.js';
export { prepareBuild } from './compiler/prepare-build.js';

Do not recreate the old public compiler API wholesale.
Do not export CLI functions.
*/
