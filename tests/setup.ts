'use strict';

import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import { OptionsService, RedocEventsService, MenuService,
  ScrollService, Hash, WarningsService } from '../lib/services/index';
import { SpecManager } from '../lib/utils/SpecManager';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { REDOC_PIPES } from '../lib/utils/pipes';
import { REDOC_COMMON_DIRECTIVES } from '../lib/shared/components/index';
import { REDOC_DIRECTIVES } from '../lib/components/index';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

beforeEach( () => {
  TestBed.configureTestingModule({
    providers: [
      BrowserDomAdapter,
      SpecManager,
      BrowserDomAdapter,
      RedocEventsService,
      ScrollService,
      Hash,
      MenuService,
      WarningsService,
      OptionsService
    ],
    declarations: [REDOC_PIPES, REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES]
  });
});
