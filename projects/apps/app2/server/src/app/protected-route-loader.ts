import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';
import { createServerNavigationResolver } from '@epikodelabs/waypoint/server';

export const loadProtectedRouteBranch =
  createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });