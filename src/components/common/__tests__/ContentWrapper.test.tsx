import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { PanelNode } from '../../../types/content.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { ContentWrapper } from '../ContentWrapper.js';

vi.mock('../../panels/PanelMapper.js', () => ({
  PanelMapper: () => <div data-testid="mock-panel-mapper" />,
}));

function renderContentWrapper(panels?: PanelNode[], sectionId?: string) {
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
    }),
  } as GlobalStoreAtom);

  return render(
    <Provider store={jotaiStore}>
      <ContentWrapper panels={panels} sectionId={sectionId}>
        <div data-testid="child-content">child</div>
      </ContentWrapper>
    </Provider>,
  );
}

describe('ContentWrapper', () => {
  it('should render only the middle panel when no panels are provided', () => {
    renderContentWrapper(undefined);
    expect(screen.getByTestId('middle-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('right-panel')).not.toBeInTheDocument();
  });

  it('should render both middle and right panels when panels are provided', () => {
    const panels: PanelNode[] = [{ children: [{ kind: 'code-sample' } as never] }];
    renderContentWrapper(panels);
    expect(screen.getByTestId('middle-panel')).toBeInTheDocument();
    expect(screen.getByTestId('right-panel')).toBeInTheDocument();
  });
});
