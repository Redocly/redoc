import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ItemContentNode } from '../../../../types/content.js';

import { SECTION_ATTR } from '../../../../constants/openapi.js';
import { TelemetryContext } from '../../../../contexts/telemetry.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../../jotai/itemStore.js';
import { MessagesSection } from '../MessagesSection.js';
import { reassertUrlHash } from '../../../../hooks/useUrlHashReassert.js';

const ITEM_ID = 'rides/topics/ride-requests';

function renderMessagesSection(hash: string, store = createStore()) {
  // `MessagesSection` reads `window.location.hash` directly via the
  // hash-only `useUrlHash` subscription — tests must set jsdom's hash.
  window.location.hash = hash;
  const node = {
    messages: [
      {
        name: 'rideRequest',
        label: 'Ride Request',
        summary: 'Message summary: ride request',
      },
      {
        name: 'rideRequestCancellation',
        label: 'Ride Request Cancellation',
        summary: 'Message summary: ride request cancellation',
      },
    ],
  } as ItemContentNode;

  const utils = render(
    <MemoryRouter initialEntries={[{ pathname: `/asyncapi/${ITEM_ID}`, hash }]}>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={ITEM_ID}>
          <MessagesSection node={node} />
        </ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );

  return { ...utils, store };
}

describe('MessagesSection', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('selects message from encoded m= deep-link value and shows switcher deep-link anchor', () => {
    renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequestCancellation`);

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
    expect(screen.getByLabelText('link to Message selector')).toBeInTheDocument();
    expect(screen.getByText(/Accepts/).closest(`[${SECTION_ATTR}]`)).toHaveAttribute(
      SECTION_ATTR,
      `${ITEM_ID}/messages`,
    );
  });

  it('matches the message case-insensitively from the m= hash value', () => {
    renderMessagesSection(`#${ITEM_ID}/messages&m=RIDEREQUESTCANCELLATION`);

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
  });

  it('shows the first message by default and does not seed the store without a hash', () => {
    const { store } = renderMessagesSection('');

    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe('');
  });

  it('lets a deep link select its message even when a different tab is already stored', () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeMessageKey: 'rideRequest' });

    renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequestCancellation`, store);

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
  });

  it('keeps user-selected tab when URL hash still references a different message', () => {
    const store = createStore();
    renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequest`, store);

    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ride Request Cancellation'));

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe(
      'rideRequestCancellation',
    );
  });

  it('allows switching between tabs repeatedly after a deep-link sets the hash', () => {
    const store = createStore();
    renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequestCancellation`, store);

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ride Request'));
    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ride Request Cancellation'));
    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ride Request'));
    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe(
      'rideRequest',
    );
  });

  it('keeps user-selected tab when parent re-renders with a new messages reference and URL still has m= (regression)', () => {
    const store = createStore();

    const buildMessages = (): ItemContentNode['messages'] => [
      {
        name: 'rideRequest',
        label: 'Ride Request',
        summary: 'Message summary: ride request',
      },
      {
        name: 'rideRequestCancellation',
        label: 'Ride Request Cancellation',
        summary: 'Message summary: ride request cancellation',
      },
    ];

    const initialHash = `#${ITEM_ID}/messages&m=rideRequest`;
    const initialNode = { messages: buildMessages() } as ItemContentNode;

    const { rerender } = render(
      <MemoryRouter initialEntries={[{ pathname: `/asyncapi/${ITEM_ID}`, hash: initialHash }]}>
        <JotaiProvider store={store}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <MessagesSection node={initialNode} />
          </ItemIdContext.Provider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ride Request Cancellation'));
    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={[{ pathname: `/asyncapi/${ITEM_ID}`, hash: initialHash }]}>
        <JotaiProvider store={store}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <MessagesSection node={{ messages: buildMessages() } as ItemContentNode} />
          </ItemIdContext.Provider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
  });

  it('does not overwrite a user selection on unrelated re-renders', () => {
    const store = createStore();
    const { rerender } = renderMessagesSection('', store);

    fireEvent.click(screen.getByText('Ride Request Cancellation'));
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe(
      'rideRequestCancellation',
    );

    rerender(
      <MemoryRouter initialEntries={[{ pathname: `/asyncapi/${ITEM_ID}`, hash: '' }]}>
        <JotaiProvider store={store}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <MessagesSection
              node={
                {
                  messages: [
                    {
                      name: 'rideRequest',
                      label: 'Ride Request',
                      summary: 'Message summary: ride request',
                    },
                    {
                      name: 'rideRequestCancellation',
                      label: 'Ride Request Cancellation',
                      summary: 'Message summary: ride request cancellation',
                    },
                  ],
                } as ItemContentNode
              }
            />
          </ItemIdContext.Provider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe(
      'rideRequestCancellation',
    );
  });

  it('keeps manual switching working after scroll-spy silently rewrites the URL (replaceState)', () => {
    renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequest`);

    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();

    window.history.replaceState({}, '', `#${ITEM_ID}/messages&m=riderequest&t=payload`);

    fireEvent.click(screen.getByText('Ride Request Cancellation'));

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(screen.queryByText('Message summary: ride request')).not.toBeInTheDocument();
  });

  it('re-applies the m= deep link on reassert after the user switched away', async () => {
    const { store } = renderMessagesSection(`#${ITEM_ID}/messages&m=rideRequestCancellation`);
    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();

    // The reader switches manually…
    fireEvent.click(screen.getByText('Ride Request'));
    expect(screen.getByText('Message summary: ride request')).toBeInTheDocument();

    // …then re-lands on the same search result: the hash string is unchanged, so the
    // bridge bumps the reassert token instead of firing hashchange.
    const { act } = await import('@testing-library/react');
    act(() => reassertUrlHash());

    expect(screen.getByText('Message summary: ride request cancellation')).toBeInTheDocument();
    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeMessageKey' }))).toBe(
      'rideRequestCancellation',
    );
  });

  it('fires sendSwitchMessageClickedMessage when the user selects a different message', () => {
    const telemetry = { sendSwitchMessageClickedMessage: vi.fn() };
    const node = {
      messages: [
        { name: 'rideRequest', label: 'Ride Request' },
        { name: 'rideRequestCancellation', label: 'Ride Request Cancellation' },
      ],
    } as ItemContentNode;

    render(
      <MemoryRouter initialEntries={[{ pathname: `/asyncapi/${ITEM_ID}`, hash: '' }]}>
        <JotaiProvider store={createStore()}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <TelemetryContext.Provider value={telemetry as never}>
              <MessagesSection node={node} />
            </TelemetryContext.Provider>
          </ItemIdContext.Provider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Ride Request Cancellation'));

    expect(telemetry.sendSwitchMessageClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendSwitchMessageClickedMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'switchMessageButton',
      object: 'button',
      index: expect.any(Number),
      total: expect.any(Number),
    });
    expect(telemetry.sendSwitchMessageClickedMessage.mock.calls[0][0][0]).not.toHaveProperty(
      'message',
    );
  });
});
