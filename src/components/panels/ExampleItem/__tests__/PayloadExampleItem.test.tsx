import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type * as ExampleItemHooks from '../hooks.js';
import type { PayloadExamplesPanelItem } from '../../../../types/content.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { PayloadExampleItem } from '../PayloadExampleItem.js';
import { useSchemaVariantSelection } from '../hooks.js';
import { useExampleEntries, useResolvedExamples } from '../../../ItemContent/hooks.js';

vi.mock('../../styled.js', () => ({
  CodeBlockPanel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../selectors.js', () => ({
  MediaTypeSelector: () => null,
  ExampleSelector: ({
    exampleIds,
    onSelect,
  }: {
    exampleIds?: string[];
    onSelect: (idx: number) => void;
  }) =>
    exampleIds?.map((id, idx) => (
      <button key={id} onClick={() => onSelect(idx)}>
        {`select ${id}`}
      </button>
    )),
  ExampleDescription: () => null,
  PayloadDisplay: ({ payload }: { payload: unknown }) => <pre>{JSON.stringify(payload)}</pre>,
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
  useResolvedExamples: vi.fn(() => [{}]),
  useExampleEntries: vi.fn(() => []),
}));

function renderPayloadExampleItem(node: PayloadExamplesPanelItem) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
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
  });

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

describe('PayloadExampleItem example headers', () => {
  it('shows the header values of the selected example above its payload', () => {
    vi.mocked(useExampleEntries).mockReturnValueOnce([
      { id: 'ex-1', value: {}, headers: { correlation: 'c-7' } },
    ]);
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      exampleIds: ['ex-1'],
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('{"correlation":"c-7"}')).toBeInTheDocument();
  });

  it('shows the schema sample for a headers-only example instead of the first example', () => {
    vi.mocked(useResolvedExamples).mockImplementation((_schemaId, exampleIds) =>
      exampleIds ? [{ drink: 'latte' }, undefined] : [{ drink: 'from schema' }],
    );
    vi.mocked(useExampleEntries).mockReturnValue([
      { id: 'ex-1', value: { drink: 'latte' } },
      { id: 'ex-2', value: undefined, headers: { correlation: 'c-8' } },
    ]);
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      schemaId: 'schema-payload',
      exampleIds: ['ex-1', 'ex-2'],
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);
    fireEvent.click(screen.getByText('select ex-2'));

    expect(screen.getByText('{"correlation":"c-8"}')).toBeInTheDocument();
    expect(screen.getByText('{"drink":"from schema"}')).toBeInTheDocument();
    expect(screen.queryByText('{"drink":"latte"}')).toBeNull();
    vi.mocked(useResolvedExamples).mockReset().mockReturnValue([{}]);
    vi.mocked(useExampleEntries).mockReset().mockReturnValue([]);
  });

  it('shows no headers block for an example without headers', () => {
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      exampleIds: ['ex-1'],
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);

    expect(screen.queryByText('Headers')).toBeNull();
  });
});

describe('PayloadExampleItem sample direction', () => {
  it('samples the payload without a request or response context', () => {
    vi.mocked(useResolvedExamples).mockClear();
    renderPayloadExampleItem({
      kind: 'payload',
      examples: [],
      schemaId: 'schema-payload',
      mediaTypes: ['application/json'],
    } as unknown as PayloadExamplesPanelItem);

    const { calls } = vi.mocked(useResolvedExamples).mock;
    expect(calls.length).toBeGreaterThan(0);
    for (const call of calls) {
      expect(call[2]).toBeUndefined();
    }
  });
});
