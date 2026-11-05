import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';

import type { ReactNode } from 'react';
import type { MarkdownAdapter } from '../contexts/markdownAdapter.js';

import { prepareApiDocs } from '../RedocStandalone.js';
import { RedoclyApiDocs } from '../RedoclyApiDocs.js';
import { RedocTelemetry } from '../telemetry/RedocTelemetry.js';
import { reportError, setErrorSender } from '../telemetry/reportError.js';

const SPEC = {
  openapi: '3.1.0',
  info: { title: 'Build errors', version: '1.0.0' },
  paths: {},
};

const markdownAdapter: MarkdownAdapter = {
  parse: (source) => source,
  render: () => null as ReactNode,
};

describe('build errors reach telemetry', () => {
  afterEach(() => {
    cleanup();
    setErrorSender(undefined);
    vi.restoreAllMocks();
  });

  it('sends store.buildErrors at mount and later reports live', async () => {
    const sendErrorMessage = vi.spyOn(RedocTelemetry.prototype, 'sendErrorMessage');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const prepared = await prepareApiDocs({ spec: structuredClone(SPEC) });
    const store = {
      ...prepared.store,
      buildErrors: [{ id: 'buildItem', name: 'TypeError', message: 'n is not iterable' }],
    };

    await act(async () => {
      render(
        <RedoclyApiDocs
          items={prepared.items}
          store={store}
          options={{ ...prepared.options, disableTelemetry: true }}
          basePath="/"
          markdownAdapter={markdownAdapter}
        />,
      );
    });

    expect(sendErrorMessage).toHaveBeenCalledTimes(1);
    expect(sendErrorMessage).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'buildItem',
        details: expect.objectContaining({ name: 'TypeError' }),
      }),
    ]);

    reportError('allOfMerge', new RangeError('later'));
    expect(sendErrorMessage).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: 'allOfMerge' }),
    ]);
  });
});
