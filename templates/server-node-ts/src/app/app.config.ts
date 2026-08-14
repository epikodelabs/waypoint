import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideServerRouter } from '@epikodelabs/waypoint/server';

import { routes } from './app.routes';
import { loadProtectedRouteBranch } from './protected-route-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      resolveRoutes: loadProtectedRouteBranch,
    }),
  ],
};
