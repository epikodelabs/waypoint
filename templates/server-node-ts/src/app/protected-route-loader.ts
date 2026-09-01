import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';
import { createServerNavigationResolver } from '@epikodelabs/waypoint/server';

/**
 * Resolves authorized route branches and their browser artifacts from the
 * server delivery endpoints without bundling protected implementations.
 */
export const loadProtectedRouteBranch = createServerNavigationResolver({
  hostModules: {
    '@angular/core': angularCore,
    '@epikodelabs/waypoint': waypoint,
  },
});
