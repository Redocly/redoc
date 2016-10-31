import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Redoc, SecurityDefinitions, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES, DynamicNg2Wrapper } from './shared/components/index';
import { REDOC_PIPES, KeysPipe } from './utils/pipes';
import { CustomErrorHandler } from './utils/'

import {
  OptionsService,
  MenuService,
  ScrollService,
  Hash,
  WarningsService,
  AppStateService,
  ComponentParser,
  ContentProjector,
  COMPONENT_PARSER_ALLOWED } from './services/';
import { SpecManager } from './utils/spec-manager';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES ],
  bootstrap: [ Redoc ],
  entryComponents: [ SecurityDefinitions, DynamicNg2Wrapper ],
  providers: [
    SpecManager,
    ScrollService,
    Hash,
    MenuService,
    WarningsService,
    OptionsService,
    AppStateService,
    ComponentParser,
    ContentProjector,
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: COMPONENT_PARSER_ALLOWED, useValue: { 'security-definitions': SecurityDefinitions} }
  ],
  exports: [Redoc]
})
export class RedocModule {
}

export { Redoc, SpecManager };
