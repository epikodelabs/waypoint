import {
  routeSlot,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export { publicRoutes } from './public.routes';
export { applicationRoutes } from './application.routes';
export { administrationRoutes } from './administration.routes';

export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
