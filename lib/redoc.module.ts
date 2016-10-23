import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Redoc, SecurityDefinitions, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES } from './shared/components/index';
import { REDOC_PIPES } from './utils/pipes';
import { CustomErrorHandler } from './utils/'

import { OptionsService, MenuService,
  ScrollService, Hash, WarningsService, AppStateService } from './services/';
import { SpecManager } from './utils/spec-manager';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES],
  bootstrap: [ Redoc ],
  entryComponents: [SecurityDefinitions],
  providers: [
    SpecManager,
    ScrollService,
    Hash,
    MenuService,
    WarningsService,
    OptionsService,
    AppStateService,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ],
  exports: [Redoc]
})
export class RedocModule {
}

export { Redoc, SpecManager };
