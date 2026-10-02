import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';

import { init } from '../standalone.js';

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});

const definition = {
  openapi: '3.1.0',
  info: { title: 'Inline definition object', version: '9.9.9' },
  paths: {
    '/ping': {
      get: {
        operationId: 'ping',
        summary: 'Ping from an inline object',
        responses: { '200': { description: 'Pong.' } },
      },
    },
  },
};

const DOWNLOAD_URLS = [{ title: 'Bespoke download', url: '/specs/cafe/openapi.yaml' }];

describe('standalone init()', () => {
  let host: HTMLElement;
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    host = document.createElement('redoc');
    document.body.appendChild(host);
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    consoleError.mockRestore();
    document.body.innerHTML = '';
    // The published theme's useActiveSectionId leaves a 10ms initial-scan timer
    // running; let it fire while jsdom still exists or it crashes the run.
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it('renders into an explicit container that is not the <redoc> element', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    init(definition, { disableTelemetry: true }, container);

    await waitFor(() => expect(container.textContent).toContain('Inline definition object'));
    expect(host.innerHTML).toBe('');
  });

  it('carries object-valued options that no attribute could express', async () => {
    init(definition, { disableTelemetry: true, downloadUrls: DOWNLOAD_URLS }, host);

    await waitFor(() => expect(host.textContent).toContain('Bespoke download'));
  });

  it('throws the directed error when no element is given and no <redoc> tag exists', () => {
    host.remove();

    expect(() => init(definition, {}, null)).toThrow(
      '"element" argument is not provided and <redoc> tag is not found on the page',
    );
  });

  describe('hash-router deep links', () => {
    afterEach(() => {
      window.location.hash = '';
    });

    it('restores a separator that was percent-encoded in transit', async () => {
      window.location.hash = '#/ping%23ping/request';

      init(definition, { disableTelemetry: true }, host);

      expect(window.location.hash).toBe('#/ping#ping/request');
      await waitFor(() => expect(host.textContent).toContain('Ping from an inline object'));
    });

    it('restores it again when a mangled link lands on an open page', async () => {
      init(definition, { disableTelemetry: true }, host);
      await waitFor(() => expect(host.textContent).toContain('Inline definition object'));

      window.location.hash = '#/ping%23ping/request';

      await waitFor(() => expect(window.location.hash).toBe('#/ping#ping/request'));
    });
  });

  describe('option precedence', () => {
    it('lets an attribute override the same option passed to init', async () => {
      host.setAttribute('hide-download-buttons', 'false');

      init(
        definition,
        { disableTelemetry: true, downloadUrls: DOWNLOAD_URLS, hideDownloadButtons: true },
        host,
      );

      await waitFor(() => expect(host.textContent).toContain('Bespoke download'));
    });

    it('applies the init option when no attribute contradicts it', async () => {
      init(
        definition,
        { disableTelemetry: true, downloadUrls: DOWNLOAD_URLS, hideDownloadButtons: true },
        host,
      );

      await waitFor(() => expect(host.textContent).toContain('Inline definition object'));
      expect(host.textContent).not.toContain('Bespoke download');
    });
  });

  describe('download panel defaults', () => {
    const SPEC_URL = 'http://localhost/specs/inline.json';

    beforeEach(() => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(() =>
          Promise.resolve(
            new Response(JSON.stringify(definition), {
              headers: { 'content-type': 'application/json' },
            }),
          ),
        ),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('offers the spec URL for download when downloadUrls is not configured', async () => {
      init(SPEC_URL, { disableTelemetry: true }, host);

      await waitFor(() => expect(host.textContent).toContain('inline.json'));
    });

    it('keeps explicit downloadUrls instead of the spec URL', async () => {
      init(SPEC_URL, { disableTelemetry: true, downloadUrls: DOWNLOAD_URLS }, host);

      await waitFor(() => expect(host.textContent).toContain('Bespoke download'));
      expect(host.textContent).not.toContain('inline.json');
    });

    it('renders no download panel for an inline spec without downloadUrls', async () => {
      init(definition, { disableTelemetry: true }, host);

      await waitFor(() => expect(host.textContent).toContain('Inline definition object'));
      expect(host.textContent).not.toContain('Download OpenAPI description');
    });
  });
});
