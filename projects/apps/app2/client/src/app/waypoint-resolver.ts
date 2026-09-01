import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

/**
 * Tooling/direct-build fallback.
 *
 * The Waypoint builder replaces this module with a generated resolver containing
 * every host-shared module discovered while preparing protected artifacts.
 */
export const resolveRoutes =
  waypoint.createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });
