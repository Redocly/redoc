import { render } from 'react-dom';
import * as React from 'react';

import { RedocStandalone } from './components/Redoc';

export * from './components';
export * from './services';

export function init(specOrSpecUrl: string | any, options?: any, element?: Element) {
  render(
    React.createElement(
      RedocStandalone,
      {
        specOrSpecUrl,
      },
      [],
    ),
    element || document.querySelector('redoc'),
  );
}
