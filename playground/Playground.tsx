import React from 'react';

import type { ReactElement } from 'react';
import type { LayoutVariant } from '@redocly/config';

import { RedoclyOpenAPIDocs } from '../src/components/RedoclyOpenAPIDocs/RedoclyOpenAPIDocs.js';
import { AppProvider } from '../src/components/RedoclyOpenAPIDocs/RedoclyOpenAPIDocsStandalone.js';

export function Playground(): ReactElement {
  return (
    <React.StrictMode>
      <AppProvider
        definitionUrl="./openapi/museum.yaml"
        options={{
          layout: 'three-panel' as LayoutVariant,
          downloadUrls: [
            {
              title: 'Download Museum OpenAPI description',
              url: './openapi/museum.yaml',
            },
            {
              title: 'Download Petstore OpenAPI description',
              url: './openapi/petstore.yaml',
            },
          ],
          showExtensions: true,
        }}
      >
        <RedoclyOpenAPIDocs withCommonStyles={true} />
      </AppProvider>
    </React.StrictMode>
  );
}

export default Playground;
