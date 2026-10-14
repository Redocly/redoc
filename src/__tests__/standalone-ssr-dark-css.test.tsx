import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';

import { RedoclyApiDocsStandalone } from '../RedoclyApiDocsStandalone.js';
import { prepareApiDocs } from '../RedocStandalone.js';

const definition = {
  openapi: '3.1.0',
  info: { title: 'SSR CSS Probe API', version: '1.0.0' },
  paths: {},
};

describe('server-rendered style tags', () => {
  // The PrePaintColorModeScript only adds the class on <html>; the dark
  // variables must already be in the SSR <head> for that to paint dark.
  it('include the :root.dark rules', async () => {
    const prepared = await prepareApiDocs({ spec: definition, basePath: '/' });
    const sheet = new ServerStyleSheet();
    renderToString(
      sheet.collectStyles(
        createElement(
          MemoryRouter,
          null,
          createElement(RedoclyApiDocsStandalone, {
            items: prepared.items,
            store: prepared.store,
            basePath: '/',
            options: prepared.options,
            telemetryConfig: { disabled: true },
            spec: prepared.document,
          }),
        ),
      ),
    );

    expect(sheet.getStyleTags()).toContain(':root.dark{');
  });
});
