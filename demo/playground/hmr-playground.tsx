import * as React from 'react';
import { createRoot } from 'react-dom/client';
import type { RedocRawOptions } from '../../src/services/RedocNormalizedOptions';
import { RedocStandalone } from '../../src';

const big = window.location.search.indexOf('big') > -1;
const swagger = window.location.search.indexOf('swagger') > -1;

const userUrl = window.location.search.match(/url=(.*)$/);

const specUrl =
  (userUrl && userUrl[1]) || (swagger ? 'museum.yaml' : big ? 'big-openapi.json' : 'museum.yaml');

const options: RedocRawOptions = {
  nativeScrollbars: false,
  maxDisplayedEnumValues: 3,
  schemaDefinitionsTagName: 'schemas',
};

const container = document.getElementById('example');
const root = createRoot(container!);
root.render(<RedocStandalone specUrl={specUrl} options={options} />);
