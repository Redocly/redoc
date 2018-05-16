/* tslint:disable:no-implicit-dependencies */

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import * as yaml from 'yaml-js';
import { createStore, Redoc } from '../';

import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('SSR', () => {
  it('should render in SSR mode', async () => {
    const spec = yaml.load(readFileSync(resolve(__dirname, '../../demo/openapi.yaml')));
    const store = await createStore(spec, '');
    expect(() => {
      renderToString(<Redoc store={store} />);
    }).not.toThrow();
  });
});
