import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type * as ExampleItemHooks from '../hooks.js';
import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { ResponseExamplesPanelItem } from '../../../../types/content.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ResponseExampleItem } from '../ResponseExampleItem.js';
import { useSchemaVariantSelection } from '../hooks.js';

vi.mock('../../styled.js', () => ({
  CodeBlockPanel: ({ header, children }: { header: () => ReactNode; children: ReactNode }) => (
    <div>
      <div data-testid="panel-header-slot">{header()}</div>
      <div>{children}</div>
    </div>
  ),
}));

// Selectors re-import StyledJsonViewer from `styled.js` which we mock above,
// so we have to stub the selectors too to avoid a missing-export crash.
vi.mock('../selectors.js', () => ({
  MediaTypeSelector: () => null,
  DiscriminatorSelector: () => null,
  ExampleSelector: ({
    exampleIds,
    onSelect,
  }: {
    exampleIds?: string[];
    onSelect: (idx: number) => void;
  }) => (
    <div data-testid="example-selector">
      {exampleIds?.map((id, idx) => (
        <button key={id} data-testid={`select-example-${idx}`} onClick={() => onSelect(idx)} />
      ))}
    </div>
  ),
  ExampleDescription: ({ description }: { description?: string }) => (
    <div data-testid="example-description" data-description={description} />
  ),
  PayloadDisplay: ({ payload, emptyMessage }: { payload?: unknown; emptyMessage?: string }) => (
    <div data-testid="payload">{payload === undefined ? emptyMessage : String(payload)}</div>
  ),
  VariantPicker: () => null,
  PanelDropdownSelect: () => null,
}));

// Passthrough wrap so tests can assert which schema id (or undefined) reaches
// the variant-selection hook without changing its behavior.
vi.mock('../hooks.js', async (importOriginal) => {
  const actual = await importOriginal<typeof ExampleItemHooks>();
  return { ...actual, useSchemaVariantSelection: vi.fn(actual.useSchemaVariantSelection) };
});

// Resolves only when a schemaId is passed, so cross-code schema leakage is detectable.
const { useResolvedExamplesMock } = vi.hoisted(() => ({
  useResolvedExamplesMock: vi.fn((...args: unknown[]) => {
    const schemaId = args[0] as string | undefined;
    return schemaId ? [`sample-of:${schemaId}`] : [];
  }),
}));
vi.mock('../../../ItemContent/hooks.js', () => ({
  useExampleKeyFromHash: vi.fn(),
  useResolvedExamples: useResolvedExamplesMock,
  useExampleEntries: (ids?: string[]) =>
    (ids ?? []).map((id) => ({ id, value: {}, description: `${id}-description` })),
}));

function renderResponseExampleItem(
  node: ResponseExamplesPanelItem,
  { activeResponseCode }: { activeResponseCode?: string } = {},
) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  } as GlobalStoreAtom);
  if (activeResponseCode) {
    jotaiStore.set(itemStoreAtom(''), { activeResponseCode });
  }

  return render(
    <Provider store={jotaiStore}>
      <ResponseExampleItem node={node} />
    </Provider>,
  );
}

describe('ResponseExampleItem per-code samples', () => {
  it('shows "No content" for a selected code without content instead of another code\'s sample', () => {
    // registryPrepareFileUpload case: 200 has a schema, 401 has no content.
    renderResponseExampleItem(
      {
        kind: 'response',
        examples: [],
        responseCodes: [
          {
            code: '200',
            schemaId: 'schema-200',
            mediaTypes: ['application/json'],
            mediaTypeContent: { 'application/json': { schemaId: 'schema-200' } },
          },
          { code: '401' },
        ],
      },
      { activeResponseCode: '401' },
    );

    expect(screen.getByTestId('payload')).toHaveTextContent('No content');
    expect(screen.getByTestId('payload')).not.toHaveTextContent('sample-of:schema-200');
  });

  it('does not sample the first response schema for a default code without content (webhook case)', () => {
    // order-notification webhook: 200 has no content, 400 has a problem schema.
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [
        { code: '200' },
        {
          code: '400',
          schemaId: 'schema-problem',
          mediaTypes: ['application/problem+json'],
          mediaTypeContent: { 'application/problem+json': { schemaId: 'schema-problem' } },
        },
      ],
    });

    expect(screen.getByTestId('payload')).toHaveTextContent('No content');
    expect(screen.getByTestId('payload')).not.toHaveTextContent('sample-of:schema-problem');
  });

  it('shows "No content" for a code whose media type has no schema or examples (legacy hasSample)', () => {
    renderResponseExampleItem(
      {
        kind: 'response',
        examples: [],
        responseCodes: [
          {
            code: '200',
            schemaId: 'schema-200',
            mediaTypes: ['application/json'],
            mediaTypeContent: { 'application/json': { schemaId: 'schema-200' } },
          },
          {
            code: '204',
            mediaTypes: ['application/json'],
            mediaTypeContent: { 'application/json': {} },
          },
        ],
      },
      { activeResponseCode: '204' },
    );

    expect(screen.getByTestId('payload')).toHaveTextContent('No content');
    expect(screen.getByTestId('payload')).not.toHaveTextContent('sample-of:schema-200');
  });

  it('still renders the selected code sample when it has content', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [
        {
          code: '200',
          schemaId: 'schema-200',
          mediaTypes: ['application/json'],
          mediaTypeContent: { 'application/json': { schemaId: 'schema-200' } },
        },
        { code: '401' },
      ],
    });

    expect(screen.getByTestId('payload')).toHaveTextContent('sample-of:schema-200');
  });

  it('never leaks node-level schemaId into a code without content when responseCodes exist', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      schemaId: 'schema-node',
      responseCodes: [{ code: '204' }],
    });

    expect(screen.getByTestId('payload')).toHaveTextContent('No content');
    expect(screen.getByTestId('payload')).not.toHaveTextContent('sample-of:schema-node');
  });

  it('renders from node-level schemaId on a codeless panel (SchemaDefinition case)', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      schemaId: 'schema-definition',
    });

    expect(screen.getByTestId('payload')).toHaveTextContent('sample-of:schema-definition');
  });
});

