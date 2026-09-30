import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactElement } from 'react';
import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { McpData } from '../../../types/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { McpTool } from '../McpTool.js';
import { McpPrompt } from '../McpPrompt.js';
import { McpResource } from '../McpResource.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useThemeHooks: () => ({
    useTranslate: () => ({ translate: (_key: string, fallback: string) => fallback }),
    useTranslationKeys: () => [],
  }),
}));

const MARKDOWN_DESCRIPTION = 'Echoes **back** the `input`';

function renderWithStore(mcp: McpData, ui: ReactElement, basePath = ''): void {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore: {},
      exampleStore: {},
      securitySchemeStore: {},
      mcp,
    } as GlobalStoreAtom['store'],
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath,
      // MCP descriptions are parsed on the client by the markdown adapter, never by the build parser.
      markdownParser: () => undefined,
    }),
    replayDefinition: null,
  });

  render(
    <MemoryRouter>
      <JotaiProvider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>{ui}</MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('MCP item descriptions', () => {
  it('renders a tool description as markdown', () => {
    renderWithStore(
      { tools: [{ name: 'echo', description: MARKDOWN_DESCRIPTION, inputSchema: {} }] },
      <McpTool name="echo" />,
    );

    expect(screen.queryByText(MARKDOWN_DESCRIPTION)).not.toBeInTheDocument();
    expect(screen.getByText('back').tagName).toBe('STRONG');
    expect(screen.getByText('input').tagName).toBe('CODE');
  });

  it('renders a prompt description as markdown', () => {
    renderWithStore(
      { prompts: [{ name: 'greet', description: MARKDOWN_DESCRIPTION, arguments: [] }] },
      <McpPrompt name="greet" />,
    );

    expect(screen.queryByText(MARKDOWN_DESCRIPTION)).not.toBeInTheDocument();
    expect(screen.getByText('back').tagName).toBe('STRONG');
  });

  it('renders a resource description as markdown', () => {
    renderWithStore(
      {
        resources: [
          {
            name: 'readme',
            description: MARKDOWN_DESCRIPTION,
            uri: 'file:///readme.md',
            mimeType: 'text/markdown',
          },
        ],
      },
      <McpResource name="readme" />,
    );

    expect(screen.queryByText(MARKDOWN_DESCRIPTION)).not.toBeInTheDocument();
    expect(screen.getByText('back').tagName).toBe('STRONG');
  });
});

const HEADING_DESCRIPTION = '# Prints\n\nAll the env vars';

// A tool, a prompt and a resource each live on their own route, under their own tag group.
const HEADING_CASES: Array<{ kind: string; itemId: string; mcp: McpData; ui: ReactElement }> = [
  {
    kind: 'tool',
    itemId: '/docs/tools/printenv',
    mcp: { tools: [{ name: 'printEnv', description: HEADING_DESCRIPTION, inputSchema: {} }] },
    ui: <McpTool name="printEnv" />,
  },
  {
    kind: 'prompt',
    itemId: '/docs/prompts/printenv',
    mcp: { prompts: [{ name: 'printEnv', description: HEADING_DESCRIPTION, arguments: [] }] },
    ui: <McpPrompt name="printEnv" />,
  },
  {
    kind: 'resource',
    itemId: '/docs/resources/printenv',
    mcp: {
      resources: [
        {
          name: 'printEnv',
          description: HEADING_DESCRIPTION,
          uri: 'file:///env',
          mimeType: 'text/plain',
        },
      ],
    },
    ui: <McpResource name="printEnv" />,
  },
];

describe.each(HEADING_CASES)(
  'MCP $kind description heading anchors',
  ({ itemId, mcp, ui }: (typeof HEADING_CASES)[number]) => {
    it('scopes the heading id and deep link to the item route', () => {
      renderWithStore(
        mcp,
        <ItemIdContext.Provider value={itemId}>{ui}</ItemIdContext.Provider>,
        '/docs',
      );

      const hashId = `${itemId.replace('/docs/', '')}/prints`;
      const heading = screen.getByText('Prints').closest('h2');
      expect(heading).toHaveAttribute('id', hashId);
      // Same shape as the sibling section anchors (`…#tools/printenv/input-schema`). A bare
      // `section/prints` id would link to `/docs/section/prints`, which is not a route.
      expect(heading?.querySelector('a')).toHaveAttribute(
        'href',
        `${itemId}#${hashId}`.toLowerCase(),
      );
    });
  },
);
