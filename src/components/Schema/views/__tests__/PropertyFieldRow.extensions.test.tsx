import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { RenderResult } from '@testing-library/react';
import type { RedocConfig } from '@redocly/config';
import type { PropertyType } from '../../../../types/schema.js';
import type { ApiStore } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { PropertyFieldRow } from '../PropertyFieldRow.js';

const emptyStore: ApiStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
};

const property: PropertyType = {
  type: 'string',
  extensions: {
    'x-foo': 'allowed value',
    'x-bar': 'other value',
  },
};

function renderRow(showExtensions: RedocConfig['showExtensions']): RenderResult {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
    showExtensions,
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
        <PropertyFieldRow name="field" property={property} level={0} />
      </Provider>
    </MemoryRouter>,
  );
}

describe('PropertyFieldRow vendor extensions', () => {
  it('shows only the listed extensions when showExtensions is an allowlist', () => {
    const { getByText, queryByText } = renderRow(['x-foo']);

    expect(getByText('foo:')).toBeTruthy();
    expect(queryByText('bar:')).toBeNull();
  });

  it('shows every non-reserved extension when showExtensions is true', () => {
    const rendered = renderRow(true);

    expect(rendered.getByText('foo:')).toBeTruthy();
    expect(rendered.getByText('bar:')).toBeTruthy();
  });

  it('shows nothing when showExtensions is false', () => {
    const { queryByText } = renderRow(false);

    expect(queryByText('foo:')).toBeNull();
    expect(queryByText('bar:')).toBeNull();
  });
});
