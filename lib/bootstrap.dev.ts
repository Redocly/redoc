import { NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

export function bootstrapRedoc(): Promise<NgModuleRef<AppModule>> {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}
