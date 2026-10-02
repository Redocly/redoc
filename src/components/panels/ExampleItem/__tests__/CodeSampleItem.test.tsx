import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import type { ReactNode } from 'react';
import type { CodeSamplePanelItem } from '../../../../types/content.js';

const mocks = vi.hoisted(() => ({
  useMediaTypeContentMock: vi.fn(),
  useSchemaVariantSelectionMock: vi.fn(),
  useActiveVariantSchemaIdMock: vi.fn(),
  useResolvedExamplesMock: vi.fn(),
  setLanguageMock: vi.fn(),
  languageStateValue: {
    activeLanguage: 'payload' as string,
    languages: [{ key: 'payload', lang: 'json', title: 'Payload' }] as Array<{
      key: string;
      lang: string;
      title: string;
    }>,
  },
  requestValuesValue: {} as Record<string, Record<string, unknown>>,
  exampleStoreValue: {} as Record<
    string,
    { id: string; key?: string; value?: unknown; description?: string }
  >,
  // Minimal reactive stand-in for itemStoreAtom/itemStoreFieldAtom so the
  // shared activeExampleKey round-trip (replay/embed key → panel selection) works.
  itemStoreState: { activeExampleKey: '' } as Record<string, unknown>,
  itemStoreListeners: new Set<() => void>(),
  setItemStoreState(update: unknown) {
    mocks.itemStoreState = { ...mocks.itemStoreState, ...(update as Record<string, unknown>) };
    mocks.itemStoreListeners.forEach((listener) => listener());
  },
  atoms: {
    languageAtom: { id: 'languageAtom' },
    environmentAtom: { id: 'environmentAtom' },
    requestValuesAtom: { id: 'requestValuesAtom' },
    globalOptionsAtom: { id: 'globalOptionsAtom' },
    exampleStoreAtom: { id: 'exampleStoreAtom' },
  },
}));

vi.mock('jotai', async () => {
  const { useSyncExternalStore } = await import('react');
  return {
    atom: () => ({ id: 'mockAtom' }),
    useSetAtom: (atom: unknown) =>
      (atom as { id?: string }).id === 'itemStoreAtom' ? mocks.setItemStoreState : vi.fn(),
    useAtom: (atom: unknown) => {
      const atomId = (atom as { id?: string }).id;
      if (atomId === 'languageAtom') {
        return [mocks.languageStateValue, mocks.setLanguageMock] as const;
      }
      if (atomId === 'selectedSecuritySchemeIdxAtom') {
        return [0, mocks.setSecuritySchemeIdxMock] as const;
      }
      return [undefined, vi.fn()] as const;
    },
    useAtomValue: (atom: unknown) => {
      const atomId = (atom as { id?: string }).id;
      if (atomId?.startsWith('itemStoreField:')) {
        const key = atomId.slice('itemStoreField:'.length);
        // eslint-disable-next-line react-hooks/rules-of-hooks -- stable per call site
        return useSyncExternalStore(
          (listener) => {
            mocks.itemStoreListeners.add(listener);
            return () => mocks.itemStoreListeners.delete(listener);
          },
          () => mocks.itemStoreState[key],
        );
      }
      if (atomId === 'globalOptionsAtom') {
        return {
          codeSamples: mocks.codeSamplesValue ?? {},
          generatedSamplesMaxDepth: 2,
          downloadUrls: mocks.downloadUrlsValue,
        };
      }
      if (atomId === 'requestValuesAtom') {
        return mocks.requestValuesValue;
      }
      if (atomId === 'exampleStoreAtom') {
        return mocks.exampleStoreValue;
      }
      if (atomId === 'environmentAtom') {
        return [{}];
      }
      return undefined;
    },
  };
});

vi.mock('../../../../jotai/itemStore.js', () => ({
  itemStoreAtom: () => ({ id: 'itemStoreAtom' }),
  itemStoreFieldAtom: ({ key }: { key: string }) => ({ id: `itemStoreField:${key}` }),
}));

vi.mock('../../../../jotai/examples.js', () => ({
  exampleStoreAtom: mocks.atoms.exampleStoreAtom,
}));

vi.mock('../../../../jotai/app.js', () => ({
  languageAtom: mocks.atoms.languageAtom,
  environmentAtom: mocks.atoms.environmentAtom,
  requestValuesAtom: mocks.atoms.requestValuesAtom,
  getLangKey: ({ lang, label }: { lang?: string; label?: string } = {}) => {
    const raw = (label || lang || '').toLowerCase();
    const map: Record<string, string> = {
      'node.js': 'node',
      'java8+apache': 'java8',
      'c#': 'csharp',
      'c#+newtonsoft': 'csharpnewtonsoft',
      payload: 'json',
    };
    return map[raw] ?? raw;
  },
}));

