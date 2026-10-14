import { describe, it, expect, vi } from 'vitest';

import type {
  OpenAPIDefinition,
  OpenApiBuildContext as BuildContext,
} from '../../../../types/openapi.js';

import {
  extractContentUntilFirstHeading,
  collectMarkdownSections,
} from '../../../utils/markdoc.js';
import { buildOverviewContent } from '../../items/overview/content.js';
import { buildOverviewItems } from '../../items/overview/item.js';
import { openApiContext } from '../../buildContext.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { createStoreContext, toRecord } from '../../../helpers.js';

const mockedOverviewContent = {
  contentType: 'overview' as const,
  children: [],
  seo: { title: 'My API' },
};

vi.mock('../../items/overview/content.js', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  buildOverviewContent: vi.fn(() => mockedOverviewContent),
}));

vi.mock('../../../utils/markdoc.js', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  extractContentUntilFirstHeading: vi.fn(() => undefined),
  collectMarkdownSections: vi.fn(() => ({ sectionItems: [], sectionChildren: [] })),
}));

const mockDoc: OpenAPIDefinition = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0' },
  paths: {},
};

const baseContext: BuildContext = {
  storeCtx: createStoreContext(toRecord(mockDoc)),
  document: mockDoc,
  options: normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  basePath: '/api',
  downloadUrls: [],
  languages: [],
  tagsMap: new Map(),
  collectedTagOrder: [],
  badgeTags: [],
  processContent: true,
};

describe('buildOverviewItems', () => {
  it('calls buildOverviewContent and returns link items with correct shape', () => {
    const document = { openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' }, paths: {} };

    const items = openApiContext.run(baseContext, () => buildOverviewItems(document));

    expect(vi.mocked(extractContentUntilFirstHeading)).toHaveBeenCalledOnce();
    expect(vi.mocked(collectMarkdownSections)).toHaveBeenCalledOnce();
    expect(vi.mocked(buildOverviewContent)).toHaveBeenCalledOnce();
    expect(items[0]).toMatchObject({
      type: 'link',
      link: '/api',
      label: 'My API',
      content: mockedOverviewContent,
    });
  });

});
