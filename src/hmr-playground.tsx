import * as React from 'react';
import { render } from 'react-dom';
// import DevTools from 'mobx-react-devtools';

import { AppContainer } from 'react-hot-loader';
import { Redoc, RedocProps } from './components/Redoc';
import { AppStore } from './services/AppStore';

const renderRoot = (Component: typeof Redoc, props: RedocProps) =>
  render(
    <div>
      <AppContainer>
        <Component {...props} />
      </AppContainer>
    </div>,
    document.getElementById('example'),
  );

const big = window.location.search.indexOf('big') > -1;
const props = {
  specUrl: big ? 'big-swagger.json' : 'swagger.yaml',
  store: new AppStore(),
};

renderRoot(Redoc, props);

if (module.hot) {
  const reload = (reloadStore = false) => () => {
    if (reloadStore) {
      // create a new Store
      props.store.dispose();

      const state = props.store.toJS();
      props.store = AppStore.fromJS(state);
    }

    renderRoot(Redoc, props);
  };

  module.hot.accept(['./components/Redoc'], reload());
  module.hot.accept(['./services/AppStore'], reload(true));
}
