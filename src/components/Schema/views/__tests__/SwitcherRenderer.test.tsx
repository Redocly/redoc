import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, within } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactNode } from 'react';
import type { PropertyType, SwitcherOptionType, SwitcherType } from '../../../../types/schema.js';
import type { ApiItem } from '../../../../types/store.js';
import type { DeepLinkSectionValue } from '../../../../hooks/useDeepLinkSection.js';

import 'jest-styled-components';
import { contentType } from '../../../../types/common.js';
import { buildVariantStoreId, itemStoreAtom } from '../../../../jotai/itemStore.js';
import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { LEVEL_COLORS } from '../../utils.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { switcherLabel } from '../../../../types/schema.js';
import { appendVariantSuffix } from '../../../../utils/deep-link.js';
import { useVariantIndexFromHash } from '../../hooks/useVariantIndexFromHash.js';
import { SwitcherRenderer } from '../SwitcherRenderer.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';

const TEST_ITEM_ID = 'test-item';

function makeSwitcherProperty(
  switcher: SwitcherType,
  properties?: Record<string, PropertyType>,
): PropertyType {
  return {
    type: 'object',
    switcher,
    properties,
  };
}

function opt(
  partial: Partial<SwitcherOptionType> & {
    properties?: Record<string, PropertyType>;
  },
): SwitcherOptionType {
  return {
    isDeprecated: false,
    isDefaultMapping: false,
    properties: partial.properties ?? {},
    ...partial,
  };
}

function makeDiscriminator(
  propertyName: string,
  options: Record<string, { properties?: Record<string, PropertyType>; switcher?: SwitcherType }>,
): SwitcherType {
  return {
    type: 'discriminator',
    label: 'Discriminator',
    propertyName,
    options: Object.fromEntries(
      Object.entries(options).map(([key, val]) => [
        key,
        opt({
          properties: val.properties ?? {},
          ...val,
        }),
      ]),
    ),
  };
}

