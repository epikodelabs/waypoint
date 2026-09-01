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
  provideRouter,
} from '@epikodelabs/waypoint';

import { routes } from './app.routes';
import { provideLocalDemoPrincipalSwitching } from './core/demo-session.service';

const resolveRoutes =
  createServerNavigationResolver({
    hostModules: {
      '@angular/core': angularCore,
      '@epikodelabs/waypoint': waypoint,
    },
  });

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApplicationModule,
      BrowserModule,
    ),
    provideBrowserGlobalErrorListeners(),
    provideLocalDemoPrincipalSwitching(),
    ...provideRouter(routes, {
      viewTransitions: true,
      resolveRoutes,
    }),
  ],
};