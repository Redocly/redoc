import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Redoc, createStore } from '../';
var yaml = require('yaml-js');

import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('SSR', () => {
  it('should render in SSR mode', async () => {
    (global as any).__REDOC_DEV__ = true;
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../demo/openapi.yaml')));
    const store = await createStore(spec, '');
    expect(() => {
      renderToString(<Redoc store={store} />);
    }).not.toThrow();

    delete (global as any).__REDOC_DEV__;
  });
});
