import {
  layout,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from '../app/demo-pages';
import { adminBranchRoutes } from './admin.route';
import { appHomeBranchRoutes } from './app-home.route';
import { editorBranchRoutes } from './editor.route';
import { reportsBranchRoutes } from './reports.route';
import { settingsBranchRoutes } from './settings.route';
import { workspaceBranchRoutes } from './workspace.route';

export const appShellEntries = [
  ...appHomeBranchRoutes,
  ...workspaceBranchRoutes,
  ...settingsBranchRoutes,
  ...editorBranchRoutes,
  ...reportsBranchRoutes,
  ...adminBranchRoutes,
] as const satisfies NavigationTree;

export const appShellRoute = layout(
  '/app',
  DemoShellComponent,
  appShellEntries,
);

