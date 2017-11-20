import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import DevTools from 'mobx-react-devtools';

import { Redoc, RedocProps } from '../../src/components/Redoc/Redoc';
import { AppStore } from '../../src/services/AppStore';
import { loadAndBundleSpec } from '../../src/utils/loadAndBundleSpec';

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
const swagger = window.location.search.indexOf('swagger') > -1; //compatibility mode ?

const specUrl = swagger ? 'swagger.yaml' : big ? 'big-openapi.json' : 'openapi.yaml';

let store;
const options = {};

async function init() {
  const spec = await loadAndBundleSpec(specUrl);
  store = new AppStore(spec, specUrl);
  renderRoot(Redoc, { store: store, options });
}

init();

if (module.hot) {
  const reload = (reloadStore = false) => () => {
    if (reloadStore) {
      // create a new Store
      store.dispose();

      const state = store.toJS();
      store = AppStore.fromJS(state);
    }

    renderRoot(Redoc, { store: store, options });
  };

  module.hot.accept(['../../src/components/Redoc/Redoc'], reload());
  module.hot.accept(['../../src/services/AppStore'], reload(true));
}