function renderWithStore(ui: React.ReactElement) {
  const store = createStore();
  const result = render(
    <MemoryRouter>
      <JotaiProvider store={store}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={TEST_ITEM_ID}>{ui}</ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return { ...result, store };
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

function renderedFieldNames(container: HTMLElement): (string | null)[] {
  return [...container.querySelectorAll('.schema-name')].map((name) => name.textContent);
}

describe('SwitcherRenderer discriminator state keys', () => {
  it('invokes onOneOfChange when discriminator tab changes and jsonPointer is set', () => {
    const onOneOfChange = vi.fn();
    const switcher: SwitcherType = {
      ...makeDiscriminator('method', {
        a: { properties: { method: { type: 'string' } } },
        b: { properties: { method: { type: 'string' } } },
      }),
      jsonPointer: '/components/schemas/Payment',
    };

    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer
        property={property}
        level={0}
        fieldParentsName={[]}
        onOneOfChange={onOneOfChange}
      />,
    );

    fireEvent.click(screen.getByText('b'));
    expect(onOneOfChange).toHaveBeenCalledWith({
      pointer: '/components/schemas/Payment',
      index: 1,
    });
    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator['method']).toBe(1);
  });

  it('should not collide state between nested discriminators with same label', () => {
    const innerDiscriminator = makeDiscriminator('name', {
      'Apple Pay': {
        properties: {
          name: { type: 'string' },
          displayName: { type: 'string' },
        },
      },
      'Google Pay': {
        properties: {
          name: { type: 'string' },
          merchantName: { type: 'string' },
        },
      },
    });

    const featureOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        PaymentCardFeature: {
          isDeprecated: false,
          isDefaultMapping: false,
          properties: {
            name: { type: 'string' },
          },
          switcher: innerDiscriminator,
        },
        null: { isDeprecated: false, isDefaultMapping: false },
      },
    };

    const rootDiscriminator = makeDiscriminator('method', {
      'payment-card': {
        properties: {
          method: { type: 'string' },
          feature: {
            type: 'object',
            switcher: featureOneOf,
          },
        },
      },
      ach: {
        properties: {
          method: { type: 'string' },
        },
      },
    });

    const property = makeSwitcherProperty(rootDiscriminator);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    const segments = screen.getAllByText('payment-card');
    expect(segments.length).toBeGreaterThan(0);

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['method']).toBeUndefined();

    const achSegment = screen.getByText('ach');
    fireEvent.click(achSegment);

    const stateAfterClick = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfterClick['method']).toBe(1);

    const pcSegment = screen.getByText('payment-card');
    fireEvent.click(pcSegment);

    const stateAfterClickBack = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfterClickBack['method']).toBe(0);
  });

  it('should use path-based keys for nested discriminators', () => {
    const disc1 = makeDiscriminator('mode', {
      all: { properties: { mode: { type: 'string' } } },
      subset: { properties: { mode: { type: 'string' } } },
    });

    const disc2 = makeDiscriminator('mode', {
      unknown: { properties: { mode: { type: 'string' } } },
      restricted: { properties: { mode: { type: 'string' } } },
    });

    const { store } = renderWithStore(
      <>
        <SwitcherRenderer
          property={makeSwitcherProperty(disc1)}
          level={1}
          fieldParentsName={['currencies']}
        />
        <SwitcherRenderer
          property={makeSwitcherProperty(disc2)}
          level={1}
          fieldParentsName={['countries']}
        />
      </>,
    );

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['currencies/mode']).toBeUndefined();
    expect(state['countries/mode']).toBeUndefined();

    const subsetSegment = screen.getByText('subset');
    fireEvent.click(subsetSegment);

    const stateAfter = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfter['currencies/mode']).toBe(1);
    expect(stateAfter['countries/mode']).toBeUndefined();
    const restrictedSegment = screen.getByText('restricted');
    fireEvent.click(restrictedSegment);

    const stateAfter2 = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfter2['currencies/mode']).toBe(1);
    expect(stateAfter2['countries/mode']).toBe(1);
  });

  it('renders no enum row from the mapping keys, and no trailing Value', () => {
    const switcher = makeDiscriminator('type', {
      'three-columns': opt({
        properties: { col: { type: 'string' } },
      }),
      'two-columns': opt({
        properties: { col: { type: 'string' } },
      }),
      'one-column': opt({
        properties: { col: { type: 'string' } },
      }),
      list: opt({ properties: { col: { type: 'string' } } }),
    });

    const property = makeSwitcherProperty(switcher, {
      type: { type: 'string' },
      message: { type: 'string' },
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    expect(screen.queryByTestId('schema-enum-values')).toBeNull();
    expect(screen.queryByText(/^Value:$/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('list'));
    expect(screen.queryByText(/^Value:$/)).not.toBeInTheDocument();
  });

  it('renders Value-labeled row before discriminator for single-value enum (TimelineAction-style)', () => {
    const switcher = makeDiscriminator('action', {
      'redemption-cancel': opt({
        properties: {
          action: {
            type: 'string',
            enum: ['redemption-cancel'],
          },
          id: { type: 'string' },
        },
      }),
      'resend-email': opt({
        properties: {
          action: { type: 'string', enum: ['resend-email'] },
          id: { type: 'string' },
        },
      }),
    });

    const property = makeSwitcherProperty(switcher, {});

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow.textContent).toContain('Value:');
    expect(enumRow.textContent).toContain('"redemption-cancel"');

    fireEvent.click(screen.getByText('resend-email'));
    expect(enumRow.textContent).toContain('"resend-email"');
  });

  it('renders Value after discriminator only when property.const is set', () => {
    const switcher = makeDiscriminator('kind', {
      a: opt({
        properties: {
          kind: { type: 'string', const: 'a' },
        },
      }),
    });

    const property = makeSwitcherProperty(switcher, {});

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    expect(screen.getAllByText('Value:')).toHaveLength(1);
  });

  it('prefers schema enum on discriminator property when present', () => {
    const switcher = makeDiscriminator('status', {
      a: opt({}),
      b: opt({}),
    });

    const property = makeSwitcherProperty(switcher, {
      status: { type: 'string', enum: ['x', 'y'] },
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow.textContent).toContain('x');
    expect(enumRow.textContent).toContain('y');
    expect(enumRow.textContent).not.toContain('a');
  });
});

function makeOneOf(variantCount: number): SwitcherType {
  const options: Record<string, SwitcherOptionType> = {};
  for (let i = 0; i < variantCount; i++) {
    options[`v${i}`] = opt({
      properties: { x: { type: 'string' } },
    });
  }
  return { type: 'oneOf', label: switcherLabel.ONE_OF, options };
}

describe('SwitcherRenderer variant state per section', () => {
  const property = makeSwitcherProperty({
    type: 'oneOf',
    label: switcherLabel.ONE_OF,
    options: {
      v0: opt({ properties: { cardNumber: { type: 'string' } } }),
      v1: opt({ properties: { iban: { type: 'string' } } }),
    },
  });
  function renderSections(sections: Record<string, DeepLinkSectionValue>) {
    return renderWithStore(
      <>
        {Object.entries(sections).map(([name, section]) => (
          <div key={name} data-testid={name}>
            <DeepLinkSectionContext.Provider value={section}>
              <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />
            </DeepLinkSectionContext.Provider>
          </div>
        ))}
      </>,
    );
  }

  it('keeps a pick out of sections that render another schema', () => {
    renderSections({
      request: { t: 'request', schemaId: 'components/schemas/Payment' },
      response: { t: 'response', c: '200', schemaId: 'components/schemas/Receipt' },
      callback: { t: 'request', cb: 'onEvent', schemaId: 'components/schemas/Event' },
    });

    fireEvent.click(within(screen.getByTestId('request')).getByText('v1'));

    expect(within(screen.getByTestId('request')).queryByText('iban')).not.toBeNull();
    expect(within(screen.getByTestId('response')).queryByText('cardNumber')).not.toBeNull();
    expect(within(screen.getByTestId('callback')).queryByText('cardNumber')).not.toBeNull();
  });

  it('shares a pick between sections that render the same schema', () => {
    renderSections({
      request: { t: 'request', schemaId: 'components/schemas/Payment' },
      response: { t: 'response', c: '200', schemaId: 'components/schemas/Payment' },
    });

    fireEvent.click(within(screen.getByTestId('response')).getByText('v1'));

    expect(within(screen.getByTestId('request')).queryByText('iban')).not.toBeNull();
    expect(within(screen.getByTestId('response')).queryByText('iban')).not.toBeNull();
  });
});

describe('SwitcherRenderer state key shape', () => {
  it('root oneOf writes the switcher label as the activeOneOf key (exact string)', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(switcherLabel.ONE_OF).toBe('One of:');
    expect(state['One of:']).toBe(1);
  });

  it('root anyOf writes the switcher label as the activeOneOf key (exact string)', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ANY_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(switcherLabel.ANY_OF).toBe('Any of:');
    expect(state['Any of:']).toBe(1);
  });

  it('nested oneOf inside an object property writes `<parents>/<switcher label>`', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={1} fieldParentsName={['entityMetadata']} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(state['entityMetadata/One of:']).toBe(1);
  });

  it('root discriminator writes the propertyName as the activeDiscriminator key', () => {
    const switcher = makeDiscriminator('itemType', {
      a: opt({ properties: { itemType: { type: 'string' } } }),
      b: opt({ properties: { itemType: { type: 'string' } } }),
    });
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('b'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['itemType']).toBe(1);
  });

  it('nested array-item discriminator writes `<arrayPath[]>/<propertyName>`', () => {
    const switcher = makeDiscriminator('filterType', {
      a: opt({
        properties: { filterType: { type: 'string' } },
      }),
      b: opt({
        properties: { filterType: { type: 'string' } },
      }),
    });
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={1} fieldParentsName={['tripFilters[]']} />,
    );

    fireEvent.click(screen.getByText('b'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['tripFilters[]/filterType']).toBe(1);
  });
});

