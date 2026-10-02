import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { ExpandableExample } from '../ExpandableExample.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderExpandable(value: string): void {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
    replayDefinition: null,
  });

  render(
    <Provider store={jotaiStore}>
      <ExpandableExample value={value} />
    </Provider>,
  );
}

describe('ExpandableExample (regression 2.10.1)', () => {
  it('truncates a long example and toggles between Show/Hide example', () => {
    const longValue = 'x'.repeat(200);
    renderExpandable(longValue);

    // Initially truncated to 150 chars, with a "Show example" toggle.
    expect(screen.getByText('x'.repeat(150))).toBeInTheDocument();
    expect(screen.queryByText(longValue)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show example' }));

    // Expanded: full value, toggle flips to "Hide example".
    expect(screen.getByText(longValue)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide example' })).toBeInTheDocument();
  });

  it('does not show a toggle for a short example', () => {
    renderExpandable('short value');
    expect(screen.getByText('short value')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
