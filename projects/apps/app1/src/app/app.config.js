import { provideBrowserGlobalErrorListeners, } from '@angular/core';
import { provideStreamixRouter } from '@epikodelabs/waypoint';
import { routes } from './app.routes';
export const appConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        ...provideStreamixRouter(routes, {
            viewTransitions: true,
        }),
    ],
};