describe('SwitcherRenderer discriminator options that are discriminator hosts', () => {
  const field = (type: string): PropertyType => ({ type });
  const tabRows = () =>
    screen.getAllByRole('tablist').map((list) =>
      within(list)
        .getAllByRole('tab')
        .map((tab) => tab.textContent),
    );
  const unmatchedHost = () =>
    makeDiscriminator('type', {
      dog: {
        switcher: makeDiscriminator('type', {
          lab: { properties: { type: field('string'), retrieves: field('boolean') } },
          poodle: { properties: { type: field('string'), curls: field('integer') } },
        }),
      },
      cat: { properties: { type: field('string'), indoor: field('boolean') } },
    });

  it('renders the nested variant with a tab row per level', () => {
    const style = makeDiscriminator('style', {
      espresso: {
        properties: { kind: field('string'), style: field('string'), shots: field('integer') },
      },
      latte: {
        properties: { kind: field('string'), style: field('string'), milk: field('string') },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { switcher: style },
      juice: { properties: { kind: field('string'), fruit: field('string') } },
    });

    const { store } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.getByText('shots')).toBeTruthy();
    fireEvent.click(screen.getByText('latte'));
    expect(screen.getByText('milk')).toBeTruthy();
    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator['&d=0/style']).toBe(1);
    fireEvent.click(screen.getByText('juice'));
    expect(screen.getByText('fruit')).toBeTruthy();
  });

  it('shows one row when both levels use the same property, the inner option following the outer value', () => {
    const inner = makeDiscriminator('type', {
      lab: { properties: { type: field('string'), retrieves: field('boolean') } },
      poodle: { properties: { type: field('string'), curls: field('integer') } },
    });
    const switcher = makeDiscriminator('type', {
      lab: { switcher: inner },
      poodle: { switcher: inner },
      cat: { properties: { type: field('string'), indoor: field('boolean') } },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.getAllByText('type')).toHaveLength(1);
    expect(screen.getByText('retrieves')).toBeTruthy();
    fireEvent.click(screen.getByText('poodle'));
    expect(screen.getByText('curls')).toBeTruthy();
    expect(screen.queryByText('retrieves')).toBeNull();
  });

  it('follows the inner default mapping when the outer value names no inner option', () => {
    const inner: SwitcherType = {
      ...makeDiscriminator('type', {
        lab: { properties: { type: field('string'), retrieves: field('boolean') } },
      }),
    };
    inner.options['Default mapping'] = opt({
      isDefaultMapping: true,
      properties: { type: field('string'), mixed: field('boolean') },
    });
    const switcher = makeDiscriminator('type', {
      dog: { switcher: inner },
      cat: { properties: { type: field('string'), indoor: field('boolean') } },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.getAllByText('type')).toHaveLength(1);
    expect(screen.getByText('mixed')).toBeTruthy();
  });

  it('shows one row for three levels on the same property', () => {
    const canine = makeDiscriminator('type', {
      dog: { properties: { type: field('string'), barks: field('boolean') } },
    });
    const mammal = makeDiscriminator('type', {
      dog: { switcher: canine },
      whale: { properties: { type: field('string'), fins: field('integer') } },
    });
    const switcher = makeDiscriminator('type', {
      dog: { switcher: mammal },
      bird: { properties: { type: field('string'), wings: field('integer') } },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.getAllByText('type')).toHaveLength(1);
    expect(screen.getByText('barks')).toBeTruthy();
  });

  it('keeps the inner tab row with all its options when the outer value names no inner option and there is no default mapping', () => {
    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(unmatchedHost())}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(tabRows()).toEqual([
      ['dog', 'cat'],
      ['lab', 'poodle'],
    ]);
    fireEvent.click(screen.getByText('poodle'));
    expect(renderedFieldNames(container)).toEqual(['type', 'type', 'curls']);
  });

  it('gives the second tab row of the same property its own key', () => {
    const consoleError = vi.spyOn(console, 'error');

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(unmatchedHost())}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('keeps the inner tab row and its free selection when the outer value is the default mapping', () => {
    const inner = makeDiscriminator('type', {
      lab: { properties: { type: field('string'), retrieves: field('boolean') } },
    });
    inner.options['Default mapping'] = opt({
      isDefaultMapping: true,
      properties: { type: field('string'), mixed: field('boolean') },
    });
    const switcher = makeDiscriminator('type', {
      cat: { properties: { type: field('string'), indoor: field('boolean') } },
    });
    switcher.options['Default mapping'] = opt({ isDefaultMapping: true, switcher: inner });

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    fireEvent.click(within(screen.getByRole('tablist')).getAllByRole('tab')[1]);

    expect(tabRows()).toEqual([
      ['cat', 'Default mapping'],
      ['lab', 'Default mapping'],
    ]);
    expect(renderedFieldNames(container)).toEqual(['type', 'type', 'retrieves']);
  });

  it('follows the nearest outer row on the same property when two outer rows use it', () => {
    const breed = makeDiscriminator('type', {
      dog: { properties: { type: field('string'), barks: field('boolean') } },
      lab: { properties: { type: field('string'), retrieves: field('boolean') } },
    });
    const canine = makeDiscriminator('type', {
      lab: { switcher: breed },
      poodle: { properties: { type: field('string'), curls: field('integer') } },
    });
    const switcher = makeDiscriminator('type', {
      dog: { switcher: canine },
      cat: { properties: { type: field('string'), indoor: field('boolean') } },
    });

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(tabRows()).toEqual([
      ['dog', 'cat'],
      ['lab', 'poodle'],
    ]);
    expect(renderedFieldNames(container)).toEqual(['type', 'type', 'retrieves']);
  });

  it('lists the outer row, then the inner row, ahead of the fields of the inner option', () => {
    const style = makeDiscriminator('style', {
      espresso: {
        properties: { shots: field('integer'), style: field('string'), kind: field('string') },
      },
      latte: {
        properties: { milk: field('string'), style: field('string'), kind: field('string') },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { switcher: style },
      juice: { properties: { kind: field('string'), fruit: field('string') } },
    });

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(renderedFieldNames(container)).toEqual(['kind', 'style', 'shots']);
  });

  it('renders an outer tab row that no level declares as a string field', () => {
    const style = makeDiscriminator('style', {
      espresso: { properties: { style: field('string'), shots: field('integer') } },
      latte: { properties: { style: field('string'), milk: field('string') } },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { switcher: style },
      juice: { properties: { kind: field('string'), fruit: field('string') } },
    });

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(
      [...container.querySelectorAll('.schema-name')].map((name) => [
        name.textContent,
        name.parentElement?.nextElementSibling?.textContent,
      ]),
    ).toEqual([
      ['kind', 'string'],
      ['style', 'string'],
      ['shots', 'integer'],
    ]);
  });

  it('lists enum values only from the property enum, not from the mapping keys', () => {
    const switcher = makeDiscriminator('type', {
      lab: { properties: { type: { type: 'string', const: 'lab' } } },
      cat: { properties: { type: { type: 'string', const: 'cat' } } },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.queryByText('Enum:')).toBeNull();
    expect(screen.getByText('Value:')).toBeTruthy();
  });

  it('adds the tab row of a property no option lists, so every option stays reachable', () => {
    const switcher = makeDiscriminator('petType', {
      cat: { properties: { meow: field('boolean') } },
      dog: { properties: { bark: field('boolean') } },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    fireEvent.click(screen.getByText('dog'));

    expect(screen.getByText('petType')).toBeTruthy();
    expect(screen.getByText('bark')).toBeTruthy();
  });

  it('keeps the same tab row on a plain option and on a sibling that is a discriminator host', () => {
    const switcher = makeDiscriminator('kind', {
      car: { properties: { wheels: field('integer') } },
      boat: {
        switcher: makeDiscriminator('propulsion', {
          sail: { properties: { masts: field('integer') } },
          motor: { properties: { hp: field('integer') } },
        }),
      },
    });
    const rowNames = () =>
      screen.getAllByText(/^(kind|propulsion|wheels|masts)$/).map((node) => node.textContent);

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    expect(rowNames()).toEqual(['kind', 'wheels']);

    fireEvent.click(screen.getByText('boat'));
    expect(rowNames()).toEqual(['kind', 'propulsion', 'masts']);

    fireEvent.click(screen.getByText('car'));
    expect(rowNames()).toEqual(['kind', 'wheels']);
  });

  it('keeps the tab row mounted when the property moves to another position', () => {
    const switcher = makeDiscriminator('kind', {
      car: { properties: { kind: field('string'), wheels: field('integer') } },
      bike: {
        properties: { gears: field('integer'), color: field('string'), kind: field('string') },
      },
    });

    renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    const bikeTab = screen.getByText('bike');
    fireEvent.click(bikeTab);

    expect(screen.getByText('bike')).toBe(bikeTab);
  });
});

describe('SwitcherRenderer oneOf variant selection UI', () => {
  it('uses Segmented tablist for at most five variants and snapshots selector subtree', () => {
    const property = makeSwitcherProperty(makeOneOf(5));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(screen.getByText('v0')).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(tablist)).toMatchInlineSnapshot(
      `"<div><button>v0</button><button>v1</button><button>v2</button><button>v3</button><button>v4</button></div>"`,
    );
  });

  it('uses dropdown for more than five variants and snapshots selector trigger', () => {
    const property = makeSwitcherProperty(makeOneOf(6));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'v0' });
    expect(trigger).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(trigger)).toMatchInlineSnapshot(
      `"<button><span>v0</span><svg><path></path></svg></button>"`,
    );
  });

  it('shows search field when opening dropdown with seven or more variants', () => {
    const property = makeSwitcherProperty(makeOneOf(7));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    fireEvent.click(screen.getByRole('button', { name: 'v0' }));

    expect(screen.getByPlaceholderText('Search items')).toBeInTheDocument();
  });
});

describe('appendVariantSuffix', () => {
  it('appends suffix to the last element of fieldParentsName', () => {
    expect(appendVariantSuffix(['body'], '&oneof=1')).toEqual(['body&oneof=1']);
  });

  it('only modifies the last element when multiple parents exist', () => {
    expect(appendVariantSuffix(['root', 'child'], '&d=2')).toEqual(['root', 'child&d=2']);
  });

  it('emits the suffix as the sole entry when fieldParentsName is empty', () => {
    expect(appendVariantSuffix([], '&oneof=0')).toEqual(['&oneof=0']);
  });

  it('emits the suffix as the sole entry when fieldParentsName is undefined', () => {
    expect(appendVariantSuffix(undefined, '&oneof=0')).toEqual(['&oneof=0']);
  });

  it('does not mutate the original array', () => {
    const original = ['body'];
    appendVariantSuffix(original, '&oneof=1');
    expect(original).toEqual(['body']);
  });

  it('stacks multiple suffixes when called repeatedly', () => {
    const first = appendVariantSuffix(['body'], '&oneof=1');
    const second = appendVariantSuffix(first, '&d=0');
    expect(second).toEqual(['body&oneof=1&d=0']);
  });
});

describe('useVariantIndexFromHash', () => {
  afterEach(() => {
    window.location.hash = '';
  });
  // `useVariantIndexFromHash` reads `window.location.hash` directly via
  // `useSyncExternalStore` (no `useLocation` subscription), so tests must
  // set jsdom's hash.
  function wrapper(hash: string) {
    window.location.hash = hash;
    return ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ hash }]}>
        <JotaiProvider>{children}</JotaiProvider>
      </MemoryRouter>
    );
  }

  function indexAt(hash: string, segment: string, count: number, fieldParentsName: string[]) {
    const { result } = renderHook(() => useVariantIndexFromHash(segment, count, fieldParentsName), {
      wrapper: wrapper(hash),
    });
    return result.current;
  }

  const nestedHash = '#plans/postplan/t=request&path=&oneof=1/trial&oneof=0/period';

  it('returns the index of the root switcher', () => {
    expect(indexAt(nestedHash, 'oneof', 3, [])).toBe(1);
  });

  it('returns the index of a switcher nested in a variant', () => {
    expect(indexAt(nestedHash, 'oneof', 3, ['&oneof=1', 'trial'])).toBe(0);
  });

  it('returns -1 for a switcher the hash does not address', () => {
    expect(indexAt(nestedHash, 'oneof', 3, ['&oneof=1', 'trial&oneof=0', 'period'])).toBe(-1);
  });

  it('returns -1 when hash is empty', () => {
    expect(indexAt('', 'oneof', 3, [])).toBe(-1);
  });

  it('returns the discriminator index for the field path', () => {
    expect(indexAt('#pet/getpetbyid/t=request&path=body&d=2/status', 'd', 4, ['body'])).toBe(2);
  });

  it('returns -1 for out-of-range discriminator index', () => {
    expect(indexAt('#pet/getpetbyid/t=request&path=body&d=5/status', 'd', 3, ['body'])).toBe(-1);
  });

  it('reads oneof and d markers of the same field path independently', () => {
    const hash = '#op/test/t=request&path=body&oneof=2&d=1/child';
    expect(indexAt(hash, 'oneof', 4, ['body'])).toBe(2);
    expect(indexAt(hash, 'd', 4, ['body&oneof=2'])).toBe(1);
  });

  it('does not apply a sibling field path marker', () => {
    const hash = '#x/t=request&path=payment&oneof=1/iban';
    expect(indexAt(hash, 'oneof', 2, ['payment'])).toBe(1);
    expect(indexAt(hash, 'oneof', 2, ['channel'])).toBe(-1);
  });

  it('matches a field path regardless of case (links are lowercased)', () => {
    expect(indexAt('#x/t=request&path=tripfilters[]&d=1/to', 'd', 2, ['tripFilters[]'])).toBe(1);
  });

  it('matches a legacy link that has no [] array-item markers', () => {
    expect(indexAt('#x/t=response&c=200&path=items&d=1/name', 'd', 2, ['items[]'])).toBe(1);
  });

  it.each([
    ['#x/t=request&path=&oneof=10/p10', 'oneof', [], 10],
    ['#x/t=request&path=&oneof=10', 'oneof', [], 10],
    ['#x/t=request&path=&oneof=10&d=0/a', 'oneof', [], 10],
    ['#x/t=request&path=&oneof=3/inner&oneof=10/q10', 'oneof', ['&oneof=3', 'inner'], 10],
    ['#x/t=request&path=&d=10/r10', 'd', [], 10],
  ])('reads the whole multi-digit index in %s', (hash, segment, fieldParentsName, expected) => {
    expect(indexAt(hash, segment, 11, fieldParentsName)).toBe(expected);
  });

  it('returns -1 for a multi-digit index that exceeds count', () => {
    expect(indexAt('#x/t=request&path=&oneof=12/p', 'oneof', 3, [])).toBe(-1);
  });

  function indexIn(itemId: string, hash: string, fieldParentsName: string[]) {
    window.location.hash = hash;
    const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, fieldParentsName), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[{ hash }]}>
          <JotaiProvider>
            <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
          </JotaiProvider>
        </MemoryRouter>
      ),
    });
    return result.current;
  }

  it("ignores a hash that addresses another item's switcher at the same field path", () => {
    const hash = '#test-item/t=request&path=pay&oneof=1/pa1';
    expect(indexIn(TEST_ITEM_ID, hash, ['pay'])).toBe(1);
    expect(indexIn('other-item', hash, ['pay'])).toBe(-1);
  });

  it('reads a link only in the section it addresses', () => {
    const hash = '#test-item/t=response&c=200&path=pay&oneof=2/iban';
    const indexInSection = (section: DeepLinkSectionValue) => {
      window.location.hash = hash;
      const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, ['pay']), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <MemoryRouter initialEntries={[{ hash }]}>
            <JotaiProvider>
              <ItemIdContext.Provider value={TEST_ITEM_ID}>
                <DeepLinkSectionContext.Provider value={section}>
                  {children}
                </DeepLinkSectionContext.Provider>
              </ItemIdContext.Provider>
            </JotaiProvider>
          </MemoryRouter>
        ),
      });
      return result.current;
    };

    expect(indexInSection({ t: 'response', c: '200' })).toBe(2);
    expect(indexInSection({ t: 'request' })).toBe(-1);
    expect(indexInSection({ t: 'response', c: '404' })).toBe(-1);
    expect(indexInSection({ t: 'request', cb: 'onEvent' })).toBe(-1);
  });

  it('reads a link to the overview, whose item has an empty slug', () => {
    expect(indexIn('/', '#path=method&oneof=2/currency', ['method'])).toBe(2);
    expect(
      indexIn('/', '#pets/createorder/t=request&path=method&oneof=2/currency', ['method']),
    ).toBe(-1);
  });
});

