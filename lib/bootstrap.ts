import { NgModuleRef } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app.module';
// @ts-ignore
import { AppModuleNgFactory } from '../compiled/lib/app.module.ngfactory';

export function bootstrapRedoc():Promise<NgModuleRef<AppModule>> {
  return platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
}
