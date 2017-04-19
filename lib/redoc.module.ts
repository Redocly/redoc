import { NgModule, ErrorHandler, APP_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Redoc, SecurityDefinitions, Operation, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES, DynamicNg2Wrapper } from './shared/components/index';
import { REDOC_PIPES } from './utils/pipes';
import { CustomErrorHandler } from './utils/'
import { LazyTasksService } from './shared/components/LazyFor/lazy-for';

import {
  OptionsService,
  MenuService,
  ScrollService,
  Hash,
  WarningsService,
  AppStateService,
  ComponentParser,
  ContentProjector,
  Marker,
  SchemaHelper,
  SearchService,
  COMPONENT_PARSER_ALLOWED } from './services/';

import { SpecManager } from './utils/spec-manager';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES ],
  bootstrap: [ Redoc ],
  entryComponents: [ SecurityDefinitions, DynamicNg2Wrapper, Operation ],
  providers: [
    ScrollService,
    Hash,
    WarningsService,
    OptionsService,
    AppStateService,
    ComponentParser,
    ContentProjector,
    { provide: APP_ID, useValue: 'redoc' },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: COMPONENT_PARSER_ALLOWED, useValue: { 'security-definitions': SecurityDefinitions} }
  ],
  exports: [Redoc, REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES, REDOC_PIPES]
})
export class RedocModule {
}

export { Redoc, SpecManager, ScrollService,
Hash,
WarningsService,
OptionsService,
AppStateService,
ComponentParser,
ContentProjector,
MenuService,
SearchService,
SchemaHelper,
LazyTasksService,
Marker };
