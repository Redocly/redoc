import { NgModule, provide } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { BrowserModule } from '@angular/platform-browser';

import { Redoc } from './components/Redoc/redoc';
import { OptionsService, RedocEventsService, MenuService,
  ScrollService, Hash, WarningsService } from './services/index';
import { SpecManager } from './utils/SpecManager';

export const optionsService = new OptionsService(new BrowserDomAdapter());

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ Redoc ],
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
