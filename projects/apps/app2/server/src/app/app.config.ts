import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideServerRouter,
} from '@epikodelabs/waypoint/server';

import { routes } from './app.routes';
import { administrationRoutes } from '../../../client/src/app/routes/administration.routes';
import { applicationRoutes } from '../../../client/src/app/routes/application.routes';
import { publicRoutes } from '../../../client/src/app/routes/public.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      contributions: [
        publicRoutes,
        applicationRoutes,
        administrationRoutes,
      ],
    }),
  ],
};
