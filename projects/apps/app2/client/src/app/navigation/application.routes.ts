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

import { DemoSessionService } from '@waypoint-demo/runtime';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
  ReportsSidebarComponent,
  SettingsPage,
  SettingsSidebarComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '../demo/demo-pages';

const entries = [
  layout('/app', DemoShellComponent, [
    redirectRoute(
      '',
      '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
      { name: 'appHome' },
    ),
    route(
      '/workspace/:projectId',
      frame(WorkspacePage, {
        prepare: [
          context => {
            const projectId = Number(context.params['projectId'] ?? 0);
            return {
              snapshot: inject(DemoSessionService)
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
    ),
    route('/workspace/:projectId', WorkspaceSidebarComponent, {
      outlet: 'sidebar',
    }),
    route('/settings', SettingsPage, {
      name: 'settings',
      querySchema: {
        section: s.string('general'),
      },
    }),
    route('/settings', SettingsSidebarComponent, {
      outlet: 'sidebar',
    }),
    route(
      '/editor/:draftId',
      frame(EditorPage, {
        beforeLeave: [
          () => {
            const session = inject(DemoSessionService);
            return !session.draftDirty()
              || window.confirm('Leave the draft and discard unsaved changes?');
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
    ),
    route('/editor/:draftId', EditorSidebarComponent, {
      outlet: 'sidebar',
    }),
    lazyRoute(
      '/reports',
      () => import('../demo/reports.page').then(module => module.ReportsPage),
      { name: 'reports' },
    ),
    route('/reports', ReportsSidebarComponent, {
      outlet: 'sidebar',
    }),
    routeSlot('administration'),
  ]),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor(
  'application',
  'application-core',
  entries,
);
