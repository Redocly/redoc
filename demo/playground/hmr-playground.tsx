import * as React from 'react';
import { render } from 'react-dom';
import type { RedocRawOptions } from '../../src/services/RedocNormalizedOptions';
import RedocStandalone from './hot';

const big = window.location.search.indexOf('big') > -1;
const swagger = window.location.search.indexOf('swagger') > -1;

const userUrl = window.location.search.match(/url=(.*)$/);

const specUrl =
  (userUrl && userUrl[1]) || (swagger ? 'swagger.yaml' : big ? 'big-openapi.json' : 'openapi.yaml');

const options: RedocRawOptions = { nativeScrollbars: false, maxDisplayedEnumValues: 3 };

render(<RedocStandalone specUrl={specUrl} options={options} />, document.getElementById('example'));
