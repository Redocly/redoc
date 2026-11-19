import { act, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createStore } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { CallbackPayloadPanelItem } from '../../../../types/content.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';
import type { Fixture } from '../../../__tests__/harness.js';

import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { findNodes, openApiFixture, renderWithFixture } from '../../../__tests__/harness.js';
import { CallbackPayloadItem } from '../CallbackPayloadItem.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

const ITEM_ID = 'test/item';

const document = {
  openapi: '3.0.3',
  info: { title: 'Jobs API', version: '1.0.0' },
  paths: {
    '/jobs': {
      post: {
        operationId: 'createJob',
        responses: { '202': { description: 'Accepted' } },
        callbacks: {
          jobDone: {
            '{$request.body#/callbackUrl}': {
              post: {
                'x-codeSamples': [
                  { lang: 'shell', label: 'Verify', source: 'curl verify-signature.sh' },
                ],
                requestBody: {
                  content: {
                    'application/json': {
                      schema: { type: 'object', properties: { jobId: { type: 'string' } } },
                      examples: {
                        success: { summary: 'Success', value: { jobId: 'job-ok' } },
                        failure: { summary: 'Failure', value: { jobId: 'job-failed' } },
                      },
                    },
                    'application/xml': {
                      schema: { type: 'object', properties: { jobId: { type: 'string' } } },
                      examples: {
                        xmlFirst: { summary: 'Xml first', value: { jobId: 'job-xml-1' } },
                        xmlSecond: { summary: 'Xml second', value: { jobId: 'job-xml-2' } },
                      },
                    },
                  },
                },
                responses: { '200': { description: 'OK' } },
              },
            },
          },
        },
      },
    },
  },
} as unknown as OpenAPIDefinition;

let fixture: Fixture;
let node: CallbackPayloadPanelItem;

beforeAll(async () => {
  fixture = await openApiFixture(document);
  [node] = findNodes<CallbackPayloadPanelItem>(fixture.items, (n) => n.kind === 'callback-payload');
});

afterEach(() => {
  cleanup();
});

function renderItem(selected?: string) {
  const store = createStore();
  if (selected) store.set(itemStoreAtom(ITEM_ID), { selectedCallback: selected });
  return renderWithFixture(<CallbackPayloadItem node={node} />, fixture, {
    itemId: ITEM_ID,
    store,
  });
}

function pick(trigger: HTMLElement, label: string): void {
  fireEvent.click(trigger);
  const item = screen.getAllByText(label).find((el) => el.closest('[role="menuitem"]'));
  if (!item) throw new Error(`Menu item "${label}" not found`);
  fireEvent.click(item);
}

describe('CallbackPayloadItem', () => {
  it('is hidden until its callback is selected', () => {
    const { container, jotaiStore } = renderItem();
    expect(container).toBeEmptyDOMElement();

    act(() => jotaiStore.set(itemStoreAtom(ITEM_ID), { selectedCallback: node.callbackName }));

    expect(screen.getByRole('button', { name: 'Payload' })).toBeInTheDocument();
  });

  it('offers Payload plus one tab per definition sample', () => {
    renderItem(node.callbackName);

    fireEvent.click(screen.getByRole('button', { name: 'Payload' }));

    const items = screen.getAllByRole('menuitem').map((el) => el.textContent);
    expect(items).toEqual(['Payload', 'Verify']);
  });

  it('shows the sample source after picking a definition sample', () => {
    renderItem(node.callbackName);

    pick(screen.getByRole('button', { name: 'Payload' }), 'Verify');

    expect(screen.getByText(/curl verify-signature\.sh/)).toBeInTheDocument();
  });

  it('changes the payload when the second example is picked', () => {
    const { container } = renderItem(node.callbackName);
    expect(container).toHaveTextContent('job-ok');

    pick(screen.getByRole('button', { name: 'Example' }), 'Failure');

    expect(container).toHaveTextContent('job-failed');
  });

  it('resets to the first example when the media type changes', () => {
    const { container } = renderItem(node.callbackName);
    pick(screen.getByRole('button', { name: 'Example' }), 'Failure');
    expect(container).toHaveTextContent('job-failed');

    pick(screen.getByRole('button', { name: 'Payload media type' }), 'application/xml');

    expect(container).toHaveTextContent('job-xml-1');
    expect(within(container).getByRole('button', { name: 'Example' })).toHaveTextContent(
      'Xml first',
    );
  });
});
