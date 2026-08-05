import {
  layout,
  routesFor,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from '../demo-pages';
import { adminBranchRoutes } from './admin.route';
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
      ...adminBranchRoutes,
    ],
  ),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor(
  'application',
  'application-core',
  entries,
);
