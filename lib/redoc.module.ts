import './vendor';

import { NgModule, ErrorHandler, APP_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecManager } from './utils/spec-manager';

import { Redoc, SecurityDefinitions, Operation, REDOC_DIRECTIVES } from './components/index';
import { REDOC_COMMON_DIRECTIVES, DynamicNg2Wrapper, DropDown } from './shared/components/index';
import { REDOC_PIPES } from './utils/pipes';
import { CustomErrorHandler } from './utils/'
import { LazyTasksService } from './shared/components/LazyFor/lazy-for';

import {
  OptionsService,
  Options,
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
  MenuItem,
  COMPONENT_PARSER_ALLOWED } from './services/';

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
Options,
AppStateService,
ComponentParser,
ContentProjector,
MenuService,
SearchService,
SchemaHelper,
LazyTasksService,
MenuItem,
Marker, DropDown };
