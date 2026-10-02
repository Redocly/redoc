import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';
import type { DeepLinkSectionValue } from '../../../../hooks/useDeepLinkSection.js';

import { PropertyFieldRow } from '../PropertyFieldRow.js';
import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderRowToHtml(section: DeepLinkSectionValue | null) {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      maxDisplayedEnumValues: 10,
      basePath: '',
    }),
    replayDefinition: null,
  });

  const property: PropertyType = { type: 'string' };

  return renderToString(
    createElement(
      JotaiProvider,
      { store },
      createElement(
        MemoryRouter,
        undefined,
        createElement(
          ItemIdContext.Provider,
          { value: '/test-op' },
          createElement(
            DeepLinkSectionContext.Provider,
            { value: section },
            createElement(PropertyFieldRow, {
              name: 'child',
              property,
              level: 1,
              fieldParentsName: ['parent'],
            }),
          ),
        ),
      ),
    ),
  );
}

// Field-level deep-link ids must be present in the SSR output (first render,
// no effects) — the section context resolves synchronously during render.
describe('PropertyFieldRow SSR deep links', () => {
  it('renders the full field id for a path-only section', () => {
    const html = renderRowToHtml({ pathOnly: true });

    expect(html).toContain('id="test-op/path=parent/child"');
  });

  it('renders the full field id for an OpenAPI request section', () => {
    const html = renderRowToHtml({ t: 'request', in: 'query' });

    expect(html).toContain('id="test-op/t=request&amp;in=query&amp;path=parent/child"');
  });

  it('renders no field-level suffix when no section context is provided', () => {
    const html = renderRowToHtml(null);

    expect(html).not.toContain('&path=parent/child');
  });
});
