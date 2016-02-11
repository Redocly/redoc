'use strict';

import {setBaseTestProviders} from 'angular2/testing';

import {
  TEST_BROWSER_PLATFORM_PROVIDERS,
  TEST_BROWSER_APPLICATION_PROVIDERS
} from 'angular2/platform/testing/browser';
import {

  ELEMENT_PROBE_PROVIDERS_PROD_MODE
} from 'angular2/platform/browser';
setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, [TEST_BROWSER_APPLICATION_PROVIDERS, ELEMENT_PROBE_PROVIDERS_PROD_MODE]);
