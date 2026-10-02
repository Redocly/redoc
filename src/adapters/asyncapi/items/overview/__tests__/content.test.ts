import { describe, it, expect } from 'vitest';

import type { AsyncApiDefinition } from '../../../../../types/asyncapi.js';
import type {
  ContainerNode,
  ExternalDocsNode,
  OverviewSectionWrapperNode,
} from '../../../../../types/content.js';

import { contentType, nodeTypes } from '../../../../../types/common.js';
import { buildOverviewContent } from '../content.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

const document: AsyncApiDefinition = {
  asyncapi: '2.6.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'Great API',
    contact: { name: 'Support', url: 'https://example.com', email: 'support@example.com' },
    license: { name: 'MIT' },
    termsOfService: 'https://example.com/terms',
  },
};

const options = {
  ...normalizeOptions({
    specType: 'asyncapi' as const,
    metadata: {},
    downloadUrls: [],
    protocol: 'kafka',
    basePath: '',
  }),
  markdownParser: markdocParser,
};

describe('buildOverviewContent', () => {
  it('should build the content structure with the correct nodes', () => {
    const result = buildOverviewContent({
      document,
      options,
      protocol: null,
      sectionChildren: [],
      basePath: '/async',
    });

    const container = result.children[0] as ContainerNode;
    const overviewSection = container.children[0] as OverviewSectionWrapperNode;

    expect(result.contentType).toBe(contentType.OVERVIEW);
    expect(container.panels).toBeDefined();
    expect(container.panels?.length).toBeGreaterThan(0);
    expect(overviewSection).toMatchObject({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      sectionId: '/async',
    });
    expect(overviewSection.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 1,
      label: 'My API 1.0.0',
    });
    const introWrapper = overviewSection.children[1] as OverviewSectionWrapperNode;
    expect(introWrapper).toMatchObject({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      sectionId: '/async',
    });
    expect(introWrapper.children[0].nodeType).toBe(nodeTypes.MARKDOC);
  });

  it('should append external-docs node after intro when info.externalDocs is set', () => {
    const withExt: AsyncApiDefinition = {
      ...document,
      info: {
        ...document.info,
        externalDocs: { url: 'https://docs.example.com', description: 'Read the guide' },
      },
    };

    const result = buildOverviewContent({
      document: withExt,
      options,
      protocol: null,
      sectionChildren: [],
      basePath: '/async',
    });

    const container = result.children[0] as ContainerNode;
    const overviewSection = container.children[0] as OverviewSectionWrapperNode;
    const externalDocs = overviewSection.children[
      overviewSection.children.length - 1
    ] as ExternalDocsNode;

    expect(externalDocs.nodeType).toBe(nodeTypes.EXTERNAL_DOCS);
    expect(externalDocs.url).toBe('https://docs.example.com');
    expect(externalDocs.description).toBeDefined();
  });

  it('omits the download panel when downloadUrls is empty', () => {
    const result = buildOverviewContent({
      document,
      options,
      protocol: null,
      sectionChildren: [],
      basePath: '/async',
    });

    const container = result.children[0] as ContainerNode;
    expect(container.panels?.some((p) => p.title === 'Download AsyncAPI description')).toBe(false);
  });

  it('builds the download panel when downloadUrls are configured', () => {
    const result = buildOverviewContent({
      document,
      options: { ...options, downloadUrls: [{ title: 'YAML', url: '/asyncapi.yaml' }] },
      protocol: null,
      sectionChildren: [],
      basePath: '/async',
    });

    const container = result.children[0] as ContainerNode;
    expect(container.panels?.some((p) => p.title === 'Download AsyncAPI description')).toBe(true);
  });
});
