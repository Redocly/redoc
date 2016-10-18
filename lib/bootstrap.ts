import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './app.module.ngfactory';

export function bootstrapRedoc() {
  return platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
}
