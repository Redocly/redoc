import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../../types/content.js';
import type { ApiStore } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { nodeTypes, schemaKind } from '../../../../types/common.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { CallbackScopeContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { BodySection } from '../BodySection.js';
import { ParametersSection } from '../ParametersSection.js';

// Stands in for the real schema renderer (whose styles jsdom can't parse) while still
// building field links through `useSchemaFieldDeepLink` — the seam under test.
vi.mock('../../../Schema/SchemaView.js', async () => {
  const { useSchemaFieldDeepLink } =
    await import('../../../Schema/hooks/useSchemaFieldDeepLink.js');

  return {
    SchemaView: ({
      schema,
      schemaId,
    }: {
      schema?: { properties?: Record<string, unknown> };
      schemaId?: string;
    }) => {
      const firstProperty = Object.keys(schema?.properties ?? {})[0] ?? (schemaId ? 'jobId' : '');
      const propertyDeepLink = useSchemaFieldDeepLink(firstProperty);
      if (!firstProperty) return null;

      return (
        <a aria-label={`link to ${firstProperty}`} href={propertyDeepLink}>
          {firstProperty}
        </a>
      );
    },
  };
});

const ITEM_ID = 'other/createjob';
const CALLBACK_ID = 'jobCompleted/post';

function renderInCallback(section: ReactElement) {
  const jotaiStore = createStore();
  const store: ApiStore = {
    schemaStore: {
      'schema-1': {
        id: 'schema-1',
        kind: schemaKind.JSON_SCHEMA,
        data: { type: 'object', properties: { jobId: { type: 'string' } } },
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

  return render(
    <MemoryRouter initialEntries={[{ pathname: `/${ITEM_ID}` }]}>
      <JotaiProvider store={jotaiStore}>
        <ItemIdContext.Provider value={ITEM_ID}>
          <CallbackScopeContext.Provider value={CALLBACK_ID}>
            {section}
          </CallbackScopeContext.Provider>
        </ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );
}

function fieldHrefs(): string[] {
  return screen
    .getAllByRole('link', { name: /^link to /i })
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => href.includes('path='));
}

describe('field deep links inside a callback', () => {
  it('names the callback in a request-body field link', () => {
    renderInCallback(
      <BodySection
        node={
          {
            nodeType: nodeTypes.ITEM,
            variant: 'body',
            schemaId: 'schema-1',
            mediaTypes: ['application/json'],
          } as unknown as ItemContentNode
        }
      />,
    );

    const hrefs = fieldHrefs();
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toContain('cb=jobcompleted/post');
    }
  });

  it('names the callback in a parameter field link', () => {
    renderInCallback(
      <ParametersSection
        node={
          {
            nodeType: nodeTypes.ITEM,
            variant: 'query',
            parameters: [{ name: 'attempt', in: 'query', schemaId: 'schema-1' }],
          } as unknown as ItemContentNode
        }
      />,
    );

    const hrefs = fieldHrefs();
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toContain('cb=jobcompleted/post');
    }
  });
});