vi.mock('../../../../jotai/store.js', () => ({
  globalOptionsAtom: mocks.atoms.globalOptionsAtom,
  specTypeAtom: { id: 'specTypeAtom' },
}));


vi.mock('../../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (_key: string, fallback?: string) => fallback ?? '',
}));

vi.mock('../hooks.js', () => ({
  useMediaTypeContent: (...args: unknown[]) => mocks.useMediaTypeContentMock(...args),
  useSchemaVariantSelection: (...args: unknown[]) => mocks.useSchemaVariantSelectionMock(...args),
  useActiveVariantSchemaId: (...args: unknown[]) => mocks.useActiveVariantSchemaIdMock(...args),
}));

vi.mock('../../../ItemContent/hooks.js', () => ({
  useExampleKeyFromHash: vi.fn(),
  useResolvedExamples: (...args: unknown[]) => mocks.useResolvedExamplesMock(...args),
}));


vi.mock('../../styled.js', () => ({
  CodeBlockPanel: ({ children, footer }: { children: ReactNode; footer?: ReactNode }) => (
    <div>
      <div data-testid="code-block-panel-body">{children}</div>
      <div data-testid="code-block-panel-footer">{footer}</div>
    </div>
  ),
  StyledCodeBlock: ({ lang }: { lang?: string }) => (
    <div data-testid="styled-code-block" data-lang={lang} />
  ),
}));

vi.mock('../../LanguageItem/LanguageDropdown.js', () => ({
  LanguageDropdown: () => <div data-testid="language-dropdown" />,
}));

vi.mock('../styled.js', () => ({
  StyledPanelHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MediaTypeRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ResponsePanelHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../ServerDropdown.js', () => ({
  ServerDropdown: () => <div data-testid="server-dropdown" />,
}));

vi.mock('../selectors.js', () => ({
  VariantPicker: () => <div data-testid="variant-picker" />,
  ExampleSelector: ({
    exampleIds,
    selectedIdx,
    onSelect,
  }: {
    exampleIds?: string[];
    selectedIdx: number;
    onSelect: (idx: number) => void;
  }) => (
    <div data-testid="example-selector" data-selected-idx={selectedIdx}>
      {exampleIds?.map((id, idx) => (
        <button key={id} data-testid={`select-example-${idx}`} onClick={() => onSelect(idx)} />
      ))}
    </div>
  ),
  MediaTypeSelector: () => <div data-testid="media-type-selector" />,
  PanelDropdownSelect: () => <div data-testid="panel-dropdown-select" />,
  ExampleDescription: ({ description }: { description?: string }) => (
    <div data-testid="example-description" data-description={description} />
  ),
  PayloadDisplay: () => <div data-testid="payload-display" />,
}));

import { CodeSampleItem } from '../CodeSampleItem.js';
import { panelKind } from '../../../../types/common.js';

beforeEach(() => {
  mocks.itemStoreState = { activeExampleKey: '' };
  mocks.itemStoreListeners.clear();
});

function makeNode(overrides: Partial<CodeSamplePanelItem> = {}): CodeSamplePanelItem {
  return {
    kind: panelKind.CODE_SAMPLE,
    examples: [],
    source: {
      kind: panelKind.CODE_SAMPLE,
      operationType: 'http',
      method: 'POST',
      path: '/widgets',
      servers: [{ url: 'https://example.com' }],
      parameters: {
        path: [],
        query: [],
        querystring: [],
        header: [],
        cookie: [],
      },
      security: [],
    },
    ...overrides,
  };
}

