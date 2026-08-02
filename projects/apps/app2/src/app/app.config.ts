import {
  ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
} from '@angular/core';
import {
  BrowserModule,
} from '@angular/platform-browser';
import {
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
} from '@epikodelabs/waypoint';
import {
  loadProtectedRouteBranch,
} from './protected-route-loader';
import {
  namedRoutes,
  routes,
} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApplicationModule,
      BrowserModule,
    ),
    provideBrowserGlobalErrorListeners(),
    ...provideRouter(routes, {
      viewTransitions: true,
      namedRoutes,
      resolveRoutes: loadProtectedRouteBranch,
    }),
  ],
};

