import {
  routeSlot,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export {
  publicRoutes,
} from './routes/public.routes';

export {
  applicationRoutes,
} from './routes/application.routes';

export {
  administrationRoutes,
} from './routes/administration.routes';

/**
 * App 2 ships only the ownership slots in the initial client bundle.
 * Server-resolved contributions attach to these slots at runtime.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
