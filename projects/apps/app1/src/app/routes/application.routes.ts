import { inject } from '@angular/core';
import {
  frame,
  layout,
  lazyRoute,
  redirectRoute,
  route,
  routeSlot,
  routesFor,
  s,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoSessionService } from '../core/demo-session.service';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
  ReportsSidebarComponent,
  SettingsPage,
  SettingsSidebarComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '../pages/demo-pages';

export const appHomeRoute = redirectRoute(
  '',
  '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
  {
    name: 'appHome',
  },
);

export const workspaceRoute = route(
  '/workspace/:projectId',
  frame(WorkspacePage, {
    prepare: [
      context => {
        const projectId = Number(
          context.params['projectId'] ?? 0,
        );

        return {
          snapshot:
            inject(DemoSessionService)
              .buildWorkspaceSnapshot(projectId),
        };
      },
    ],
  }),
  {
    name: 'workspace',
    paramsSchema: {
      projectId: s.number({ min: 1 }),
    },
    querySchema: {
      view: s.string('overview'),
      page: s.number({ default: 1, min: 1 }),
      filters: s.array(),
      draft: s.optional(s.boolean()),
    },
  },
);

export const workspaceSidebarRoute = route(
  '/workspace/:projectId',
  WorkspaceSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const settingsRoute = route('/settings', SettingsPage, {
  name: 'settings',
  querySchema: {
    section: s.string('general'),
  },
});

export const settingsSidebarRoute = route(
  '/settings',
  SettingsSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const editorRoute = route(
  '/editor/:draftId',
  frame(EditorPage, {
    beforeLeave: [
      () => {
        const session = inject(DemoSessionService);

        return !session.draftDirty()
          || window.confirm(
            'Leave the draft and discard unsaved changes?',
          );
      },
    ],
  }),
  {
    name: 'editor',
    paramsSchema: {
      draftId: s.number({ min: 1 }),
    },
    querySchema: {
      mode: s.string('write'),
    },
  },
);

export const editorSidebarRoute = route(
  '/editor/:draftId',
  EditorSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('../pages/reports.page')
      .then(module => module.ReportsPage),
  {
    name: 'reports',
  },
);

export const reportsSidebarRoute = route(
  '/reports',
  ReportsSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

const branchEntries = [
  appHomeRoute,
  workspaceRoute,
  workspaceSidebarRoute,
  settingsRoute,
  settingsSidebarRoute,
  editorRoute,
  editorSidebarRoute,
  reportsRoute,
  reportsSidebarRoute,
] as const satisfies NavigationTree;

const entries = [
  layout('/app', DemoShellComponent, [
    ...branchEntries,
    routeSlot('administration'),
  ]),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor('application', 'application-core', entries);