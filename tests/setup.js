'use strict';

import {setBaseTestProviders} from '@angular/core/testing';

import {
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';


setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, [TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS]);
