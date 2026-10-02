import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { RenderResult } from '@testing-library/react';
import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { PropertyFieldRow } from '../PropertyFieldRow.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderPropertyFieldRow(property: PropertyType): RenderResult {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
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
        <PropertyFieldRow name="postal_address" property={property} level={0} />
      </Provider>
    </MemoryRouter>,
  );
}

describe('PropertyFieldRow example rendering', () => {
  const objectValue = {
    name: 'John Alfred Smith',
    street: '123 Main Street',
    city: 'San Francisco',
  };

  it('should render object example pretty-printed with JSON highlighting', () => {
    const { getByTestId, getByText } = renderPropertyFieldRow({
      type: 'object',
      example: objectValue,
    });

    expect(getByText('Example:')).toBeInTheDocument();

    const viewer = getByTestId('json-viewer');
    // pretty-printed: keys and values are separate tokens on multiple lines,
    // not a single-line JSON.stringify blob
    expect(viewer.textContent).toContain('"name"');
    expect(viewer.textContent).toContain('"John Alfred Smith"');
    expect(viewer.textContent).toContain('\n');
    // syntax highlighting: token spans styled by the code theme
    expect(viewer.querySelector('.token.string')).not.toBeNull();
  });

  it('should render array example pretty-printed with JSON highlighting', () => {
    const { getByTestId } = renderPropertyFieldRow({
      type: 'Array of strings',
      example: ['79f943e212cce7de21c054a8'],
    });

    const viewer = getByTestId('json-viewer');
    expect(viewer.textContent).toContain('"79f943e212cce7de21c054a8"');
    expect(viewer.querySelector('.token.string')).not.toBeNull();
  });

  it('should keep scalar example values inline without JSON viewer', () => {
    const { getByText, queryByTestId } = renderPropertyFieldRow({
      type: 'string',
      example: '"HRIS-27"',
    });

    expect(getByText('"HRIS-27"')).toBeInTheDocument();
    expect(queryByTestId('json-viewer')).toBeNull();
  });
});
