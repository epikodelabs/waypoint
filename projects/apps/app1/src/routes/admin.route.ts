import { inject } from '@angular/core';
import {
  frame,
  route,
} from '@epikodelabs/waypoint';

import { AdminPage, AdminSidebarComponent } from '../app/demo-pages';
import { DemoSessionService } from '../app/demo-session.service';

export const adminRoute = route(
  '/admin',
  frame(AdminPage, {
    beforeEnter: [
      () => {
        const session = inject(DemoSessionService);

        return session.adminAccess()
          || {
            redirectTo: '/app/settings?section=access',
            replace: true,
          };
      },
    ],
    prepare: [
      () => ({
        audit:
          inject(DemoSessionService)
            .createAdminAudit(),
      }),
    ],
  }),
  {
    name: 'admin',
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
