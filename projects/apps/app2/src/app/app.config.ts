import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@epikodelabs/waypoint';

import { routes } from './app.routes';
import { loadProtectedRouteBranch } from './protected-route-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideRouter(routes, {
      viewTransitions: true,
      resolveRoutes: loadProtectedRouteBranch,
    }),
  ],
};
