import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';

/**
 * The client app ships only the public navigation skeleton.
 *
 * It does not contain page routes, layouts, components, guards,
 * or protected route metadata. Those arrive through compiler artifacts.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;