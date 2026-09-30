import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { SchemaEntry } from '../../../types/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../markdocAdapter.js';
import { SchemaDefinition } from '../SchemaDefinition.js';

const DESCRIPTION = 'unique-description-marker';
const SCHEMA_NAME = 'Target';

function renderSchemaDefinition(
  data: Record<string, unknown> | null,
  schemaRef = `#/components/schemas/${SCHEMA_NAME}`,
) {
  const schemaStore: GlobalStoreAtom['store']['schemaStore'] = {};
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
    replayDefinition: null,
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

  return render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <SchemaDefinition schemaRef={schemaRef} />
        </MarkdownAdapterProvider>
      </Provider>
    </MemoryRouter>,
  );
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
