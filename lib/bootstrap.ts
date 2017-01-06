import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../compiled/lib/app.module.ngfactory';

export function bootstrapRedoc() {
  return platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
}
