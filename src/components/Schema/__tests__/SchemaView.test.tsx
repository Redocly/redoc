import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { OpenAPISchema } from '../../../types/openapi.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { SchemaView } from '../SchemaView.js';
import type { Node } from '@markdoc/markdoc';
import type { ApiDocsOptions } from '../../../types/options.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderSchemaView(schema: OpenAPISchema, schemasExpansionLevel?: number | 'all'): void {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
    schemasExpansionLevel,
    markdownParser: function (
      _: string,
      __?: Partial<Pick<ApiDocsOptions, 'sanitize' | 'unstable_hooks'>>,
    ): Node | Node[] | undefined {
      throw new Error('Function not implemented.');
    },
  });
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options,
    replayDefinition: null,
  });

  render(
    <MemoryRouter>
      <JotaiProvider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <SchemaView schema={schema} expandByDefault />
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
}

describe('SchemaView default level', () => {
  it('renders the collapsible nesting chrome for a oneOf object variant without an explicit level', () => {
    // Sections that omit `level` (AsyncAPI messages, MCP tools, fields) must
    // render the same nesting chrome as sections passing `level={1}`.
    renderSchemaView({
      type: 'object',
      properties: {
        actor: {
          oneOf: [{ type: 'object', properties: { id: { type: 'string' } } }, { type: 'null' }],
        },
      },
    } as OpenAPISchema);

    expect(screen.getByText(/^show/i)).toBeInTheDocument();
  });
});

describe('SchemaView single-element tuple arrays', () => {
  it('renders a single-element items-tuple array as a positional [0] entry', () => {
    renderSchemaView(
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: [
              {
                type: 'object',
                properties: {
                  object: { type: 'string', const: 'api_function' },
                  status: { type: 'integer' },
                },
              },
            ],
            additionalItems: false,
            minItems: 1,
            maxItems: 1,
          },
        },
      } as OpenAPISchema,
      'all',
    );

    expect(screen.getByText('[0]')).toBeInTheDocument();
  });
});
