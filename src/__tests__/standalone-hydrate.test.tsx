import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { waitFor } from '@testing-library/react';

import { RedoclyApiDocsStandalone } from '../RedoclyApiDocsStandalone.js';
import { prepareApiDocs } from '../RedocStandalone.js';
import { hydrate } from '../standalone.js';

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});

const definition = {
  openapi: '3.1.0',
  info: { title: 'Hydrate Probe API', version: '1.0.0' },
  paths: {
    '/things': {
      get: {
        operationId: 'listThings',
        summary: 'List the things',
        responses: { '200': { description: 'OK' } },
      },
    },
  },
};

/** The server pass the CLI static page performs: post-resolution tree in a memory router. */
async function renderServerMarkup(): Promise<string> {
  const prepared = await prepareApiDocs({ spec: definition, basePath: '/' });
  return renderToString(
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
  );
}

describe('standalone hydrate()', () => {
  let host: HTMLElement;
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    host = document.createElement('redoc');
    document.body.appendChild(host);
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    consoleError.mockRestore();
    host.remove();
    // The published theme's useActiveSectionId leaves a 10ms initial-scan timer
    // running; let it fire while jsdom still exists or it crashes the run.
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it('adopts server-rendered markup instead of replacing it', async () => {
    host.innerHTML = await renderServerMarkup();

    const serverNode = host.querySelector('.menu-content');
    expect(serverNode).not.toBeNull();

    // `history` on both sides keeps hrefs identical — no mismatch recovery
    await hydrate(definition, { router: 'history', disableTelemetry: true }, host);

    await waitFor(() => expect(host.textContent).toContain('List the things'));
    await waitFor(() => expect(host.textContent).toContain('Hydrate Probe API'));

    expect(host.contains(serverNode)).toBe(true);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('client-renders into an empty element when no server markup exists', async () => {
    await hydrate(definition, { router: 'history', disableTelemetry: true }, host);
    await waitFor(() => expect(host.textContent).toContain('List the things'));
  });

  it('rejects with the same directed error as init when no element exists', async () => {
    await expect(hydrate(definition, {}, null)).rejects.toThrow(
      '"element" argument is not provided and <redoc> tag is not found on the page',
    );
  });
});
