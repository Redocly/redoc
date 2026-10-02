import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';

import type { MessageReferencesNode } from '../../../../../types/content.js';
import type * as Jotai from 'jotai';

import { TelemetryContext } from '../../../../../contexts/telemetry.js';
import { panelKind } from '../../../../../types/common.js';
import { ItemIdContext } from '../../../../../hooks/useDeepLinkSection.js';
import { visitedChannelsAtom } from '../../../../../jotai/app.js';
import { MessageReferencesPanelItem } from '../MessageReferencesItem.js';

const mocks = vi.hoisted(() => ({
  activeMessageKeyAtom: Symbol('activeMessageKeyAtom'),
  useAtomValue: vi.fn(),
  normalizeUrl: vi.fn((value: string) => `/n${value}`),
  visitedChannels: [] as string[],
}));

vi.mock('jotai', async (importOriginal) => {
  const jotai = (await importOriginal()) as typeof Jotai;
  return {
    ...jotai,
    useAtomValue: (...args: unknown[]) => mocks.useAtomValue(...args),
    useSetAtom: () => vi.fn(),
  };
});

vi.mock('../../../../../jotai/itemStore.js', () => ({
  itemStoreFieldAtom: vi.fn(() => mocks.activeMessageKeyAtom),
}));

vi.mock('../../../../../hooks/useNormalizeUrl.js', () => ({
  useNavigationUrlNormalizer: () => mocks.normalizeUrl,
}));

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ header, children }: { header?: string; children?: React.ReactNode }) => (
    <section data-testid="message-references-panel" data-header={header ?? ''}>
      {children}
    </section>
  ),
}));

