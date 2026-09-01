import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

/**
 * The SSR application and its hydrated browser bundle have their own module
 * graph, so they bind the delivery resolver to their exact Angular/Waypoint
 * namespace identities.
 */
export const resolveRoutes =
  waypoint.createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });
