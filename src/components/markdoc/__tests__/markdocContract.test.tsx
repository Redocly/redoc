import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import markdoc from '@redocly/markdoc';
import '@testing-library/jest-dom/vitest';

import type { Tag } from '@redocly/markdoc';
import type { ComponentType } from 'react';
import type { McpData } from '../../../types/store.js';

import { apiDocsMarkdocComponents } from '../apiDocsMarkdocComponents.js';
import { apiDocsMarkdocNodes, apiDocsMarkdocTags } from '../defaultMarkdocConfig.js';
import { buildMarkdocOptions } from '../buildMarkdocOptions.js';
import { createMarkdocAdapter } from '../markdocAdapter.js';
import { options, renderWithFixture } from '../../__tests__/harness.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

afterEach(() => {
  cleanup();
});

const Stub = (() => null) as unknown as ComponentType;

function transformTagName(source: string): string | undefined {
  const ast = markdoc.parse(source);
  const tree = markdoc.transform(ast, {
    tags: apiDocsMarkdocTags,
    nodes: apiDocsMarkdocNodes,
  }) as Tag;
  return (tree.children[0] as Tag).name;
}

describe('api-docs markdoc tag/component contract', () => {
  it('provides a component for every tag render name', () => {
    const renderNames = Object.entries(apiDocsMarkdocTags)
      .filter(([, schema]) => typeof schema.render === 'string')
      .map(([, schema]) => schema.render as string);

    expect(renderNames.sort()).toEqual(['McpPrompt', 'McpResource', 'McpTool', 'SchemaDefinition']);
    for (const name of renderNames) {
      expect(apiDocsMarkdocComponents).toHaveProperty(name);
    }
  });

  it('keeps the html tag transform-only', () => {
    expect(apiDocsMarkdocTags.html.render).toBeUndefined();
  });

  it('transforms a heading into a tag that has a component', () => {
    const name = transformTagName('# Title');

    expect(name).toBe('Heading');
    expect(apiDocsMarkdocComponents).toHaveProperty(name as string);
  });
});

describe('buildMarkdocOptions precedence', () => {
  it('keeps built-in components over host components', () => {
    const options = buildMarkdocOptions({ components: { Heading: Stub, Custom: Stub } });

    expect(options.components?.Heading).toBe(apiDocsMarkdocComponents.Heading);
    expect(options.components?.Custom).toBe(Stub);
  });

  it('lets host tags win over built-in tags', () => {
    const hostTag = { render: 'Host' };
    const options = buildMarkdocOptions({ tags: { schemaDefinition: hostTag } });

    expect(options.tags?.schemaDefinition).toBe(hostTag);
    expect(options.tags?.mcpTool).toBe(apiDocsMarkdocTags.mcpTool);
  });

  it('lets host nodes win except heading', () => {
    const hostHeading = { children: ['inline'] };
    const hostParagraph = { children: ['inline'] };
    const options = buildMarkdocOptions({
      nodes: { heading: hostHeading, paragraph: hostParagraph },
    });

    expect(options.nodes?.heading).toBe(apiDocsMarkdocNodes.heading);
    expect(options.nodes?.paragraph).toBe(hostParagraph);
  });

  it('passes host-only keys through', () => {
    const partials = {};
    const variables = { a: 1 };
    const options = buildMarkdocOptions({ partials, variables });

    expect(options.partials).toBe(partials);
    expect(options.variables).toBe(variables);
  });
});

describe('MCP tag rendering through the adapter', () => {
  function renderTag(source: string, mcp: McpData): HTMLElement {
    const adapter = createMarkdocAdapter();

    return renderWithFixture(<>{adapter.render(adapter.parse(source))}</>, {
      items: [],
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {}, mcp },
      options: options('openapi'),
    }).container;
  }

  const mcp: McpData = {
    tools: [{ name: 'create_user', description: 'Creates a user', inputSchema: {} }],
  };

  it('renders a known tool', () => {
    renderTag('{% mcpTool name="create_user" /%}', mcp);

    expect(screen.getByText('create_user')).toBeInTheDocument();
  });

  it('renders nothing for an unknown tool', () => {
    renderTag('{% mcpTool name="missing" /%}', mcp);

    expect(screen.queryByText('Tool name')).not.toBeInTheDocument();
    expect(screen.queryByText('missing')).not.toBeInTheDocument();
  });
});
