import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { switcherLabel } from '../../../../types/schema.js';
import { ObjectRenderer } from '../ObjectRenderer.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

const rootProperty: PropertyType = {
  type: 'object',
  properties: {
    pet: {
      type: 'object',
      switcher: {
        type: 'oneOf',
        label: switcherLabel.ONE_OF,
        options: {
          Cat: {
            isDeprecated: false,
            isDefaultMapping: false,
            properties: { meow: { type: 'string' } },
          },
          Dog: {
            isDeprecated: false,
            isDefaultMapping: false,
            properties: { bark: { type: 'string' } },
          },
        },
      },
    },
  },
};

function renderBody(schemasExpansionLevel?: number | string): void {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      ...(schemasExpansionLevel !== undefined ? { schemasExpansionLevel } : {}),
    }),
  });

  render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <ObjectRenderer property={rootProperty} level={1} expandByDefault />
      </Provider>
    </MemoryRouter>,
  );
}

describe('oneOf property expansion', () => {
  it.each(['all', 5])(
    'expands the selected variant when schemasExpansionLevel is %s',
    (schemasExpansionLevel) => {
      renderBody(schemasExpansionLevel);

      expect(screen.getByText('meow')).toBeInTheDocument();
      expect(screen.queryByText('bark')).not.toBeInTheDocument();
    },
  );

  it('keeps an optional variant collapsed without schemasExpansionLevel', () => {
    renderBody();

    expect(screen.queryByText('meow')).not.toBeInTheDocument();
  });
});