describe('CodeSampleItem schema id selection for resolved examples', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useSchemaVariantSelectionMock.mockReturnValue(undefined);
    mocks.useActiveVariantSchemaIdMock.mockReturnValue('schema.variant');
    mocks.useResolvedExamplesMock.mockReturnValue([{}]);
  });

  it('uses effective schema id for sequential media types', () => {
    mocks.useMediaTypeContentMock.mockReturnValue({
      mediaTypes: ['application/json-seq'],
      activeMediaType: 'application/json-seq',
      effectiveSchemaId: 'schema.base',
      effectiveExampleIds: ['ex-1'],
      onMediaTypeChange: vi.fn(),
    });

    render(<CodeSampleItem node={makeNode()} />);

    expect(mocks.useResolvedExamplesMock).toHaveBeenCalledWith(
      'schema.base',
      ['ex-1'],
      'request',
      'application/json-seq',
    );
  });

  it('uses discriminator-aware schema id for non-sequential media types', () => {
    mocks.useMediaTypeContentMock.mockReturnValue({
      mediaTypes: ['application/json'],
      activeMediaType: 'application/json',
      effectiveSchemaId: 'schema.base',
      effectiveExampleIds: ['ex-1'],
      onMediaTypeChange: vi.fn(),
    });

    render(<CodeSampleItem node={makeNode()} />);

    expect(mocks.useResolvedExamplesMock).toHaveBeenCalledWith(
      'schema.variant',
      ['ex-1'],
      'request',
      'application/json',
    );
  });

  it('skips the variant selection when the media type has authored examples', () => {
    mocks.useMediaTypeContentMock.mockReturnValue({
      mediaTypes: ['application/json'],
      activeMediaType: 'application/json',
      effectiveSchemaId: 'schema.base',
      effectiveExampleIds: ['ex-1', 'ex-2'],
      onMediaTypeChange: vi.fn(),
    });

    render(<CodeSampleItem node={makeNode()} />);

    expect(mocks.useSchemaVariantSelectionMock).toHaveBeenCalledWith(undefined);
  });

  it('resolves the variant selection for a schema-only body', () => {
    mocks.useMediaTypeContentMock.mockReturnValue({
      mediaTypes: ['application/json'],
      activeMediaType: 'application/json',
      effectiveSchemaId: 'schema.base',
      effectiveExampleIds: undefined,
      onMediaTypeChange: vi.fn(),
    });

    render(<CodeSampleItem node={makeNode()} />);

    expect(mocks.useSchemaVariantSelectionMock).toHaveBeenCalledWith('schema.base');
  });
});

describe('CodeSampleItem variant picker vs spec-provided examples', () => {
  const variantSelection = {
    options: [{ key: 'a', label: 'A' }],
    activeIdx: 0,
    onSelect: vi.fn(),
    kind: 'discriminator',
    optionMeta: [{}],
  };

  function mediaTypeContent(exampleIds: string[] | undefined) {
    return {
      mediaTypes: ['application/json'],
      activeMediaType: 'application/json',
      effectiveSchemaId: 'schema.base',
      effectiveExampleIds: exampleIds,
      onMediaTypeChange: vi.fn(),
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useSchemaVariantSelectionMock.mockReturnValue(variantSelection);
    mocks.useActiveVariantSchemaIdMock.mockReturnValue('schema.variant');
    mocks.useResolvedExamplesMock.mockReturnValue([{}]);
  });

  it('hides the discriminator picker when the spec provides its own examples (legacy parity)', () => {
    mocks.useMediaTypeContentMock.mockReturnValue(mediaTypeContent(['ex-1', 'ex-2']));

    const { queryByTestId } = render(<CodeSampleItem node={makeNode()} />);

    expect(queryByTestId('variant-picker')).toBeNull();
    expect(queryByTestId('example-selector')).toBeTruthy();
  });

  it('shows the discriminator picker when samples are generated (no spec examples)', () => {
    mocks.useMediaTypeContentMock.mockReturnValue(mediaTypeContent(undefined));

    const { queryByTestId } = render(<CodeSampleItem node={makeNode()} />);

    expect(queryByTestId('variant-picker')).toBeTruthy();
  });
});

// Enterprise-only: the scenario offers arbitrary configured languages, which the community
// edition filters down to payload + x-codeSamples. The grammar mapping itself is covered
// in both editions by `utils/__tests__/languages.test.ts`.


describe('CodeSampleItem payload example description', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useSchemaVariantSelectionMock.mockReturnValue(undefined);
    mocks.useActiveVariantSchemaIdMock.mockReturnValue(undefined);
    mocks.useResolvedExamplesMock.mockReturnValue([{}, {}]);
    mocks.languageStateValue = {
      activeLanguage: 'payload',
      languages: [{ key: 'payload', lang: 'json', title: 'Payload' }],
    };
    mocks.useMediaTypeContentMock.mockReturnValue({
      mediaTypes: ['application/json'],
      activeMediaType: 'application/json',
      effectiveSchemaId: undefined,
      effectiveExampleIds: ['ex-win', 'ex-loss'],
      onMediaTypeChange: vi.fn(),
    });
    mocks.exampleStoreValue = {
      'ex-win': {
        id: 'ex-win',
        key: 'winning',
        value: {},
        description: 'This is a **fictional** win.',
      },
      'ex-loss': {
        id: 'ex-loss',
        key: 'losing',
        value: {},
        description: 'This is a **fictional** loss.',
      },
    };
  });

  afterEach(() => {
    mocks.exampleStoreValue = {};
  });

  it('renders the description of the selected example below the example selector', () => {
    const { getByTestId } = render(<CodeSampleItem node={makeNode()} />);

    expect(getByTestId('example-description').getAttribute('data-description')).toBe(
      'This is a **fictional** win.',
    );

    fireEvent.click(getByTestId('select-example-1'));

    expect(getByTestId('example-description').getAttribute('data-description')).toBe(
      'This is a **fictional** loss.',
    );
  });
});
