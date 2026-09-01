import { inject } from '@angular/core';
import {
  layout,
  redirect,
  route,
  routeSlot,
  routesFor,
  s,
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

export const applicationRoutes = routesFor(
  'application',
  'application-core',
  [
    layout('/app', DemoShellComponent, [
      redirect(
        '',
        '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
        { name: 'appHome' },
      ),

      route('/workspace/:projectId', WorkspacePage, {
        name: 'workspace',
        outlets: {
          sidebar: WorkspaceSidebarComponent,
        },
        params: {
          projectId: s.number({ min: 1 }),
        },
        query: {
          view: s.string('overview'),
          page: s.number({ default: 1, min: 1 }),
          filters: s.array(),
          draft: s.optional(s.boolean()),
        },
        prepare: context => ({
          snapshot: inject(DemoSessionService)
            .buildWorkspaceSnapshot(
              Number(context.params['projectId'] ?? 0),
            ),
        }),
      }),

      route('/settings', SettingsPage, {
        name: 'settings',
        outlets: {
          sidebar: SettingsSidebarComponent,
        },
        query: {
          section: s.string('general'),
        },
      }),

      route('/editor/:draftId', EditorPage, {
        name: 'editor',
        outlets: {
          sidebar: EditorSidebarComponent,
        },
        params: {
          draftId: s.number({ min: 1 }),
        },
        query: {
          mode: s.string('write'),
        },
        beforeLeave: () => {
          const session = inject(DemoSessionService);

          return !session.draftDirty()
            || window.confirm(
              'Leave the draft and discard unsaved changes?',
            );
        },
      }),

      route(
        '/reports',
        () =>
          import('../pages/reports.page')
            .then(module => module.ReportsPage),
        {
          name: 'reports',
          outlets: {
            sidebar: ReportsSidebarComponent,
          },
        },
      ),

      routeSlot('administration'),
    ]),
  ],
);
