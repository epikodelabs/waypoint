import {
  layout,
  routeSlot,
  routesFor,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from './demo-pages';
import { appHomeBranchRoutes } from './app-home.route';
import { editorBranchRoutes } from './editor.route';
import { reportsBranchRoutes } from './reports.route';
import { settingsBranchRoutes } from './settings.route';
import { workspaceBranchRoutes } from './workspace.route';

const entries = [
  layout(
    '/app',
    DemoShellComponent,
    [
      ...appHomeBranchRoutes,
      ...workspaceBranchRoutes,
      ...settingsBranchRoutes,
      ...editorBranchRoutes,
      ...reportsBranchRoutes,
      routeSlot(
        'administration',
        () =>
          import('./admin.route')
            .then(module => module.administrationRoutes),
      ),
    ],
  ),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor(
  'application',
  'application-core',
  entries,
);