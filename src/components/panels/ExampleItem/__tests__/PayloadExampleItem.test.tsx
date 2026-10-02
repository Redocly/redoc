import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type * as ExampleItemHooks from '../hooks.js';
import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PayloadExamplesPanelItem } from '../../../../types/content.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { PayloadExampleItem } from '../PayloadExampleItem.js';
import { useSchemaVariantSelection } from '../hooks.js';

vi.mock('../../styled.js', () => ({
  CodeBlockPanel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../selectors.js', () => ({
  MediaTypeSelector: () => null,
  ExampleSelector: () => null,
  ExampleDescription: () => null,
  PayloadDisplay: () => null,
  VariantPicker: () => null,
  PanelDropdownSelect: () => null,
}));

// Passthrough wrap so tests can assert which schema id (or undefined) reaches
// the variant-selection hook without changing its behavior.
vi.mock('../hooks.js', async (importOriginal) => {
  const actual = await importOriginal<typeof ExampleItemHooks>();
  return { ...actual, useSchemaVariantSelection: vi.fn(actual.useSchemaVariantSelection) };
});

vi.mock('../../../ItemContent/hooks.js', () => ({
  useExampleKeyFromHash: vi.fn(),
  useResolvedExamples: () => [{}],
  useExampleEntries: () => [],
}));

function renderPayloadExampleItem(node: PayloadExamplesPanelItem) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: {
      schemaStore: {},
      exampleStore: {
        'ex-1': { id: 'ex-1', value: {} },
        'ex-2': { id: 'ex-2', value: {} },
      },
      securitySchemeStore: {},
    },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  } as GlobalStoreAtom);

  return render(
    <Provider store={jotaiStore}>
      <PayloadExampleItem node={node} />
    </Provider>,
  );
}

describe('PayloadExampleItem variant picker gating', () => {
  it('skips the variant selection when the payload has authored examples', () => {
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      schemaId: 'schema-payload',
      exampleIds: ['ex-1', 'ex-2'],
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);

    expect(vi.mocked(useSchemaVariantSelection)).toHaveBeenLastCalledWith(undefined);
  });

  it('resolves the variant selection for a schema-only payload', () => {
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      schemaId: 'schema-payload',
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);

    expect(vi.mocked(useSchemaVariantSelection)).toHaveBeenLastCalledWith('schema-payload');
  });
});
