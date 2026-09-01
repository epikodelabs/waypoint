import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';

/**
 * App 2's server-hosted browser app ships the same minimal navigation
 * skeleton as its standalone client. Protected route implementations and
 * metadata are not bundled here; compiler artifacts attach to these ownership
 * slots at runtime.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;