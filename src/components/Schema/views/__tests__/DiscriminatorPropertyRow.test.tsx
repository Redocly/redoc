import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactElement } from 'react';
import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType, SwitcherOptionType } from '../../../../types/schema.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { DiscriminatorPropertyRow } from '../DiscriminatorPropertyRow.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderRow(
  property: PropertyType,
  options?: { hidePropertiesPrefix?: boolean; fieldParentsName?: string[] },
): ReactElement {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      maxDisplayedEnumValues: 10,
      hidePropertiesPrefix: options?.hidePropertiesPrefix ?? false,
    }),
    replayDefinition: null,
  });

  return (
    <MemoryRouter>
      <Provider store={jotaiStore}>
        <DiscriminatorPropertyRow
          fieldName="kind"
          property={property}
          isFirst
          mappingKeys={['a', 'b', 'c']}
          optionEntries={[
            [
              'a',
              {
                isDeprecated: false,
                isDefaultMapping: false,
              } as SwitcherOptionType,
            ],
            [
              'b',
              {
                isDeprecated: false,
                isDefaultMapping: false,
              } as SwitcherOptionType,
            ],
            [
              'c',
              {
                isDeprecated: false,
                isDefaultMapping: false,
              } as SwitcherOptionType,
            ],
          ]}
          activeIdx={0}
          fieldParentsName={options?.fieldParentsName ?? []}
          onSelect={vi.fn()}
        />
      </Provider>
    </MemoryRouter>
  );
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

describe('DiscriminatorPropertyRow', () => {
  it('renders mapping keys as enum fallback and snapshots enum subtree', () => {
    render(renderRow({ type: 'string' }));

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow).toHaveTextContent('Enum:');
    expect(enumRow).toHaveTextContent('"a"');
    expect(enumRow).toHaveTextContent('"b"');
    expect(enumRow).toHaveTextContent('"c"');
    expect(domSnapshotWithoutClasses(enumRow)).toMatchInlineSnapshot(
      `"<div><span>Enum:</span><span>"a"</span><span>"b"</span><span>"c"</span></div>"`,
    );
  });

  it('renders Value label for single enum value and snapshots enum subtree', () => {
    render(renderRow({ type: 'string', enum: ['single'] }));

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow).toHaveTextContent('Value:');
    expect(enumRow).toHaveTextContent('"single"');
    expect(domSnapshotWithoutClasses(enumRow)).toMatchInlineSnapshot(
      `"<div><span>Value:</span><span>"single"</span></div>"`,
    );
  });

  it('renders trailing Value detail only when const is provided', () => {
    const { rerender } = render(renderRow({ type: 'string' }));
    expect(screen.queryByText('Value:')).not.toBeInTheDocument();

    rerender(renderRow({ type: 'string', const: 'a' }));
    const labels = screen.getAllByText('Value:');
    expect(labels).toHaveLength(1);
    expect(labels[0].parentElement).toHaveTextContent('a');
  });

  it('calls onSelect with clicked variant index', () => {
    const onSelect = vi.fn();
    const jotaiStore = createStore();
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: emptyStore,
      options: normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        basePath: '',
        maxDisplayedEnumValues: 10,
      }),
      replayDefinition: null,
    });

    render(
      <MemoryRouter>
        <Provider store={jotaiStore}>
          <DiscriminatorPropertyRow
            fieldName="kind"
            property={{ type: 'string' }}
            isFirst
            mappingKeys={['a', 'b']}
            optionEntries={[
              [
                'a',
                {
                  isDeprecated: false,
                  isDefaultMapping: false,
                } as SwitcherOptionType,
              ],
              [
                'b',
                {
                  isDeprecated: false,
                  isDefaultMapping: false,
                } as SwitcherOptionType,
              ],
            ]}
            activeIdx={0}
            fieldParentsName={[]}
            onSelect={onSelect}
          />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'b' }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('strips variant deep-link markers from the breadcrumb prefix', () => {
    render(renderRow({ type: 'string' }, { fieldParentsName: ['pet&d=0', '&oneof=1'] }));

    // The plain field name shows; the bare marker entry contributes nothing.
    expect(screen.getByText(/pet\./)).toBeInTheDocument();
    expect(screen.queryByText(/&d=0/)).not.toBeInTheDocument();
    expect(screen.queryByText(/&oneof=1/)).not.toBeInTheDocument();
  });

  it('strips a mid-path marker without truncating the rest of the breadcrumb', () => {
    // Reproduces "_embedded.quote&d=0.order.items[]" — the marker sits mid-path,
    // so the segments after it (.order.items[]) must be preserved.
    render(
      renderRow({ type: 'string' }, { fieldParentsName: ['_embedded.quote&d=0.order.items[]'] }),
    );

    expect(screen.getByText(/_embedded\.quote\.order\.items\[\]\./)).toBeInTheDocument();
    expect(screen.queryByText(/&d=0/)).not.toBeInTheDocument();
  });

  it('renders the type label before the required label (string, then required)', () => {
    const { container } = render(renderRow({ type: 'string', isRequired: true }));
    const text = container.textContent ?? '';
    expect(text).toContain('string');
    expect(text).toContain('required');
    // The type must appear before the "required" label in DOM order.
    expect(text.indexOf('string')).toBeLessThan(text.indexOf('required'));
  });

  it('renders x-badges by position: `before` ahead of the field name, others after the type', () => {
    const { container } = render(
      renderRow({
        type: 'string',
        badges: [
          { name: 'BetaBadge', position: 'before', color: 'blue' },
          { name: 'AfterBadge', position: 'after', color: 'green' },
        ],
      }),
    );
    const text = container.textContent ?? '';

    expect(text).toContain('BetaBadge');
    expect(text).toContain('AfterBadge');
    expect(text.indexOf('BetaBadge')).toBeLessThan(text.indexOf('kind'));
    expect(text.indexOf('AfterBadge')).toBeGreaterThan(text.indexOf('string'));
  });

  it('respects hidePropertiesPrefix option', () => {
    const firstRender = render(
      renderRow({ type: 'string' }, { fieldParentsName: ['parent', 'child'] }),
    );
    expect(screen.getByText(/parent\./)).toBeInTheDocument();
    expect(screen.getByText(/child\./)).toBeInTheDocument();
    firstRender.unmount();

    render(
      renderRow(
        { type: 'string' },
        {
          fieldParentsName: ['parent', 'child'],
          hidePropertiesPrefix: true,
        },
      ),
    );
    expect(screen.queryByText(/parent\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/child\./)).not.toBeInTheDocument();
  });
});
