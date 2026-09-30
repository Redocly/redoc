import { describe, expect, it } from 'vitest';
import { render, type RenderResult } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import { type GlobalStoreAtom, globalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType, Document, SchemaNode } from '../../../../types/schema.js';

import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { schemaProcessor } from '../../../../services/schema/schemaProcessor.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';
import { ArrayRenderer } from '../ArrayRenderer.js';

const emptyDoc = {
  openapi: '3.1.0',
  info: { title: '', version: '1.0' },
  paths: {},
  components: { schemas: {} },
} as Document;

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderArray(property: PropertyType, fieldParentsName: string[]): RenderResult {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    basePath: '',
    schemasExpansionLevel: 10,
  });
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options,
    replayDefinition: null,
  });

  return render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ArrayRenderer property={property} level={2} fieldParentsName={fieldParentsName} />
        </MarkdownAdapterProvider>
      </Provider>
    </MemoryRouter>,
  );
}

function process(schema: SchemaNode): PropertyType {
  return schemaProcessor(schema, emptyDoc);
}

describe('ArrayRenderer — documented primitive items row', () => {
  it('renders documented primitive items as an `owners.[i]` row without the [] marker', () => {
    const property = process({
      type: 'array',
      minItems: 1,
      maxItems: 20,
      description: 'Description for property.',
      items: {
        type: 'string',
        maxLength: 256,
        pattern: '^\\S+@\\S+$',
        description: 'Sibling description for items.',
        example: 'kuku.test',
        'x-original-ref': '#/components/schemas/AclGroup',
      },
    });

    const { container, getByText } = renderArray(property, ['owners']);

    expect(container.textContent?.includes('owners.\u200B[i]')).toBe(true);
    expect(container.textContent?.includes('owners[]')).toBe(false);
    expect(getByText('string, <= 256 characters')).toBeInTheDocument();
    expect(getByText(/AclGroup/)).toBeInTheDocument();
    expect(getByText('Sibling description for items.')).toBeInTheDocument();
    expect(getByText('"kuku.test"')).toBeInTheDocument();
  });

  it('renders the nested array own row with its type and constraints', () => {
    const property = process({
      type: 'array',
      maxItems: 5,
      items: {
        type: 'array',
        maxItems: 10,
        items: {
          type: 'string',
          maxLength: 64,
          pattern: '^[0-9a-f-]+$',
          description: 'Inner primitive item description.',
        },
      },
    });

    const { container, getByText } = renderArray(property, ['matrix']);

    // the middle array keeps its own row instead of being skipped
    expect(container.textContent?.includes('matrix.\u200B[i]')).toBe(true);
    expect(getByText('Array of strings, <= 10 items')).toBeInTheDocument();
    // the documented inner items render one level deeper
    expect(container.textContent?.includes('matrix.\u200B[i].\u200B[i]')).toBe(true);
    expect(getByText('string, <= 64 characters')).toBeInTheDocument();
    expect(getByText('Inner primitive item description.')).toBeInTheDocument();
  });

  it('indexes tuple rows on the parent name without the [] marker', () => {
    const property = process({
      type: 'array',
      example: ['data.default.owners@opendes.testing.slb.com'],
      prefixItems: [
        { type: 'string', description: 'Sibling description for items 111.' },
        { type: 'number', description: 'Description for second item. 222.' },
      ],
      items: { type: 'string', description: 'Description for additional items.' },
    });

    const { container, getByText } = renderArray(property, ['owners']);

    expect(container.textContent?.includes('owners.\u200B[0]')).toBe(true);
    expect(container.textContent?.includes('owners.\u200B[1]')).toBe(true);
    expect(container.textContent?.includes('owners.\u200B[2...]')).toBe(true);
    expect(container.textContent?.includes('owners[]')).toBe(false);
    expect(getByText('Sibling description for items 111.')).toBeInTheDocument();
    // the tuple example is distributed to the item rows
    expect(getByText('"data.default.owners@opendes.testing.slb.com"')).toBeInTheDocument();
  });
});
