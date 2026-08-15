/*
 * Waypoint navigation module.
 *
 * The compiler follows this module's export graph and collects:
 *   - authored NavigationTree exports;
 *   - routesFor() contribution exports.
 *
 * There is no privileged `routes` export.
 */

export {
  publicRoutes,
} from './routes/public.routes';

export {
  applicationRoutes,
} from './routes/application.routes';

export {
  administrationRoutes,
} from './routes/administration.routes';
