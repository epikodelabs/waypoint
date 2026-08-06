import {
  layout,
  routeSlot,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from './demo-pages';

export const appShellRoute = layout(
  '/app',
  DemoShellComponent,
  [
    routeSlot('application'),
  ],
);
