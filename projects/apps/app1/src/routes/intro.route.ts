import { route } from '@epikodelabs/waypoint';

import { IntroPage } from '../app/demo-pages';

export const introRoute = route('/', IntroPage, {
  name: 'intro',
});

export const introBranchRoutes = [introRoute] as const;