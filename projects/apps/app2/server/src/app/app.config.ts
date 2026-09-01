import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  createServerNavigationResolver,
  provideServerRouter,
} from '@epikodelabs/waypoint';

import { routes } from './app.routes';

const resolveRoutes = createServerNavigationResolver();

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      resolveRoutes,
    }),
  ],
};
