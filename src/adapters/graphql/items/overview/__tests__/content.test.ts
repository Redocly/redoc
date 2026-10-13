import { describe, it, expect } from 'vitest';

import type { ContainerNode, OverviewSectionWrapperNode } from '../../../../../types/content.js';

import { contentType, nodeTypes, panelKind } from '../../../../../types/common.js';
import { buildOverviewContent } from '../content.js';
import type { ApiDocsOptions } from '../../../../../types/options.js';

describe('buildOverviewContent', () => {
  it('should build the content structure with all required nodes and panels', () => {
    const markdoc = [{ type: 'paragraph' }] as never;

    const result = buildOverviewContent({
      options: {
        info: {
          title: 'My API',
          description: 'Great API',
          contact: { name: 'Support', url: 'https://example.com', email: 'support@example.com' },
          license: { name: 'MIT' },
          termsOfService: 'https://example.com/terms',
        },
        downloadUrls: [{ title: 'JSON', url: '/spec.json' }],
        metadata: {
          title: 'Ignored in table',
          description: 'Also ignored',
          apiId: 'inventory-123',
        },
      } as ApiDocsOptions,
      markdoc,
      sectionChildren: [],
    });

    const container = result.children[0] as ContainerNode;
    const overviewSection = container.children[0] as OverviewSectionWrapperNode;

    expect(result.contentType).toBe(contentType.OVERVIEW);

    expect(overviewSection).toMatchObject({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      sectionId: '/',
    });
    expect(overviewSection.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 1,
      label: 'My API',
    });
    const introWrapper = overviewSection.children[1] as OverviewSectionWrapperNode;
    expect(introWrapper).toMatchObject({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      sectionId: '/',
    });
    expect(introWrapper.children[0]).toMatchObject({
      nodeType: nodeTypes.MARKDOC,
    });

    expect(overviewSection.children[2]).toMatchObject({
      nodeType: nodeTypes.INFO_METADATA,
      rows: [{ key: 'apiId', value: 'inventory-123' }],
    });

    expect(container.panels?.[0]?.children[0]).toMatchObject({
      kind: panelKind.DOWNLOAD,
      label: 'JSON',
      url: '/spec.json',
    });
    expect(container.panels?.[1]?.children.map((item) => item.kind)).toEqual([
      'externallink',
      'email',
      'attribute',
      'externallink',
    ]);
  });

  it('appends info.version to the overview heading label', () => {
    const result = buildOverviewContent({
      options: { info: { title: 'My API', version: '1.0.0' } } as ApiDocsOptions,
      sectionChildren: [],
    });

    const container = result.children[0] as ContainerNode;
    const overviewSection = container.children[0] as OverviewSectionWrapperNode;

    expect(overviewSection.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 1,
      label: 'My API (1.0.0)',
      labelTranslationKey: undefined,
    });
  });

  it('omits the download panel when hideDownloadButtons is true', () => {
    const result = buildOverviewContent({
      options: {
        info: { title: 'My API' },
        downloadUrls: [{ title: 'JSON', url: '/spec.json' }],
        hideDownloadButtons: true,
      } as ApiDocsOptions,
      sectionChildren: [],
    });

    const container = result.children[0] as ContainerNode;
    expect(
      container.panels?.some((p) => p.children.some((item) => item.kind === panelKind.DOWNLOAD)),
    ).toBe(false);
  });
});
