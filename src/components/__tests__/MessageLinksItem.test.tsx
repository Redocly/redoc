import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider as JotaiProvider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type * as Jotai from 'jotai';
import type { MessageLinksNode } from '../../types/content.js';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { MessageLinksItem } from '../MessageLinksItem.js';

vi.mock('jotai', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof Jotai;
  return { ...actual, useAtomValue: () => '/api-docs' };
});

vi.mock('../../hooks/useNormalizeUrl.js', () => ({
  useNavigationUrlNormalizer: () => (url: string) => url,
}));

vi.mock('@redocly/theme/components/Tag/Tag', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  Tag: ({ children }: { children: ReactNode }) => <span data-testid="tag">{children}</span>,
}));

vi.mock('@redocly/theme/icons/ArrowUpRightIcon/ArrowUpRightIcon', () => ({
  ArrowUpRightIcon: () => <span data-testid="arrow-icon" />,
}));

type MockTelemetry = {
  sendMessageClickedMessage: ReturnType<typeof vi.fn>;
};

function renderWithTelemetry(node: MessageLinksNode, telemetry: MockTelemetry) {
  return render(
    <MemoryRouter>
      <JotaiProvider>
        <TelemetryContext.Provider value={telemetry as never}>
          <MessageLinksItem node={node} />
        </TelemetryContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('MessageLinksItem telemetry', () => {
  let telemetry: MockTelemetry;

  beforeEach(() => {
    telemetry = { sendMessageClickedMessage: vi.fn() };
  });

  it('fires sendMessageClickedMessage with the position of the clicked message', () => {
    const node = {
      channelLink: '/channels/orders',
      messages: [
        { name: 'order-created', label: 'OrderCreated' },
        { name: 'order-shipped', label: 'OrderShipped' },
      ],
    } as unknown as MessageLinksNode;

    renderWithTelemetry(node, telemetry);

    fireEvent.click(screen.getByText('OrderShipped'));

    expect(telemetry.sendMessageClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendMessageClickedMessage.mock.calls[0][0][0]).toEqual({
      id: 'messageLink',
      object: 'link',
      uri: 'urn:redocly:redoc:ui:link:messageLink',
      index: 1,
      total: 2,
    });
  });

  it('renders each message as a real link with the deep-link URL', () => {
    const node = {
      channelLink: '/channels/orders',
      messages: [{ name: 'order-created', label: 'OrderCreated' }],
    } as unknown as MessageLinksNode;

    renderWithTelemetry(node, telemetry);

    const link = screen.getByRole('link', { name: /OrderCreated/ });
    expect(link).toHaveAttribute(
      'href',
      '/api-docs/channels/orders#channels/orders/messages&m=order-created',
    );
  });

  it('links with a hash that does not start with "/" even when channelLink has a leading slash', () => {
    const node = {
      channelLink: '/rides/topics/ride-requests',
      messages: [{ name: 'requestRide', label: 'Ride Request' }],
    } as unknown as MessageLinksNode;

    renderWithTelemetry(node, telemetry);

    const href = screen.getByRole('link', { name: /Ride Request/ }).getAttribute('href') ?? '';
    const hash = href.slice(href.indexOf('#'));
    expect(hash).toBe('#rides/topics/ride-requests/messages&m=requestride');
  });

  it('renders nothing when there are no messages', () => {
    const node = {
      channelLink: '/channels/orders',
      messages: [],
    } as unknown as MessageLinksNode;

    const { container } = renderWithTelemetry(node, telemetry);
    expect(container).toBeEmptyDOMElement();
  });
});