describe('deep-link reload restoration', () => {
  const REQUEST_STORE_ID = buildVariantStoreId(TEST_ITEM_ID, { t: 'request' });

  afterEach(() => {
    window.location.hash = '';
  });

  // Variant restoration reads `window.location.hash` directly (via
  // `useUrlHash`), so set jsdom's hash rather than the MemoryRouter entry.
  function renderAtHash(ui: React.ReactElement, hash?: string) {
    window.location.hash = hash ?? '';
    const store = createStore();
    const result = render(
      <MemoryRouter initialEntries={hash ? [{ hash }] : ['/']}>
        <JotaiProvider store={store}>
          <MarkdownAdapterProvider value={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={TEST_ITEM_ID}>
              <DeepLinkSectionContext.Provider value={{ t: 'request' }}>
                {ui}
              </DeepLinkSectionContext.Provider>
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );
    return { ...result, store };
  }

  function fieldIds(container: HTMLElement): string[] {
    return [...container.querySelectorAll(`[id^="${TEST_ITEM_ID}/"]`)].map((el) => el.id);
  }

  it('restores a nested oneOf tab from the hash on reload', () => {
    const innerOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        iv0: opt({
          properties: { targetProp: { type: 'string' } },
        }),
        iv1: opt({
          properties: { otherProp: { type: 'string' } },
        }),
      },
    };
    const outerOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { alpha: { type: 'string' } } }),
        v1: opt({ switcher: innerOneOf }),
      },
    };
    const property = makeSwitcherProperty(outerOneOf);

    renderAtHash(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
      '#test-item/t=request&path=&oneof=1&oneof=0/targetprop',
    );

    expect(screen.getByText('targetProp')).toBeInTheDocument();
    expect(screen.queryByText('otherProp')).not.toBeInTheDocument();
  });

  it('restores a nested discriminator branch from the hash on reload', () => {
    const innerDisc = makeDiscriminator('innerKind', {
      ia: { properties: { iaField: { type: 'string' } } },
      ib: { properties: { ibField: { type: 'string' } } },
    });
    const outerDisc = makeDiscriminator('outerKind', {
      oa: {
        properties: {
          sub: { type: 'object', switcher: innerDisc },
        },
      },
      ob: { properties: { obField: { type: 'string' } } },
    });
    const property = makeSwitcherProperty(outerDisc);

    renderAtHash(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
      '#test-item/t=request&path=&d=0/sub&d=1/ibfield',
    );

    expect(screen.getByText('ibField')).toBeInTheDocument();
    expect(screen.queryByText('iaField')).not.toBeInTheDocument();
  });

  it('emits &oneof=<idx> in child deep-link ids for a root oneOf', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(screen.getByText('y')).toBeInTheDocument();
    expect(container.querySelector('[id*="oneof=1"]')).toBeTruthy();
  });

  it('emits &oneof=<idx> in child deep-link ids for a root oneOf rendered at body level 1', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={1}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(screen.getByText('y')).toBeInTheDocument();
    expect(container.querySelector('[id*="oneof=1"]')).toBeTruthy();
  });

  it('emits &d=<idx> in child deep-link ids for a root discriminator', () => {
    const switcher = makeDiscriminator('kind', {
      a: { properties: { aField: { type: 'string' } } },
      b: { properties: { bField: { type: 'string' } } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&d=1/bfield',
    );

    expect(screen.getByText('bField')).toBeInTheDocument();
    expect(container.querySelector('[id*="&d=1"]')).toBeTruthy();
  });

  it('keeps the outer level first and its paths and definitions in a nested host option', () => {
    const style = makeDiscriminator('style', {
      espresso: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          shots: { type: 'integer' },
        },
      },
      latte: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { properties: { temperature: { type: 'string' } }, switcher: style },
      juice: { properties: { kind: { type: 'string' }, fruit: { type: 'string' } } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher, {
          kind: { type: 'string', description: 'Drink kind' },
        })}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(screen.getByText('Drink kind')).toBeInTheDocument();
    expect(
      screen.getByText('kind').compareDocumentPosition(screen.getByText('temperature')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelector('[id$="path=&d=0/temperature"]')).toBeTruthy();
  });

  it('keeps the outer level path on the outer tab row in a nested host option', () => {
    const style = makeDiscriminator('style', {
      espresso: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          shots: { type: 'integer' },
        },
      },
      latte: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { switcher: style },
      juice: { properties: { kind: { type: 'string' }, fruit: { type: 'string' } } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(fieldIds(container)).toEqual([
      'test-item/t=request&path=kind',
      'test-item/t=request&path=&d=0/style',
      'test-item/t=request&path=&d=0&d=0/shots',
    ]);
  });

  it('gives a field the inner option redeclares the inner level path', () => {
    const style = makeDiscriminator('style', {
      espresso: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          temperature: { type: 'string' },
          shots: { type: 'integer' },
        },
      },
      latte: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { properties: { temperature: { type: 'string' } }, switcher: style },
      juice: { properties: { kind: { type: 'string' }, fruit: { type: 'string' } } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(fieldIds(container)).toEqual([
      'test-item/t=request&path=kind',
      'test-item/t=request&path=&d=0/style',
      'test-item/t=request&path=&d=0&d=0/temperature',
      'test-item/t=request&path=&d=0&d=0/shots',
    ]);
  });

  it('takes the definition and path of a field from the outermost level that declares it, across three levels', () => {
    const roast = makeDiscriminator('roast', {
      light: { properties: { roast: { type: 'string' }, notes: { type: 'string' } } },
      dark: { properties: { roast: { type: 'string' }, bitterness: { type: 'integer' } } },
    });
    const style = makeDiscriminator('style', {
      espresso: {
        properties: {
          kind: { type: 'string', description: 'Espresso kind' },
          style: { type: 'string' },
          temperature: { type: 'string' },
        },
        switcher: roast,
      },
      latte: {
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
    });
    const switcher = makeDiscriminator('kind', {
      brew: { properties: { temperature: { type: 'string' } }, switcher: style },
      juice: { properties: { kind: { type: 'string' }, fruit: { type: 'string' } } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher, {
          kind: { type: 'string', description: 'Drink kind' },
        })}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(fieldIds(container)).toEqual([
      'test-item/t=request&path=kind',
      'test-item/t=request&path=&d=0/style',
      'test-item/t=request&path=&d=0&d=0/roast',
      'test-item/t=request&path=&d=0/temperature',
      'test-item/t=request&path=&d=0&d=0&d=0/notes',
    ]);
    expect(screen.getByText('Drink kind')).toBeInTheDocument();
    expect(screen.queryByText('Espresso kind')).not.toBeInTheDocument();
  });

  it('keeps the inner option implied by the outer value when the hash marks another one', () => {
    const inner = makeDiscriminator('type', {
      lab: { properties: { type: { type: 'string' }, retrieves: { type: 'boolean' } } },
      poodle: { properties: { type: { type: 'string' }, curls: { type: 'integer' } } },
    });
    const switcher = makeDiscriminator('type', {
      lab: { switcher: inner },
      poodle: { switcher: inner },
      cat: { properties: { type: { type: 'string' }, indoor: { type: 'boolean' } } },
    });
    const { container, store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&d=0&d=1/curls',
    );

    expect(store.get(itemStoreAtom(REQUEST_STORE_ID)).activeDiscriminator).toEqual({
      type: 0,
      '&d=0/type': 1,
    });
    expect(renderedFieldNames(container)).toEqual(['type', 'retrieves']);
  });

  it('does not render a phantom "." parent prefix for a root variant marker', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };
    renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    expect(screen.queryByText('.', { exact: true })).not.toBeInTheDocument();
    expect(screen.queryByText(/oneof=/)).not.toBeInTheDocument();
  });

  it('seeds activeDiscriminator in the itemStore from a hash discriminator marker', () => {
    const switcher = makeDiscriminator('method', {
      a: { properties: { aField: { type: 'string' } } },
      b: { properties: { bField: { type: 'string' } } },
    });

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&d=1/bfield',
    );

    expect(store.get(itemStoreAtom(REQUEST_STORE_ID)).activeDiscriminator['method']).toBe(1);
  });

  it('seeds activeOneOf in the itemStore from a hash oneof marker', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
        v1: opt({ properties: { y: { type: 'string' } } }),
      },
    };

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(store.get(itemStoreAtom(REQUEST_STORE_ID)).activeOneOf['One of:']).toBe(1);
  });

  it('seeds only the switcher whose field path the hash addresses', () => {
    const switcher = (a: string, b: string): SwitcherType => ({
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        [a]: opt({ properties: { [a]: { type: 'string' } } }),
        [b]: opt({ properties: { [b]: { type: 'string' } } }),
      },
    });

    const { store } = renderAtHash(
      <>
        <SwitcherRenderer
          property={makeSwitcherProperty(switcher('cardNumber', 'iban'))}
          level={2}
          fieldParentsName={['payment']}
        />
        <SwitcherRenderer
          property={makeSwitcherProperty(switcher('url', 'room'))}
          level={2}
          fieldParentsName={['channel']}
        />
      </>,
      '#test-item/t=request&path=payment&oneof=1/iban',
    );

    expect(store.get(itemStoreAtom(REQUEST_STORE_ID)).activeOneOf).toEqual({
      'payment/One of:': 1,
    });
  });

  it('does not seed the itemStore when the hash has no variant marker', () => {
    const switcher = makeDiscriminator('method', {
      a: { properties: { aField: { type: 'string' } } },
      b: { properties: { bField: { type: 'string' } } },
    });

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(
      store.get(itemStoreAtom(REQUEST_STORE_ID)).activeDiscriminator['method'],
    ).toBeUndefined();
  });
});

