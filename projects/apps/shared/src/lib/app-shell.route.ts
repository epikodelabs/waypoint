import {
  layout,
  routeSlot,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from '../../../app1/src/app/demo-pages';

export const appShellRoute = layout(
  '/app',
  DemoShellComponent,
  [
    routeSlot('application'),
  ],
);
