import * as angularCore from '@angular/core';
import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as waypoint from '@epikodelabs/waypoint';
import {
  createServerNavigationResolver,
  provideServerRouter,
} from '@epikodelabs/waypoint/server';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      resolveRoutes: createServerNavigationResolver({
        hostModules: {
          '@angular/core': angularCore,
          '@epikodelabs/waypoint': waypoint,
        },
      }),
    }),
  ],
};
