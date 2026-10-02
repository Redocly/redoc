import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { PropertyRenderer } from '../PropertyRenderer.js';

const objectRendererProps: { expandByDefault?: boolean }[] = [];

vi.mock('../ObjectRenderer.js', () => ({
  ObjectRenderer: (props: { expandByDefault?: boolean }) => {
    objectRendererProps.push({ expandByDefault: props.expandByDefault });
    return <div data-testid="object-renderer" />;
  },
}));

vi.mock('../SwitcherRenderer.js', () => ({
  SwitcherRenderer: () => <div data-testid="switcher-renderer" />,
}));

vi.mock('../ArrayRenderer.js', () => ({
  ArrayRenderer: () => <div data-testid="array-renderer" />,
}));

vi.mock('../PrimitiveRenderer.js', () => ({
  PrimitiveRenderer: () => <div data-testid="primitive-renderer" />,
}));

function renderPropertyRenderer(property: PropertyType, level: number, expandByDefault?: boolean) {
  objectRendererProps.length = 0;

  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      metadata: {},
      basePath: '',
    }),
    replayDefinition: null,
  });

  return render(
    <Provider store={jotaiStore}>
      <PropertyRenderer property={property} level={level} expandByDefault={expandByDefault} />
    </Provider>,
  );
}

const objectProperty: PropertyType = {
  type: 'object',
  properties: { name: { type: 'string' } },
};

describe('PropertyRenderer expandByDefault passthrough', () => {
  beforeEach(() => {
    objectRendererProps.length = 0;
  });

  it('passes expandByDefault=true to ObjectRenderer', () => {
    renderPropertyRenderer(objectProperty, 2, true);
    expect(objectRendererProps[0]?.expandByDefault).toBe(true);
  });

  it('passes expandByDefault=false to ObjectRenderer', () => {
    renderPropertyRenderer(objectProperty, 2, false);
    expect(objectRendererProps[0]?.expandByDefault).toBe(false);
  });

  it('passes expandByDefault=undefined to ObjectRenderer when not provided', () => {
    renderPropertyRenderer(objectProperty, 2);
    expect(objectRendererProps[0]?.expandByDefault).toBeUndefined();
  });
});
