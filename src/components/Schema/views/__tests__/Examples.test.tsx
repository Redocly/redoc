import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { MarkdownAdapter } from '../../../../contexts/markdownAdapter.js';
import type { ExampleType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { markdocParser } from '../../../markdoc/markdocParser.js';
import { Examples } from '../Examples.js';

const adapter: MarkdownAdapter = {
  parse: (source) => (typeof source === 'string' ? markdocParser(source) : source),
  render: (tree) => (
    <span data-testid="markdown">{String(JSON.stringify(tree).includes('code'))}</span>
  ),
};

function renderExamples(examples: Record<string, ExampleType>): void {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore: {},
      exampleStore: {},
      securitySchemeStore: {},
    },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  });
  render(
    <Provider store={jotaiStore}>
      <MarkdownAdapterProvider value={adapter}>
        <Examples examples={examples} />
      </MarkdownAdapterProvider>
    </Provider>,
  );
}

describe('Examples', () => {
  it('renders an example description as markdown, whether a string or a parsed tree', () => {
    renderExamples({
      parsed: { description: markdocParser('Starts as `pending`.'), value: 'a' },
      raw: { description: 'Starts as `pending`.', value: 'b' },
    });

    expect(screen.getAllByTestId('markdown').map((el) => el.textContent)).toEqual(['true', 'true']);
  });
});
