import { platformBrowser } from '@angular/platform-browser';
import { RedocModuleNgFactory } from './redoc.module.ngfactory';

export function bootstrapRedoc() {
  return platformBrowser().bootstrapModuleFactory(RedocModuleNgFactory);
}