describe('SwitcherRenderer description and variant behavior', () => {
  it('should fall back to parent description when the active oneOf variant has none', () => {
    const oneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } } }),
      },
    };
    const property: PropertyType = {
      type: 'object',
      switcher: oneOf,
      description: 'parent fallback text',
    };

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.getByText('parent fallback text')).toBeInTheDocument();
  });

  it("keeps the host's own properties next to the active variant's", () => {
    const discriminator = makeDiscriminator('kind', {
      a: { properties: { aField: { type: 'string' } } },
    });
    const property = makeSwitcherProperty(discriminator, {
      kind: { type: 'string' },
      hostSibling: { type: 'string' },
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.getByText('hostSibling')).toBeInTheDocument();
    expect(screen.getByText('aField')).toBeInTheDocument();
  });

  it('shares only the discriminator property when the host is one of the variants', () => {
    const discriminator: SwitcherType = {
      ...makeDiscriminator('petType', {
        cat: { properties: { petType: { type: 'string' }, huntingSkill: { type: 'string' } } },
        dog: { properties: { petType: { type: 'string' }, packSize: { type: 'integer' } } },
      }),
      sharesOnlyDiscriminator: true,
    };
    const property = makeSwitcherProperty(discriminator, {
      petType: { type: 'string' },
      huntingSkill: { type: 'string' },
    });
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    fireEvent.click(screen.getByText('dog'));

    expect(screen.getByText('packSize')).toBeInTheDocument();
    expect(screen.queryByText('huntingSkill')).not.toBeInTheDocument();
  });

  it('renders the host required property for every discriminator variant, in the host order', () => {
    const discriminator = makeDiscriminator('method', {
      card: {
        properties: {
          method: { type: 'string', const: 'card' },
          last4: { type: 'string' },
        },
      },
      bank: {
        properties: {
          method: { type: 'string', const: 'bank' },
          iban: { type: 'string' },
        },
      },
    });
    const property = makeSwitcherProperty(discriminator, {
      method: { type: 'string', description: 'Payment method' },
      amount: { type: 'number', isRequired: true },
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const renderedNames = screen.getAllByText(/^(method|amount|last4|iban)$/);
    expect(renderedNames.map((node) => node.textContent)).toEqual(['method', 'amount', 'last4']);
    expect(screen.getByText('required')).toBeInTheDocument();
  });

  it('should render the variant title in parentheses for a primitive oneOf option', () => {
    const oneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        scalarVariant: {
          isDeprecated: false,
          isDefaultMapping: false,
          title: 'ScalarTitle',
        },
      },
    };
    const property: PropertyType = {
      type: 'string',
      switcher: oneOf,
    };

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.getByText('(ScalarTitle)')).toBeInTheDocument();
  });

  it('keeps the host order on every tab when only some options redeclare every host property', () => {
    const discriminator = makeDiscriminator('method', {
      card: {
        properties: { method: { type: 'string', const: 'card' }, last4: { type: 'string' } },
      },
      bank: {
        properties: {
          amount: { type: 'number' },
          method: { type: 'string', const: 'bank' },
          iban: { type: 'string' },
        },
      },
    });
    const property = makeSwitcherProperty(discriminator, {
      method: { type: 'string' },
      amount: { type: 'number' },
    });
    const renderedNames = () =>
      screen.getAllByText(/^(method|amount|last4|iban)$/).map((node) => node.textContent);

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(renderedNames()).toEqual(['method', 'amount', 'last4']);

    fireEvent.click(screen.getByText('bank'));
    expect(renderedNames()).toEqual(['method', 'amount', 'iban']);
  });

  it('preserves the variant property order when the variant already exposes the discriminator field', () => {
    const discriminator = makeDiscriminator('itemType', {
      coffee: {
        properties: {
          name: { type: 'string' },
          status: { type: 'string' },
          itemType: { type: 'string' },
          brewingMethod: { type: 'string' },
        },
      },
    });
    const property = makeSwitcherProperty(discriminator, {
      itemType: { type: 'string' },
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const renderedNames = screen.getAllByText(/^(name|status|itemType|brewingMethod)$/);
    expect(renderedNames.map((node) => node.textContent)).toEqual([
      'name',
      'status',
      'itemType',
      'brewingMethod',
    ]);
  });
});

