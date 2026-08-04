import { type NavigationTree } from '@epikodelabs/waypoint';

import { appShellRoute } from './app-shell.route';
import { introBranchRoutes } from './intro.route';
import { legacyBranchRoutes } from './legacy.route';

export const routes = [
  ...introBranchRoutes,
  ...legacyBranchRoutes,
  appShellRoute,
] as const satisfies NavigationTree;