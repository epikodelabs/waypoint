import {
  routesFor,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { introBranchRoutes } from './intro.route';
import { legacyBranchRoutes } from './legacy.route';

const entries = [
  ...introBranchRoutes,
  ...legacyBranchRoutes,
] as const satisfies NavigationTree;

export const publicRoutes = routesFor(
  'public',
  'public-core',
  entries,
);