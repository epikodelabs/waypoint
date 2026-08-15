/*
 * The client no longer has to repeat context-free route slots:
 *
 *   routeSlot('public')
 *   routeSlot('application')
 *
 * Those roots are implied by exported routesFor() contributions.
 *
 * Keep explicit routeSlot() declarations anywhere their placement carries
 * context (inside layouts, other route sets, policy/provider scopes, etc.).
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
