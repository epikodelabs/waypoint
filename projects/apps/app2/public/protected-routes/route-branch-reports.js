import {
  lazyRoute,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  ReportsSidebarComponent,
} from '/protected-runtime/demo-pages.js';

const loadReportsPage = () =>
  import('/protected-runtime/lazy-pages.js')
    .then(module => module.ReportsPage);

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    lazyRoute('/reports', loadReportsPage, {
      name: 'reports',
    }),
    route('/reports', ReportsSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
