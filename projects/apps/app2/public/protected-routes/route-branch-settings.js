import {
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  SettingsPage,
  SettingsSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route('/settings', SettingsPage, {
      name: 'settings',
      querySchema: {
        section: s.string('general'),
      },
    }),
    route('/settings', SettingsSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