describe('OneOfSwitcher variant nesting chrome', () => {
  function makeObjectOneOf(): SwitcherType {
    return {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        object: opt({ properties: { id: { type: 'string' } } }),
        null: opt({ typeLabel: 'null' }),
      },
    };
  }

  it('wraps a switcher-only variant (nullable discriminated oneOf) in collapsible nesting chrome', () => {
    // Mirrors `options: oneOf [AiWriterAgentJobOptions, null]` where the
    // selected variant is itself a discriminated oneOf: the option carries only
    // `switcher` (no `properties`/`items`). Its fields must render nested under
    // the owning property row, not flat at the same level.
    const innerDiscriminator = makeDiscriminator('trigger', {
      MANUAL: {
        properties: {
          trigger: { type: 'string' },
          note: { type: 'string' },
        },
      },
      SCHEDULED: {
        properties: {
          trigger: { type: 'string' },
        },
      },
    });
    const nullableOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        AiWriterAgentJobOptions: opt({ properties: undefined, switcher: innerDiscriminator }),
        null: opt({ properties: undefined, typeLabel: 'null' }),
      },
    };

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(nullableOneOf)}
        level={2}
        fieldParentsName={['options']}
      />,
    );

    const nestedWrapper = container.querySelector('[data-schema-nested-open]');
    expect(nestedWrapper).toBeTruthy();
    // Collapsed by default: variant fields hidden behind the toggle.
    expect(screen.queryByText('note')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/^show/i));
    expect(screen.getByText('note')).toBeInTheDocument();
  });

  it('colors the variant nesting chrome with the owning row level, matching plain objects', () => {
    // A property row at level 1 renders its oneOf switcher at level 2. The
    // nesting chrome (anchor line / circle) must use the row's level (1) so a
    // oneOf property expands with the same color as a plain object property.
    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(makeObjectOneOf())}
        level={2}
        fieldParentsName={['actor']}
      />,
    );

    fireEvent.click(screen.getByText(/^show/i));

    const nested = container.querySelector('[data-schema-nested-open="true"] > div');
    expect(nested).toBeTruthy();
    expect(nested).toHaveStyleRule('border-left', `1px solid ${LEVEL_COLORS[1]}`);
  });
});

