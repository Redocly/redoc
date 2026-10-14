import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { SchemaEntry } from '../../../types/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../markdocAdapter.js';
import { SchemaDefinition } from '../SchemaDefinition.js';

const DESCRIPTION = 'unique-description-marker';
const SCHEMA_NAME = 'Target';

function renderSchemaDefinition(
  data: Record<string, unknown> | null,
  schemaRef = `#/components/schemas/${SCHEMA_NAME}`,
  extraSchemas: Record<string, Record<string, unknown>> = {},
  itemId?: string,
) {
  const schemaStore: GlobalStoreAtom['store']['schemaStore'] = {};
  for (const [name, extra] of Object.entries(extraSchemas)) {
    const id = `components/schemas/${name}`;
    schemaStore[id] = { id, kind: 'json-schema', data: extra };
  }
  if (data) {
    const entry: SchemaEntry = {
      id: `components/schemas/${SCHEMA_NAME}`,
      kind: 'json-schema',
      data,
    };
    schemaStore[`components/schemas/${SCHEMA_NAME}`] = entry;
  }

  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore,
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

  const result = render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={itemId}>
            <SchemaDefinition schemaRef={schemaRef} />
          </ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </Provider>
    </MemoryRouter>,
  );
  return { ...result, store: jotaiStore };
}

describe('SchemaDefinition description rendering', () => {
  it('renders description exactly once for a primitive scalar schema', () => {
    renderSchemaDefinition({ type: 'string', description: DESCRIPTION });
    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it('renders description exactly once for an enum primitive schema', () => {
    renderSchemaDefinition({
      type: 'string',
      enum: ['a', 'b', 'c'],
      description: DESCRIPTION,
    });
    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it('renders description exactly once for an object schema with no properties', () => {
    renderSchemaDefinition({ type: 'object', description: DESCRIPTION });
    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it('renders description exactly once for an object schema with properties', () => {
    renderSchemaDefinition({
      type: 'object',
      description: DESCRIPTION,
      properties: { id: { type: 'string' } },
    });
    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it('renders description exactly once for an array schema', () => {
    renderSchemaDefinition({
      type: 'array',
      description: DESCRIPTION,
      items: { type: 'string' },
    });
    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it('does not render the description text when the schema has none', () => {
    renderSchemaDefinition({ type: 'string' });
    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument();
  });

  it('renders nothing when the schemaRef does not resolve to a stored entry', () => {
    const { container } = renderSchemaDefinition(null, '#/components/schemas/Missing');
    expect(container.innerHTML).toBe('');
  });

  it('shows the schema name in the type label when the schema lacks an explicit title', () => {
    renderSchemaDefinition({ type: 'string', description: DESCRIPTION });
    expect(screen.getByText(`(${SCHEMA_NAME})`)).toBeInTheDocument();
  });

  it('renders description above the type row for structural schemas', () => {
    renderSchemaDefinition({
      type: 'object',
      description: DESCRIPTION,
      properties: { id: { type: 'string' } },
    });
    const descriptionNode = screen.getByText(DESCRIPTION);
    const typeRow = screen.getByText('id');
    expect(
      descriptionNode.compareDocumentPosition(typeRow) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe('SchemaDefinition variant state', () => {
  it('stores the discriminator selection under the response sample state key', () => {
    const itemId = 'schemas-beverage';
    const { store } = renderSchemaDefinition(
      {
        oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
        discriminator: {
          propertyName: 'kind',
          mapping: { coffee: '#/components/schemas/Coffee', tea: '#/components/schemas/Tea' },
        },
      },
      `#/components/schemas/${SCHEMA_NAME}`,
      {
        Coffee: {
          type: 'object',
          properties: { kind: { type: 'string' }, shots: { type: 'integer' } },
        },
        Tea: {
          type: 'object',
          properties: { kind: { type: 'string' }, steepSeconds: { type: 'integer' } },
        },
      },
      itemId,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'tea' }));

    expect(screen.getByText('steepSeconds')).toBeInTheDocument();
    const state = store.get(itemStoreAtom(`${itemId}#schema=components/schemas/${SCHEMA_NAME}`));
    expect(state.activeDiscriminator['kind']).toBe(1);
  });
});
