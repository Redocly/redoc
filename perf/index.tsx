import * as React from 'react';
import { render } from 'react-dom';

import { Redoc, RedocProps } from '../src/components';
import { AppStore } from '../src/services/AppStore';
import { loadAndBundleSpec } from '../src/utils';

const renderRoot = (Component: typeof Redoc, props: RedocProps) =>
  render(<Component {...props} />, document.getElementById('example'));

async function start() {
  const resolvedSpec = await loadAndBundleSpec('big-openapi.json');
  const t0 = performance.now();
  const store = new AppStore(resolvedSpec, 'big-openapi.json');
  var t1 = performance.now();
  renderRoot(Redoc, { store });
  var t2 = performance.now();

  console.log({
    timings: true,
    'Total Time': t2 - t0,
    'Store Init Time': t1 - t0,
    'Render Time': t2 - t1,
  });
}

start();
