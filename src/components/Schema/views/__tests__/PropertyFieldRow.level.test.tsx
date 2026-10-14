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
const propertyRendererExpandByDefault: (boolean | undefined)[] = [];

vi.mock('../PropertyRenderer.js', () => ({
  PropertyRenderer: ({ level, expandByDefault }: { level: number; expandByDefault?: boolean }) => {
    propertyRendererLevels.push(level);
    propertyRendererExpandByDefault.push(expandByDefault);
    return <div data-testid={`mock-property-renderer-level-${level}`} />;
  },
}));

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderPropertyFieldRow(
  property: PropertyType,
  level: number,
  expandByDefault = false,
): void {
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
  });

  render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <PropertyFieldRow
          name="menuItem"
          property={property}
          level={level}
          expandByDefault={expandByDefault}
        />
      </Provider>
    </MemoryRouter>,
  );
}

describe('PropertyFieldRow nested level propagation', () => {
  beforeEach(() => {
    propertyRendererLevels.length = 0;
    propertyRendererExpandByDefault.length = 0;
  });

  const oneOfProperty: PropertyType = {
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

  it('passes level + 1 to PropertyRenderer for non-discriminator switchers', () => {
    renderPropertyFieldRow(oneOfProperty, 3);

    expect(propertyRendererLevels).toEqual([4]);
  });

  it.each([true, false])(
    'forwards expandByDefault=%s to PropertyRenderer for non-discriminator switchers',
    (expandByDefault) => {
      renderPropertyFieldRow(oneOfProperty, 3, expandByDefault);

      expect(propertyRendererExpandByDefault).toEqual([expandByDefault]);
    },
  );
});
