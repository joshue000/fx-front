import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { version } from '../package.json';

console.log(`Welcome to FX-Front v${version}`);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
