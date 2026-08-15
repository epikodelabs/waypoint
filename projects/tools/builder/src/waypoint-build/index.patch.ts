/*
Replace:

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../../compiler/src/lib/index.js';

With:

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../compiler/index.js';

Also remove routesExport from the builder-facing option shape.
*/
