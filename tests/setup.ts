'use strict';

import {setBaseTestProviders} from '@angular/core/testing';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { OptionsService, RedocEventsService} from '../lib/services/index';
import { provide } from '@angular/core';

import {
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';

setBaseTestProviders(
  [
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    provide(BrowserDomAdapter, {useClass: BrowserDomAdapter}),
    provide(OptionsService, {useClass: OptionsService}),
    provide(RedocEventsService, {useClass: RedocEventsService})
  ],
  [TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS]);