describe('ResponseExampleItem header', () => {
  it('should omit the panel header when the title is hidden and there are no responseCodes', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      schemaId: 'schema-x',
      hideHeaderTitle: true,
    });
    const headerSlot = screen.getByTestId('panel-header-slot');
    expect(headerSlot).toBeEmptyDOMElement();
  });

  it('should render response code tabs without a header title when only responseCodes are provided', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [{ code: '200' }, { code: '404' }],
    });
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render the translated default header title', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      schemaId: 'schema-x',
    });
    expect(screen.getByText('Response')).toBeInTheDocument();
  });

  it('should hide the header title but keep the code tabs when hideHeaderTitle is set', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [{ code: '200' }],
      hideHeaderTitle: true,
    });
    expect(screen.queryByText('Response')).not.toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });
});

describe('ResponseExampleItem example selection scope', () => {
  const node = {
    kind: 'response-examples',
    responseCodes: [
      {
        code: '200',
        mediaTypeContent: { 'application/json': { exampleIds: ['w', 'l'] } },
      },
      {
        code: '404',
        mediaTypeContent: { 'application/json': { exampleIds: ['m'] } },
      },
    ],
  } as unknown as ResponseExamplesPanelItem;

  function activeDescription() {
    return screen.getByTestId('example-description').getAttribute('data-description');
  }

  it('scopes a user example selection to its response code', () => {
    renderResponseExampleItem(node);
    expect(activeDescription()).toBe('w-description');

    fireEvent.click(screen.getByTestId('select-example-1'));
    expect(activeDescription()).toBe('l-description');

    fireEvent.click(screen.getByRole('button', { name: '404' }));
    expect(activeDescription()).toBe('m-description');

    fireEvent.click(screen.getByRole('button', { name: '200' }));
    expect(activeDescription()).toBe('l-description');
  });
});

describe('ResponseExampleItem variant picker gating', () => {
  it('skips the variant selection when the active code has authored examples', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [
        {
          code: '200',
          mediaTypeContent: {
            'application/json': { schemaId: 'schema-200', exampleIds: ['w', 'l'] },
          },
        },
      ],
    });

    expect(vi.mocked(useSchemaVariantSelection)).toHaveBeenLastCalledWith(undefined);
  });

  it('resolves the variant selection for a schema-only response', () => {
    renderResponseExampleItem({
      kind: 'response',
      examples: [],
      responseCodes: [
        {
          code: '200',
          mediaTypeContent: { 'application/json': { schemaId: 'schema-200' } },
        },
      ],
    });

    expect(vi.mocked(useSchemaVariantSelection)).toHaveBeenLastCalledWith('schema-200');
  });
});

describe('ResponseExampleItem sample direction', () => {
  const node = {
    kind: 'response',
    examples: [],
    responseCodes: [
      {
        code: '200',
        schemaId: 'schema-200',
        mediaTypes: ['application/json'],
        mediaTypeContent: { 'application/json': { schemaId: 'schema-200' } },
      },
    ],
  } as ResponseExamplesPanelItem;

  it('samples a regular response with response direction (drops writeOnly)', () => {
    useResolvedExamplesMock.mockClear();
    renderResponseExampleItem(node);
    expect(useResolvedExamplesMock).toHaveBeenCalledWith(
      'schema-200',
      undefined,
      'response',
      'application/json',
    );
  });

  it('samples an event (webhook) response with request direction (drops readOnly)', () => {
    useResolvedExamplesMock.mockClear();
    renderResponseExampleItem({ ...node, isEvent: true });
    expect(useResolvedExamplesMock).toHaveBeenCalledWith(
      'schema-200',
      undefined,
      'request',
      'application/json',
    );
  });
});
