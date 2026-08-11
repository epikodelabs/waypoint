import * as demoRuntime from '@waypoint-demo/runtime';
import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

export const loadProtectedRouteBranch =
  waypoint.createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
      '@waypoint-demo/runtime': demoRuntime,
    },
  });
