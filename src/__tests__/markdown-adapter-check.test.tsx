import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { MarkdownAdapter } from '../contexts/markdownAdapter.js';

import { prepareApiDocs } from '../RedocStandalone.js';
import { RedoclyApiDocs } from '../RedoclyApiDocs.js';

const SPEC = {
  openapi: '3.1.0',
  info: { title: 'Cafe', version: '1.0.0', description: 'Order **coffee** online.' },
  paths: {},
};

async function renderDocs(markdownAdapter: unknown): Promise<void> {
  const prepared = await prepareApiDocs({
    spec: structuredClone(SPEC),
    options: { disableTelemetry: true },
  });
  await act(async () => {
    render(
      <RedoclyApiDocs
        items={prepared.items}
        store={prepared.store}
        options={prepared.options}
        basePath="/"
        markdownAdapter={markdownAdapter as MarkdownAdapter}
      />,
    );
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('markdown adapter check at mount', () => {
  it.each([
    [
      'an adapter without `parse`',
      { render: () => null },
      '`markdownAdapter.parse` is not a function',
    ],
    [
      'an adapter without `render`',
      { parse: (source: unknown) => source },
      '`markdownAdapter.render` is not a function',
    ],
  ])('shows one page error naming the problem for %s', async (_, adapter, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await renderDocs(adapter);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong rendering the API documentation',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(message);
  });

  it('renders the documentation with a complete adapter', async () => {
    await renderDocs({
      parse: (source: unknown) => source,
      render: () => <span>rendered description</span>,
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
