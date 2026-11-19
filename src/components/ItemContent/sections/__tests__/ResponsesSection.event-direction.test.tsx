import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../../types/content.js';

import { nodeTypes } from '../../../../types/common.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { ResponsesSection } from '../ResponsesSection.js';

// Exposes the readOnly/writeOnly filter flags the section hands the schema renderer.
vi.mock('../../../Schema/SchemaView.js', () => ({
  SchemaView: ({
    skipReadOnly,
    skipWriteOnly,
  }: {
    skipReadOnly?: boolean;
    skipWriteOnly?: boolean;
  }) => (
    <div
      data-testid="schema-view"
      data-skip-read-only={String(Boolean(skipReadOnly))}
      data-skip-write-only={String(Boolean(skipWriteOnly))}
    />
  ),
}));

function renderResponses(node: Partial<ItemContentNode>) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/webhooks/new-event' }]}>
      <JotaiProvider store={createStore()}>
        <ItemIdContext.Provider value="webhooks/new-event">
          <ResponsesSection
            node={
              {
                nodeType: nodeTypes.ITEM,
                variant: 'responses',
                responses: [
                  {
                    code: '200',
                    schemaId: 'schema-1',
                    mediaTypes: ['application/json'],
                  },
                ],
                ...node,
              } as unknown as ItemContentNode
            }
          />
        </ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return screen.getByTestId('schema-view');
}

describe('ResponsesSection readOnly/writeOnly direction', () => {
  it('hides writeOnly fields in a regular operation response', () => {
    const view = renderResponses({});
    expect(view).toHaveAttribute('data-skip-read-only', 'false');
    expect(view).toHaveAttribute('data-skip-write-only', 'true');
  });

  it('hides readOnly fields instead for an event (webhook/callback) response the client sends', () => {
    const view = renderResponses({ isEvent: true });
    expect(view).toHaveAttribute('data-skip-read-only', 'true');
    expect(view).toHaveAttribute('data-skip-write-only', 'false');
  });
});
