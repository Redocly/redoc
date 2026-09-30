import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { switcherLabel } from '../../../../types/schema.js';
import { PropertyFieldRow } from '../PropertyFieldRow.js';

const propertyRendererLevels: number[] = [];

vi.mock('../PropertyRenderer.js', () => ({
  PropertyRenderer: ({ level }: { level: number }) => {
    propertyRendererLevels.push(level);
    return <div data-testid={`mock-property-renderer-level-${level}`} />;
  },
}));

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderPropertyFieldRow(property: PropertyType, level: number): void {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
  });
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options,
    replayDefinition: null,
  });

  render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <PropertyFieldRow
          name="menuItem"
          property={property}
          level={level}
          expandByDefault={false}
        />
      </Provider>
    </MemoryRouter>,
  );
}

describe('PropertyFieldRow nested level propagation', () => {
  beforeEach(() => {
    propertyRendererLevels.length = 0;
  });

  it('passes level + 1 to PropertyRenderer for non-discriminator switchers', () => {
    const property: PropertyType = {
      type: 'object',
      switcher: {
        type: 'oneOf',
        label: switcherLabel.ONE_OF,
        options: {
          objectVariant: {
            isDeprecated: false,
            isDefaultMapping: false,
            properties: {
              child: { type: 'string' },
            },
          },
        },
      },
    };

    renderPropertyFieldRow(property, 3);

    expect(propertyRendererLevels).toEqual([4]);
  });
});
