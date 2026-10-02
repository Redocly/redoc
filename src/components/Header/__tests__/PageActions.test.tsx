import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { useCopySpecSlice } from '../../../hooks/useCopySpecSlice.js';

import { ClipboardService } from '@redocly/theme/core/openapi';
import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { PageActions } from '../PageActions.js';

type CopySpecSlice = ReturnType<typeof useCopySpecSlice>;

const sliceMock = vi.hoisted(() => ({ current: null as CopySpecSlice }));

vi.mock('../../../hooks/useCopySpecSlice.js', () => ({
  useCopySpecSlice: () => sliceMock.current,
}));

function makeSlice(
  overrides: Partial<NonNullable<CopySpecSlice>> = {},
): NonNullable<CopySpecSlice> {
  return {
    getText: async () => 'openapi: 3.1.0\n',
    contentKind: 'yaml',
    scope: { kind: 'document' },
    specUrl: 'https://api.example.com/openapi.yaml',
    ...overrides,
  };
}

function renderPageActions(slice: CopySpecSlice) {
  sliceMock.current = slice;
  const store = createStore();
  store.set(globalStoreAtom, {
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

  return render(
    <JotaiProvider store={store}>
      <PageActions pageSlug="pets" />
    </JotaiProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PageActions', () => {
  it('renders nothing when no slice is available', () => {
    renderPageActions(null);

    expect(screen.queryByTestId('page-actions')).not.toBeInTheDocument();
  });

  it('copies the slice text on the primary button click', async () => {
    const copy = vi.spyOn(ClipboardService, 'copyCustom').mockImplementation(() => {});
    renderPageActions(makeSlice({ getText: async () => 'sliced: yaml\n' }));

    fireEvent.click(screen.getByRole('button', { name: /Copy/ }));

    await waitFor(() => expect(copy).toHaveBeenCalledWith('sliced: yaml\n'));
  });

  it('opens a tab synchronously and navigates it to the inline link', async () => {
    const fakeTab = { location: { href: '' }, close: vi.fn() };
    const open = vi.spyOn(window, 'open').mockReturnValue(fakeTab as unknown as Window);
    renderPageActions(makeSlice());

    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const claudeItem = await screen.findByText('Open in Claude');
    fireEvent.click(claudeItem);

    await waitFor(() => expect(fakeTab.location.href).toContain('https://claude.ai/new?q='));
    expect(open).toHaveBeenCalledWith('', '_blank');
    expect(new URL(fakeTab.location.href).searchParams.get('q')).toContain('openapi: 3.1.0');
  });

  it('renders only the copy button when no spec url exists', () => {
    renderPageActions(makeSlice({ specUrl: undefined }));

    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('navigates to the fetch prompt when the slice is oversized', async () => {
    const fakeTab = { location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(fakeTab as unknown as Window);
    renderPageActions(makeSlice({ getText: async () => 'a: b\n'.repeat(2000) }));

    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    fireEvent.click(await screen.findByText('Open in Claude'));

    await waitFor(() =>
      expect(new URL(fakeTab.location.href, 'https://x.invalid').searchParams.get('q')).toContain(
        'Read https://api.example.com/openapi.yaml',
      ),
    );
  });

  it('closes the pre-opened tab when producing the slice fails', async () => {
    const fakeTab = { location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(fakeTab as unknown as Window);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderPageActions(
      makeSlice({
        getText: async () => {
          throw new Error('boom');
        },
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    fireEvent.click(await screen.findByText('Open in Claude'));

    await waitFor(() => expect(fakeTab.close).toHaveBeenCalled());
    expect(fakeTab.location.href).toBe('');
  });
});
