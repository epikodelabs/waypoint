import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@epikodelabs/waypoint';
import {
  applicationRoutes,
  provideLocalDemoPrincipalSwitching,
  publicRoutes,
  routes,
} from '@waypoint-demo/runtime';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    provideLocalDemoPrincipalSwitching(),
    ...provideRouter(routes, {
      viewTransitions: true,
      contributions: [
        publicRoutes,
        applicationRoutes,
      ],
    }),
  ],
};