describe('SwitcherRenderer schema title link', () => {
  const SCHEMA_SLUG = '/docs/openapi/schemas/timepluralunit';

  function renderPrimitiveVariant(option: SwitcherOptionType) {
    const store = createStore();
    const items: ApiItem[] = [
      {
        type: 'link',
        link: SCHEMA_SLUG,
        label: 'TimePluralUnit',
        httpVerb: 'schema',
        routeSlug: SCHEMA_SLUG,
        content: {
          contentType: contentType.ITEM,
          children: [],
          meta: { name: 'TimePluralUnit' },
        },
      },
    ];
    store.set(globalStoreAtom, {
      items,
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
      options: normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        basePath: '',
        schemaDefinitionsTagName: 'Schemas',
      }),
    });

    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: { TimePluralUnit: option, other: opt({ typeLabel: 'null', properties: undefined }) },
    };

    return render(
      <MemoryRouter>
        <JotaiProvider store={store}>
          <MarkdownAdapterProvider value={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={TEST_ITEM_ID}>
              <SwitcherRenderer
                property={makeSwitcherProperty(switcher)}
                level={1}
                fieldParentsName={['unit']}
              />
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );
  }

  it('links the variant title to its schema definition page', () => {
    const { container } = renderPrimitiveVariant(
      opt({
        typeLabel: 'string',
        title: 'TimePluralUnit',
        schemaName: 'TimePluralUnit',
        properties: undefined,
      }),
    );

    const link = container.querySelector(`a[href="${SCHEMA_SLUG}"]`);
    expect(link).toBeTruthy();
    expect(link).toHaveTextContent('(TimePluralUnit)');
  });

  it('falls back to the option key as the link text when the variant has no title', () => {
    const { container } = renderPrimitiveVariant(
      opt({ typeLabel: 'string', schemaName: 'TimePluralUnit', properties: undefined }),
    );

    const link = container.querySelector(`a[href="${SCHEMA_SLUG}"]`);
    expect(link).toBeTruthy();
    expect(link).toHaveTextContent('(TimePluralUnit)');
  });

  it('keeps the title as plain text when the variant is not a named schema', () => {
    const { container } = renderPrimitiveVariant(
      opt({ typeLabel: 'string', title: 'Inline', properties: undefined }),
    );

    expect(screen.getByText('(Inline)')).toBeInTheDocument();
    expect(container.querySelector('a[href*="schemas"]')).toBeNull();
  });
});
