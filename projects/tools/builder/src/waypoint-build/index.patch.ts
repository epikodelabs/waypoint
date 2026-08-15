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

The builder is now the only public build surface.
*/
