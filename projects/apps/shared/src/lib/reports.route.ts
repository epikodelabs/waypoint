import {
  lazyRoute,
  route,
} from '@epikodelabs/waypoint';

import { ReportsSidebarComponent } from '../../../app1/src/app/demo-pages';

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('../../../app1/src/app/reports.page')
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

export const reportsBranchRoutes = [
  reportsRoute,
  reportsSidebarRoute,
] as const;