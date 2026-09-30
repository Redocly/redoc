import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { SchemaEnumValues } from '../SchemaEnumValues.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderWithMaxEnum(limit: number, values: unknown[]) {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: limit,
    basePath: '',
  });
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options,
    replayDefinition: null,
  });

  return render(
    <Provider store={jotaiStore}>
      <SchemaEnumValues label="Enum:" values={values} />
    </Provider>,
  );
}

describe('SchemaEnumValues', () => {
  it('renders toggle and expands on click', () => {
    const values = ['a', 'b', 'c', 'd'];
    renderWithMaxEnum(2, values);

    expect(screen.getByText('"a"')).toBeInTheDocument();
    expect(screen.getByText('"b"')).toBeInTheDocument();
    expect(screen.queryByText('"c"')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '+2 more' }));

    expect(screen.getByText('"c"')).toBeInTheDocument();
    expect(screen.getByText('"d"')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();
  });

  it('renders all values when limit is zero', () => {
    renderWithMaxEnum(0, ['x', 'y', 'z']);
    expect(screen.getByText('"x"')).toBeInTheDocument();
    expect(screen.getByText('"z"')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
