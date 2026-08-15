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
 * Compiler entrypoint: exposes ownership slots plus contribution exports.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
