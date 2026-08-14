import {
  routeSlot,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export { publicRoutes } from './routes/public.routes';
export { applicationRoutes } from './routes/application.routes';
export { administrationRoutes } from './routes/administration.routes';

export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
