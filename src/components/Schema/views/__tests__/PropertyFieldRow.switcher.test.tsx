import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { PropertyFieldRow } from '../PropertyFieldRow.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { switcherLabel } from '../../../../types/schema.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderPropertyFieldRow(
  property: PropertyType,
  overrides?: { level?: number; expandByDefault?: boolean },
) {
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

  return render(
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <PropertyFieldRow
            name="menuItem"
            property={property}
            level={overrides?.level ?? 3}
            expandByDefault={overrides?.expandByDefault ?? false}
          />
        </MarkdownAdapterProvider>
      </Provider>
    </MemoryRouter>,
  );
}

function oneOfProperty(): PropertyType {
  return {
    type: 'object',
    description: 'Favorite item or tag',
    switcher: {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        'Object branch': {
          isDeprecated: false,
          isDefaultMapping: false,
          properties: {
            alphaChild: { type: 'string' },
          },
        },
        'Primitive branch': {
          isDeprecated: false,
          isDefaultMapping: false,
          constraints: ['null'],
        },
      },
    },
  };
}

function getHeaderRow(container: HTMLElement): HTMLElement {
  const propertyItem = container.firstElementChild;
  if (!propertyItem) {
    throw new Error('Expected PropertyFieldRow to render a root element');
  }

  const headerRow = propertyItem.firstElementChild;
  if (!headerRow) {
    throw new Error('Expected PropertyFieldRow to render a header row');
  }

  return headerRow as HTMLElement;
}

function domSnapshotWithoutClasses(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      node.removeAttribute(attr.name);
    });
  });
  [...clone.attributes].forEach((attr) => {
    clone.removeAttribute(attr.name);
  });
  return clone.outerHTML;
}

describe('PropertyFieldRow switcher', () => {
  it('keeps oneOf selector visible and hides variant fields behind a ShowProperty toggle', () => {
    renderPropertyFieldRow(oneOfProperty(), {
      level: 4,
      expandByDefault: false,
    });

    expect(screen.getByText(/One of/)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Object branch' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Show property/ })).toBeInTheDocument();
    expect(screen.queryByText('alphaChild')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Show property/ }));

    expect(screen.getByText('alphaChild')).toBeInTheDocument();
  });

  it('switches to primitive branch without duplicate switcher', () => {
    renderPropertyFieldRow(oneOfProperty(), {
      level: 4,
      expandByDefault: false,
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Primitive branch' }));

    const labels = screen.getAllByText(/One of/);
    expect(labels).toHaveLength(1);
  });

  it('keeps properties-only rows behind ShowProperty when collapsed', () => {
    const property: PropertyType = {
      type: 'object',
      properties: {
        innerOnly: { type: 'string' },
      },
    };

    renderPropertyFieldRow(property, { level: 4, expandByDefault: false });

    expect(screen.getByRole('button', { name: /Show property/ })).toBeInTheDocument();
    expect(screen.queryByText('innerOnly')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Show property/ }));

    expect(screen.getByText('innerOnly')).toBeInTheDocument();
  });

  it('renders and snapshots header badges for required/deprecated/accessMode', () => {
    const property: PropertyType = {
      type: 'string',
      isRequired: true,
      isDeprecated: true,
      accessMode: 'read-only',
    };

    const { container } = renderPropertyFieldRow(property, {
      level: 2,
      expandByDefault: true,
    });
    const headerRow = getHeaderRow(container);

    expect(screen.getByText('required')).toBeInTheDocument();
    expect(screen.getByText('deprecated')).toBeInTheDocument();
    expect(screen.getByText('read-only')).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(headerRow)).toMatchInlineSnapshot(
      `"<div><span><span>menuItem</span></span><em>string</em><span>read-only</span><span>required</span><span>deprecated</span></div>"`,
    );
  });

  it('renders and snapshots header labels for additional/pattern/recursive properties', () => {
    const property: PropertyType = {
      type: 'object',
      isAdditionalProperty: true,
      isPatternProperty: true,
      isCircular: true,
    };

    const { container } = renderPropertyFieldRow(property, {
      level: 2,
      expandByDefault: true,
    });
    const headerRow = getHeaderRow(container);

    expect(screen.getByText('additional property')).toBeInTheDocument();
    expect(screen.getByText('pattern property')).toBeInTheDocument();
    expect(screen.getByText('Recursive')).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(headerRow)).toMatchInlineSnapshot(
      `"<div><span><span>menuItem</span></span><em>object</em><span>additional property</span><span>pattern property</span><span>Recursive</span></div>"`,
    );
  });

  it("renders a string's regex pattern inline in the header row, next to the type", () => {
    const property: PropertyType = {
      type: 'string',
      pattern: '^[a-zA-Z0-9_]{3,16}$',
    };

    const { container } = renderPropertyFieldRow(property, {
      level: 2,
      expandByDefault: true,
    });
    const headerRow = getHeaderRow(container);

    expect(headerRow.textContent).toContain('^[a-zA-Z0-9_]{3,16}$');
    expect(screen.queryByText(/Pattern:/)).not.toBeInTheDocument();
  });
});
