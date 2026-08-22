import {
  lazyRoute,
  route,
} from '@epikodelabs/waypoint';

import { ReportsSidebarComponent } from './demo-pages';

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('./reports.page')
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