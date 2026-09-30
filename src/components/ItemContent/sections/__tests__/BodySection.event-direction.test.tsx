import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../../types/content.js';
import type { ApiStore } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { nodeTypes, schemaKind } from '../../../../types/common.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { BodySection } from '../BodySection.js';

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

function renderBody(node: Partial<ItemContentNode>) {
  const jotaiStore = createStore();
  const store: ApiStore = {
    schemaStore: {
      'schema-1': {
        id: 'schema-1',
        kind: schemaKind.JSON_SCHEMA,
        data: { type: 'object', properties: { id: { type: 'string', readOnly: true } } },
      },
    },
    exampleStore: {},
    securitySchemeStore: {},
  };
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
    replayDefinition: null,
  });

  render(
    <MemoryRouter initialEntries={[{ pathname: '/webhooks/new-event' }]}>
      <JotaiProvider store={jotaiStore}>
        <ItemIdContext.Provider value="webhooks/new-event">
          <BodySection
            node={
              {
                nodeType: nodeTypes.ITEM,
                variant: 'body',
                schemaId: 'schema-1',
                mediaTypes: ['application/json'],
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

describe('BodySection readOnly/writeOnly direction', () => {
  it('hides readOnly fields in a regular request body', () => {
    const view = renderBody({});
    expect(view).toHaveAttribute('data-skip-read-only', 'true');
    expect(view).toHaveAttribute('data-skip-write-only', 'false');
  });

  it('hides writeOnly fields instead for an event (webhook/callback) body the server sends', () => {
    const view = renderBody({ isEvent: true });
    expect(view).toHaveAttribute('data-skip-read-only', 'false');
    expect(view).toHaveAttribute('data-skip-write-only', 'true');
  });

  it('keeps request direction for a querystring body even inside an event', () => {
    const view = renderBody({ variant: 'querystring-body', isEvent: true });
    expect(view).toHaveAttribute('data-skip-read-only', 'true');
    expect(view).toHaveAttribute('data-skip-write-only', 'false');
  });
});
