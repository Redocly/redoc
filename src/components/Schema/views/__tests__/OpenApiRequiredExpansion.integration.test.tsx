import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ObjectRenderer } from '../ObjectRenderer.js';
import { apiSpecType } from '../../../../types/common.js';

// Mirrors the production entry point for OpenAPI request/response bodies:
// `<SchemaView expandByDefault level={1} />` (see BodySection/ResponsesSection),
// which cascades into `<ObjectRenderer level={1} expandByDefault />`.
const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

// Root object with two array-of-object fields:
// - `taxNumbers` is REQUIRED      → its nested item field should auto-expand
// - `test` is OPTIONAL but its    → must stay collapsed; a required *child*
//   item field is required          does not expand an optional parent
const rootProperty: PropertyType = {
  type: 'object',
  properties: {
    taxNumbers: {
      type: 'array',
      isRequired: true,
      items: [{ type: 'object', properties: { taxNumberCode: { type: 'string' } } }],
    },
    test: {
      type: 'array',
      isRequired: false,
      items: [
        { type: 'object', properties: { testItemValue: { type: 'string', isRequired: true } } },
      ],
    },
  },
};

function renderBody(opts: { specType?: string; schemasExpansionLevel?: number } = {}) {
  const { specType = apiSpecType.OPENAPI, schemasExpansionLevel } = opts;
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType,
      downloadUrls: [],
      metadata: {},
      ...(schemasExpansionLevel !== undefined ? { schemasExpansionLevel } : {}),
    }),
    replayDefinition: null,
  });

  return render(
    <MemoryRouter initialEntries={[{ pathname: '/op', hash: '' }]}>
      <Provider store={jotaiStore}>
        <ObjectRenderer property={rootProperty} level={1} expandByDefault />
      </Provider>
    </MemoryRouter>,
  );
}

describe.each(['openapi', 'asyncapi'])('default expansion (required-only) for %s', (specType) => {
  it('auto-expands a required array field', () => {
    renderBody({ specType });
    expect(screen.getByText('taxNumberCode')).toBeInTheDocument();
  });

  it('keeps an optional array field collapsed even when its items are required', () => {
    renderBody({ specType });
    expect(screen.queryByText('testItemValue')).not.toBeInTheDocument();
  });

  it('still honors an explicit schemasExpansionLevel for optional fields', () => {
    renderBody({ specType, schemasExpansionLevel: 5 });
    expect(screen.getByText('testItemValue')).toBeInTheDocument();
  });
});
