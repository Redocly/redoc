import { describe, it, expect } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';
import '@testing-library/jest-dom/vitest';

import type { ApiItem, ApiStore } from '../../types/store.js';
import type { RawApiDocsOptions } from '../../types/options.js';

import { withStoreProvider } from '../withStoreProvider.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { layoutAtom } from '../../jotai/app.js';

const EMPTY_STORE: ApiStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
};

const NO_ITEMS: ApiItem[] = [];

const counterAtom = atom(0);

type InspectorProps = {
  items: ApiItem[];
  store: ApiStore;
  options: RawApiDocsOptions;
  layout?: LayoutVariant;
};

function Inspector(_props: InspectorProps) {
  const [count, setCount] = useAtom(counterAtom);
  const { schemaDefinitionsTagName } = useAtomValue(globalOptionsAtom);
  const layout = useAtomValue(layoutAtom);
  return (
    <button data-testid="inspector" onClick={() => setCount((value) => value + 1)}>
      {`${count}:${schemaDefinitionsTagName}:${layout}`}
    </button>
  );
}

const Wrapped = withStoreProvider(Inspector);

describe('withStoreProvider option changes', () => {
  it('keeps the state held in its store and applies the new options and layout', () => {
    const { rerender } = render(
      <Wrapped
        items={NO_ITEMS}
        store={EMPTY_STORE}
        options={{ specType: 'openapi', schemaDefinitionsTagName: 'first' }}
        layout={LayoutVariant.THREE_PANEL}
      />,
    );
    fireEvent.click(screen.getByTestId('inspector'));
    expect(screen.getByTestId('inspector')).toHaveTextContent(
      `1:first:${LayoutVariant.THREE_PANEL}`,
    );

    act(() => {
      rerender(
        <Wrapped
          items={NO_ITEMS}
          store={EMPTY_STORE}
          options={{ specType: 'openapi', schemaDefinitionsTagName: 'second' }}
          layout={LayoutVariant.STACKED}
        />,
      );
    });

    expect(screen.getByTestId('inspector')).toHaveTextContent(`1:second:${LayoutVariant.STACKED}`);
  });
});
