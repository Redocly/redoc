import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { OverviewSectionWrapperNode } from '../../types/content.js';

import { SECTION_ATTR } from '../../constants/openapi.js';
import { nodeTypes } from '../../types/common.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { ComponentMapper } from '../Mapper.js';

function renderSection(sectionId: string, basePath: string): HTMLElement {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      metadata: {},
      basePath,
      markdownParser: () => undefined,
    }),
    replayDefinition: null,
  });
  const node: OverviewSectionWrapperNode = {
    nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
    children: [],
    sectionId,
  };

  const { container } = render(
    <Provider store={jotaiStore}>
      <ComponentMapper type={node.nodeType} node={node} />
    </Provider>,
  );
  return container.firstElementChild as HTMLElement;
}

describe('OverviewSectionWrapperView', () => {
  it.each([
    {
      sectionId: '/section/errors',
      basePath: '/docs/apis/pets',
      expected: '/docs/apis/pets/section/errors',
    },
    { sectionId: '/', basePath: '/docs/apis/pets', expected: '/docs/apis/pets' },
    { sectionId: '/section/errors', basePath: '/', expected: '/section/errors' },
    { sectionId: '/section/errors', basePath: '', expected: '/section/errors' },
    { sectionId: '/', basePath: '', expected: '/' },
  ])(
    'renders section id $sectionId under base path $basePath as $expected',
    ({ sectionId, basePath, expected }) => {
      expect(renderSection(sectionId, basePath).getAttribute(SECTION_ATTR)).toBe(expected);
    },
  );
});
