import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  AdminPage,
  AdminSidebarComponent,
  DemoShellComponent,
} from '/protected-runtime/demo-pages.js';
import {
  prepareAdminAudit,
  requireAdminAccess,
} from '/protected-runtime/route-hooks.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/admin',
      frame(AdminPage, {
        beforeEnter: [requireAdminAccess],
        prepare: [prepareAdminAudit],
      }),
      {
        name: 'admin',
      },
    ),
    route('/admin', AdminSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
