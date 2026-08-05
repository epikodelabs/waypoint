import {
  type BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { App } from './app/app';

export default (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);
