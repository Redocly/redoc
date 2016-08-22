import { NgModule, provide } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { BrowserModule } from '@angular/platform-browser';

import { Redoc, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES } from './shared/components/index';
import { REDOC_PIPES } from './utils/pipes';

import { OptionsService, RedocEventsService, MenuService,
  ScrollService, Hash, WarningsService } from './services/index';
import { SpecManager } from './utils/SpecManager';

export const optionsService = new OptionsService(new BrowserDomAdapter());

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES],
  bootstrap: [ Redoc ],
  providers: [
    SpecManager,
    BrowserDomAdapter,
    RedocEventsService,
    ScrollService,
    Hash,
    MenuService,
    WarningsService,
    provide(OptionsService, {useValue: optionsService})
  ],
})
export class RedocModule {
}
