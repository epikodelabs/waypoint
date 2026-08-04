import {
  route,
  s,
} from '@epikodelabs/waypoint';

import { SettingsPage, SettingsSidebarComponent } from '../app/demo-pages';

export const settingsRoute = route('/settings', SettingsPage, {
  name: 'settings',
  querySchema: {
    section: s.string('general'),
  },
});

export const settingsSidebarRoute = route(
  '/settings',
  SettingsSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const settingsBranchRoutes = [
  settingsRoute,
  settingsSidebarRoute,
] as const;