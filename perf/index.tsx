import * as React from 'react';
import { render } from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import { Redoc, RedocProps } from '../src/components';
import { AppStore } from '../src/services/AppStore';

const renderRoot = (Component: typeof Redoc, props: RedocProps) =>
  render(
    <AppContainer>
      <Component {...props} />
    </AppContainer>,
    document.getElementById('example'),
  );

const props = { store: new AppStore() };

props.store.spec.parser.load('big-swagger.json').then(() => {
  const t0 = performance.now();
  renderRoot(Redoc, props);
  var t1 = performance.now();
  console.log({ time: t1 - t0 });
});
