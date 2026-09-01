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
  publicRoutes,
  routes,
} from './app.routes';
import { provideLocalDemoPrincipalSwitching } from './core/demo-session.service';

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