import {
  redirectRoute,
  route,
  routesFor,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { IntroPage } from '../demo/demo-pages';

const entries = [
  route('/', IntroPage, {
    name: 'intro',
  }),
  redirectRoute(
    '/legacy',
    '/app/workspace/101?view=activity&page=2&filters=legacy',
    {
      name: 'legacy',
    },
  ),
] as const satisfies NavigationTree;

export const publicRoutes = routesFor(
  'public',
  'public-core',
  entries,
);
