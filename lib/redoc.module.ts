import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Redoc, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES } from './shared/components/index';
import { REDOC_PIPES } from './utils/pipes';

import { OptionsService, RedocEventsService, MenuService,
  ScrollService, Hash, WarningsService } from './services/index';
import { SpecManager } from './utils/SpecManager';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES],
  bootstrap: [ Redoc ],
  providers: [
    SpecManager,
    RedocEventsService,
    ScrollService,
    Hash,
    MenuService,
    WarningsService,
    OptionsService
  ],
  exports: [Redoc]
})
export class RedocModule {
}

export { Redoc, SpecManager };
