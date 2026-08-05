import { type NavigationTree } from '@epikodelabs/waypoint';

import { appShellRoute } from './app-shell.route';
import { applicationRoutes } from './application.routes';
import { introBranchRoutes } from './intro.route';
import { legacyBranchRoutes } from './legacy.route';

export { applicationRoutes };

export const routes = [
  ...introBranchRoutes,
  ...legacyBranchRoutes,
  appShellRoute,
] as const satisfies NavigationTree;
