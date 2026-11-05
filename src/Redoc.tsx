import { memo } from 'react';

import type { ReactElement } from 'react';
import type { RedoclyApiDocsProps } from './RedoclyApiDocs.js';

import { RedoclyApiDocsComponent } from './RedoclyApiDocs.js';
import { RedocRoot } from './components/RedocRoot.js';
import { PortalScope } from './components/common/BodyPortal.js';
import { PrePaintColorModeScript } from './components/PrePaintColorModeScript.js';
import { compose } from './utils/compose.js';
import { withRouter } from './hoc/withRouter.js';
import { withStoreProvider } from './hoc/withStoreProvider.js';

const RedocComponent = (props: RedoclyApiDocsProps): ReactElement => (
  <RedocRoot>
    <PrePaintColorModeScript />
    <PortalScope>
      <RedoclyApiDocsComponent {...props} />
    </PortalScope>
  </RedocRoot>
);

export const Redoc = compose(withStoreProvider, withRouter, memo)(RedocComponent);
