import { redirect, route, routesFor, type NavigationTree } from '@epikodelabs/waypoint';

import { IntroPage } from '../pages/demo-pages';

export const introRoute = route('/', IntroPage, {
  name: 'intro',
});

export const legacyRoute = redirect(
  '/legacy',
  '/app/workspace/101?view=activity&page=2&filters=legacy',
  {
    name: 'legacy',
  },
);

const entries = [introRoute, legacyRoute] as const satisfies NavigationTree;

export const publicRoutes = routesFor('public', entries);