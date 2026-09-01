import { inject } from '@angular/core';
import { route, routesFor } from '@epikodelabs/waypoint';

import { AdminPage, AdminSidebarComponent } from '../pages/admin-pages';
import { DemoSessionService } from '../core/demo-session.service';

export const administrationRoutes = routesFor(
  'administration',
  'administration-core',
  [
    route('/admin', AdminPage, {
      name: 'admin',
      outlets: {
        sidebar: AdminSidebarComponent,
      },
      policy: {
        roles: ['admin'],
        permissions: ['admin:read'],
      },
      prepare: () => {
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
    }),
  ],
);
