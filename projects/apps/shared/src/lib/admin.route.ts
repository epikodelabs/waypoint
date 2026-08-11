import { inject } from '@angular/core';
import {
  frame,
  route,
  routesFor,
} from '@epikodelabs/waypoint';

import { AdminPage, AdminSidebarComponent } from './admin-pages';
import { DemoSessionService } from '@waypoint-demo/runtime';

export const adminRoute = route(
  '/admin',
  frame(AdminPage, {
    prepare: [
      () => {
        const session = inject(DemoSessionService);
        const user = session.currentUser();

        return {
          audit: {
            reviewedBy: user.email,
            reviewerRole: user.role,
            workspaceLoads: session.workspaceLoads(),
          },
        };
      },
    ],
  }),
  {
    name: 'admin',
    policy: {
      roles: ['admin'],
      permissions: ['admin:read'],
    },
  },
);

export const adminSidebarRoute = route(
  '/admin',
  AdminSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const adminBranchRoutes = [
  adminRoute,
  adminSidebarRoute,
] as const;
export const administrationRoutes = routesFor(
  'administration',
  'administration-core',
  adminBranchRoutes,
);
