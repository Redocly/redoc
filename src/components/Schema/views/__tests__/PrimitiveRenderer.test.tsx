import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { PrimitiveRenderer } from '../PrimitiveRenderer.js';

function renderPrimitive(property: PropertyType, options?: Partial<ApiDocsOptions>) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: { ...(options ?? {}) } as ApiDocsOptions,
  } as GlobalStoreAtom);

  return render(
    <Provider store={jotaiStore}>
      <PrimitiveRenderer property={property} />
    </Provider>,
  );
}

describe('PrimitiveRenderer', () => {
  it('should render schema title in parentheses when hideSchemaTitles is false', () => {
    renderPrimitive({ type: 'string', title: 'MyTitle' });
    expect(screen.getByText('(MyTitle)')).toBeInTheDocument();
  });

  it('should hide schema title when hideSchemaTitles is true', () => {
    renderPrimitive({ type: 'string', title: 'MyTitle' }, { hideSchemaTitles: true });
    expect(screen.queryByText('(MyTitle)')).not.toBeInTheDocument();
  });

  it('should render accessMode label and deprecated badge when set on the property', () => {
    renderPrimitive({ type: 'string', accessMode: 'read-only', isDeprecated: true });
    expect(screen.getByText('read-only')).toBeInTheDocument();
    expect(screen.getByText('deprecated')).toBeInTheDocument();
  });

  it('renders x-badges through the styled Tag pipeline (not as bare type labels)', () => {
    const { container } = renderPrimitive({
      type: 'string',
      badges: [
        { name: 'Beta', position: 'before', color: 'rgb(0, 0, 255)' },
        { name: 'Preview', position: 'after', color: 'rgb(128, 0, 128)' },
      ],
    });

    const tagWrappers = container.querySelectorAll('[data-component-name="Tag/Tag"]');
    expect(tagWrappers).toHaveLength(2);
    expect(Array.from(tagWrappers).map((el) => el.textContent)).toEqual(['Beta', 'Preview']);
  });

  it('places before-position badges before the type label and after-position badges after deprecated', () => {
    const { container } = renderPrimitive({
      type: 'string',
      isDeprecated: true,
      badges: [
        { name: 'BEFORE-1', position: 'before', color: 'blue' },
        { name: 'AFTER-1', position: 'after', color: 'green' },
      ],
    });

    const tags = Array.from(container.querySelectorAll('[data-component-name="Tag/Tag"]'));
    const beforeTag = tags.find((el) => el.textContent === 'BEFORE-1');
    const afterTag = tags.find((el) => el.textContent === 'AFTER-1');
    const typeLabel = screen.getByText('string');
    const deprecated = screen.getByText('deprecated');

    if (!beforeTag || !afterTag) throw new Error('Expected both BEFORE-1 and AFTER-1 badge tags');

    const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
    expect(beforeTag.compareDocumentPosition(typeLabel) & FOLLOWING).toBe(FOLLOWING);
    expect(deprecated.compareDocumentPosition(afterTag) & FOLLOWING).toBe(FOLLOWING);
  });
});