vi.mock('../../../../../icons/ListIcon/ListIcon.js', () => ({
  ListIcon: ({ color }: { color?: string }) => <span data-testid="list-icon" data-color={color} />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.visitedChannels = [];
});

function mockAtomValues(activeMessageKey: string): void {
  mocks.useAtomValue.mockImplementation((atom: unknown) =>
    atom === mocks.activeMessageKeyAtom
      ? activeMessageKey
      : atom === visitedChannelsAtom
        ? mocks.visitedChannels
        : undefined,
  );
}

function renderWithProviders(node: MessageReferencesNode, hash = '#'): void {
  render(
    <MemoryRouter initialEntries={[`/${hash}`]}>
      <ItemIdContext.Provider value="item-1">
        <MessageReferencesPanelItem node={node} />
      </ItemIdContext.Provider>
    </MemoryRouter>,
  );
}

describe('MessageReferencesPanelItem', () => {
  it('renders grouped message references and resolves active message fallback', () => {
    mockAtomValues('missing-message-key');

    const node = {
      kind: panelKind.MESSAGE_REFERENCES,
      title: 'Message references',
      children: [
        {
          kind: panelKind.MESSAGE_REFERENCES,
          referencesByMessageKey: {
            created: {
              exchanges: [
                { key: 'exchange.created', label: 'User Exchange', link: '/channels/users' },
              ],
              queues: [{ key: 'queue.created', label: 'User Queue', link: '/channels/user-queue' }],
            },
          },
        },
      ],
    } as MessageReferencesNode;

    renderWithProviders(node, '#section/queue.created');

    expect(screen.getByTestId('message-references-panel')).toHaveAttribute(
      'data-header',
      'Used in 1 exchange and 1 queue',
    );
    expect(screen.getByText('Exchanges')).toBeInTheDocument();
    expect(screen.getByText('Queues')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'User Exchange' })).toHaveAttribute(
      'href',
      '/n/channels/users',
    );
    expect(screen.getByRole('link', { name: 'User Queue' })).toHaveAttribute(
      'href',
      '/n/channels/user-queue',
    );
  });

  it('marks a visited channel blue, others grey', () => {
    // A visited path ends with the exchange key → exchange visited, queue not.
    mocks.visitedChannels = ['/docs/svc/exchs/exchange.created'];
    mockAtomValues('created');
    const node = {
      kind: panelKind.MESSAGE_REFERENCES,
      title: 'Message references',
      children: [
        {
          kind: panelKind.MESSAGE_REFERENCES,
          referencesByMessageKey: {
            created: {
              exchanges: [
                { key: 'exchange.created', label: 'User Exchange', link: '/channels/users' },
              ],
              queues: [{ key: 'queue.created', label: 'User Queue', link: '/channels/user-queue' }],
            },
          },
        },
      ],
    } as MessageReferencesNode;

    renderWithProviders(node);

    const iconFor = (name: string): Element | null | undefined =>
      screen.getByRole('link', { name }).closest('div')?.querySelector('[data-testid="list-icon"]');
    expect(iconFor('User Exchange')).toHaveAttribute('data-color', 'var(--color-info-border)');
    expect(iconFor('User Queue')).toHaveAttribute('data-color', 'var(--border-color-primary)');
  });

  it('fires sendReferencedInClickedMessage when a channel link is clicked', () => {
    mockAtomValues('created');
    const telemetry = { sendReferencedInClickedMessage: vi.fn() };
    const node = {
      kind: panelKind.MESSAGE_REFERENCES,
      title: 'Message references',
      children: [
        {
          kind: panelKind.MESSAGE_REFERENCES,
          referencesByMessageKey: {
            created: {
              exchanges: [
                { key: 'exchange.created', label: 'User Exchange', link: '/channels/users' },
              ],
              queues: [],
            },
          },
        },
      ],
    } as MessageReferencesNode;

    render(
      <MemoryRouter initialEntries={['/']}>
        <ItemIdContext.Provider value="item-1">
          <TelemetryContext.Provider value={telemetry as never}>
            <MessageReferencesPanelItem node={node} />
          </TelemetryContext.Provider>
        </ItemIdContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'User Exchange' }));

    expect(telemetry.sendReferencedInClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendReferencedInClickedMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'asyncapiDocsChannelLink',
      object: 'link',
      fromKind: 'channel',
      toKind: 'channel',
    });
    expect(telemetry.sendReferencedInClickedMessage.mock.calls[0][0][0]).not.toHaveProperty(
      'referencedIn',
    );
  });

  it('passes both legacy- and new-contract MessageChannelReference.link shapes through the normalizer', () => {
    mockAtomValues('created');
    // Production normalizer behavior: strip basePath if present, else identity.
    // Both shapes must end up at the same rendered href.
    mocks.normalizeUrl.mockImplementation((href: string) =>
      href.startsWith('/docs/asyncapi') ? href.slice('/docs/asyncapi'.length) : href,
    );

    const node = {
      kind: panelKind.MESSAGE_REFERENCES,
      title: 'Message references',
      children: [
        {
          kind: panelKind.MESSAGE_REFERENCES,
          referencesByMessageKey: {
            created: {
              exchanges: [
                // Legacy adapter output: link contains basePath.
                {
                  key: 'exchange.legacy',
                  label: 'Legacy Exchange',
                  link: '/docs/asyncapi/channels/users',
                },
                // New-contract adapter output: link is relative.
                { key: 'exchange.new', label: 'New Exchange', link: '/channels/users' },
              ],
              queues: [],
            },
          },
        },
      ],
    } as MessageReferencesNode;

    renderWithProviders(node);

    expect(mocks.normalizeUrl).toHaveBeenCalledWith('/docs/asyncapi/channels/users');
    expect(mocks.normalizeUrl).toHaveBeenCalledWith('/channels/users');
    // Both shapes produce the same rendered href — that is the cross-refactor invariant.
    expect(screen.getByRole('link', { name: 'Legacy Exchange' })).toHaveAttribute(
      'href',
      '/channels/users',
    );
    expect(screen.getByRole('link', { name: 'New Exchange' })).toHaveAttribute(
      'href',
      '/channels/users',
    );
  });

  it('returns empty output when references are missing for active message', () => {
    mockAtomValues('created');

    const node = {
      kind: panelKind.MESSAGE_REFERENCES,
      title: 'Message references',
      children: [
        {
          kind: panelKind.MESSAGE_REFERENCES,
          referencesByMessageKey: {
            created: { exchanges: [], queues: [] },
          },
        },
      ],
    } as MessageReferencesNode;

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <ItemIdContext.Provider value="item-1">
          <MessageReferencesPanelItem node={node} />
        </ItemIdContext.Provider>
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });
});
