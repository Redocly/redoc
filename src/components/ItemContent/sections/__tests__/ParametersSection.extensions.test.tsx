import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { RedocConfig } from '@redocly/config';
import type { ItemContentNode } from '../../../../types/content.js';
import type { ApiStore } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { nodeTypes, schemaKind } from '../../../../types/common.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ParametersSection } from '../ParametersSection.js';

function renderParametersSection(showExtensions: RedocConfig['showExtensions']) {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
    showExtensions,
  });
  const store: ApiStore = {
    schemaStore: {
      'schema-1': { id: 'schema-1', kind: schemaKind.JSON_SCHEMA, data: { type: 'string' } },
    },
    exampleStore: {},
    securitySchemeStore: {},
  };
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store,
    options,
    replayDefinition: null,
  });

  const node: ItemContentNode = {
    nodeType: nodeTypes.ITEM,
    variant: 'query',
    parameters: [
      {
        name: 'trace',
        in: 'query',
        schemaId: 'schema-1',
        extensions: { 'x-foo': 'param level' },
      },
    ],
  };

  return render(
    <MemoryRouter>
      <JotaiProvider store={jotaiStore}>
        <ParametersSection node={node} />
      </JotaiProvider>
    </MemoryRouter>,
  );
}

describe('ParametersSection parameter-object extensions', () => {
  it('renders the parameter-level extension on the row', () => {
    const { getByText } = renderParametersSection(['x-foo']);

    expect(getByText('foo:')).toBeTruthy();
    expect(getByText('param level')).toBeTruthy();
  });

  it('renders nothing when showExtensions is off', () => {
    const { queryByText } = renderParametersSection(false);

    expect(queryByText('foo:')).toBeNull();
  });
});
