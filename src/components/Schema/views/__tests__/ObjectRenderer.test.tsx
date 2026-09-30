import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ObjectRenderer } from '../ObjectRenderer.js';

vi.mock('../PropertyFieldRow.js', () => ({
  PropertyFieldRow: ({ name }: { name: string }) => (
    <div data-testid={`mock-field-${name}`}>{name}</div>
  ),
}));

function renderObject(
  property: PropertyType,
  propsOverrides?: { skipReadOnly?: boolean; level?: number },
  options: { sortRequiredPropsFirst?: boolean } = {},
) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      ...options,
    }),
  } as GlobalStoreAtom);

  return render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <ObjectRenderer
          property={property}
          level={propsOverrides?.level ?? 1}
          skipReadOnly={propsOverrides?.skipReadOnly}
        />
      </Provider>
    </MemoryRouter>,
  );
}

describe('ObjectRenderer', () => {
  describe('requiredPropsFirst', () => {
    const property: PropertyType = {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', isRequired: true },
        secret: { type: 'string' },
        code: { type: 'string', isRequired: true },
      },
    };

    it('keeps the spec property order by default', () => {
      renderObject(property);
      const names = screen.getAllByTestId(/mock-field-/).map((el) => el.textContent);
      expect(names).toEqual(['id', 'name', 'secret', 'code']);
    });
  });

  it('should not render the schema title even when property.title is set', () => {
    renderObject({
      type: 'object',
      title: 'MyTitle',
      properties: { id: { type: 'string' } },
    });
    expect(screen.queryByText('(MyTitle)')).not.toBeInTheDocument();
  });

  it('should render a constraints badge only when the type carries constraints', () => {
    const { container } = renderObject({
      type: 'object',
      properties: { id: { type: 'string' } },
    });
    expect(container.querySelectorAll('span').length).toBe(0);
  });

  describe('constraint badge level gating', () => {
    const property: PropertyType = {
      type: 'object, = 1 property',
      properties: { id: { type: 'string' } },
    };

    it('renders the constraint badge for the top-level body object (level 1)', () => {
      renderObject(property, { level: 1 });
      expect(screen.getByText('= 1 property')).toBeInTheDocument();
    });

    it('renders the constraint badge for a root rendered at level 0', () => {
      renderObject(property, { level: 0 });
      expect(screen.getByText('= 1 property')).toBeInTheDocument();
    });

    it.each([2, 3])(
      'does not render the constraint badge for a nested object (level %i)',
      (level) => {
        // Nested objects already show their constraint inline in the field
        // header, so the badge would duplicate it (e.g. "= 1 property" inside
        // softLimit).
        renderObject(property, { level });
        expect(screen.queryByText('= 1 property')).not.toBeInTheDocument();
      },
    );
  });

  it('surfaces the constraint as a standalone badge with no leading comma', () => {
    renderObject({
      type: 'object, non-empty',
      properties: { id: { type: 'string' } },
    });
    expect(screen.getByText('non-empty')).toBeInTheDocument();
    expect(screen.queryByText(', non-empty')).not.toBeInTheDocument();
  });

  it('does not treat the " or null" type suffix as a constraint badge', () => {
    const { container } = renderObject({
      type: 'object or null',
      properties: { id: { type: 'string' } },
    });
    expect(screen.queryByText('or null')).not.toBeInTheDocument();
    expect(container.querySelectorAll('span').length).toBe(0);
  });

  it('still surfaces real constraints on a nullable object', () => {
    renderObject({
      type: 'object or null, non-empty',
      properties: { id: { type: 'string' } },
    });
    expect(screen.getByText('non-empty')).toBeInTheDocument();
    expect(screen.queryByText('or null')).not.toBeInTheDocument();
  });

  it('should render a range constraint badge without splitting it', () => {
    renderObject({
      type: 'object, [ 1 .. 5 ] properties',
      properties: { id: { type: 'string' } },
    });
    expect(screen.getByText('[ 1 .. 5 ] properties')).toBeInTheDocument();
  });

  it('should omit read-only properties when skipReadOnly is true', () => {
    renderObject(
      {
        type: 'object',
        properties: {
          visible: { type: 'string' },
          hidden: { type: 'string', accessMode: 'read-only' },
        },
      },
      { skipReadOnly: true },
    );
    expect(screen.getByTestId('mock-field-visible')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-field-hidden')).not.toBeInTheDocument();
  });
});
