import { inject } from '@angular/core';
import {
  frame,
  route,
  s,
} from '@epikodelabs/waypoint';

import { WorkspacePage, WorkspaceSidebarComponent } from './demo-pages';
import { DemoSessionService } from './demo-session.service';

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

export const workspaceBranchRoutes = [
  workspaceRoute,
  workspaceSidebarRoute,
] as const;