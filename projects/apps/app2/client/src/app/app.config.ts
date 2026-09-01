import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideRouter,
} from '@epikodelabs/waypoint';
import {
  createServerNavigationResolver,
} from '@epikodelabs/waypoint';

import { routes } from './app.routes';
import { provideLocalDemoPrincipalSwitching } from './core/demo-session.service';

const resolveRoutes = createServerNavigationResolver();

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
