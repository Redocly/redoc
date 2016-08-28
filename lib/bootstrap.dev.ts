import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RedocModule } from './redoc.module';

export function bootstrapRedoc() {
  return platformBrowserDynamic().bootstrapModule(RedocModule);
}
