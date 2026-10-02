import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { Pattern } from '../Pattern.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderPattern(pattern?: string, options: { hideSchemaPattern?: boolean } = {}) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      ...options,
    }),
    replayDefinition: null,
  });

  return render(
    <Provider store={jotaiStore}>
      <Pattern pattern={pattern} />
    </Provider>,
  );
}

const LONG_PATTERN = '^[a-z]{1,60}-this-is-a-very-long-regex-pattern-value-that-truncates$';
const MID_PATTERN = '^(usr|wh|cj|pb)_[0-9abcdefghjkmnpqrstvwxyz]{26}$';
const SHORT_PATTERN = '^[A-Z]{3}$';

describe('Pattern', () => {
  it('renders nothing when hideSchemaPattern is enabled', () => {
    renderPattern(SHORT_PATTERN, { hideSchemaPattern: true });
    expect(screen.queryByText(SHORT_PATTERN)).not.toBeInTheDocument();
  });

  it('renders a short pattern in full with no toggle', () => {
    renderPattern(SHORT_PATTERN);
    expect(screen.getByText(SHORT_PATTERN)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a pattern just over the limit in full with no toggle', () => {
    renderPattern(MID_PATTERN);
    expect(screen.getByText(MID_PATTERN)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('truncates a long pattern and toggles the full value on click', () => {
    renderPattern(LONG_PATTERN);

    expect(screen.queryByText(LONG_PATTERN)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show pattern' }));
    expect(screen.getByText(LONG_PATTERN)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide pattern' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide pattern' }));
    expect(screen.queryByText(LONG_PATTERN)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show pattern' })).toBeInTheDocument();
  });

  it('renders nothing when there is no pattern', () => {
    const { container } = renderPattern(undefined);
    expect(container).toBeEmptyDOMElement();
  });
});
