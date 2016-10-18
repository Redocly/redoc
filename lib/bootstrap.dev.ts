import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

export function bootstrapRedoc() {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}
