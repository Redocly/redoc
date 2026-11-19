import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { PanelItem, PanelNode } from '../../../types/content.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';
import type { Fixture } from '../../__tests__/harness.js';

import { panelKind } from '../../../types/common.js';
import { findNodes, openApiFixture, renderWithFixture } from '../../__tests__/harness.js';
import { ContentWrapper } from '../../common/ContentWrapper.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

const document = {
  openapi: '3.0.3',
  info: { title: 'Panels API', version: '1.0.0' },
  paths: {
    '/ping': {
      get: {
        operationId: 'ping',
        responses: {
          '200': {
            description: 'Pong',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { pong: { type: 'boolean' } } },
                example: { pong: true },
              },
            },
          },
        },
      },
    },
  },
} as unknown as OpenAPIDefinition;

let fixture: Fixture;

beforeAll(async () => {
  fixture = await openApiFixture(document);
});

afterEach(() => {
  cleanup();
});

function panelItem(kind: string): PanelItem {
  const [item] = findNodes<PanelItem>(fixture.items, (n) => n.kind === kind);
  if (!item) throw new Error(`No ${kind} panel item in the adapter output`);
  return item;
}

function renderPanel(children: unknown[], title?: string) {
  const panel = { title, children } as unknown as PanelNode;
  return renderWithFixture(<ContentWrapper panels={[panel]}>middle</ContentWrapper>, fixture);
}

const link: PanelItem = {
  kind: panelKind.EXTERNAL_LINK,
  title: 'Docs',
  label: 'Read the docs',
  url: 'https://example.com/docs',
};

describe('PanelMapper dispatch through ContentWrapper', () => {
  it('renders the MCP panel when a TAGS item is present', () => {
    renderPanel([link, { kind: panelKind.TAGS, title: 'Hints', tags: [{ text: 'read-only' }] }]);

    expect(screen.getByText('read-only')).toBeInTheDocument();
    expect(screen.getByText('Read the docs')).toBeInTheDocument();
  });

  it('renders the MCP panel when a CONNECT_MCP_BUTTON item is present', () => {
    renderPanel([
      { kind: panelKind.ATTRIBUTE, label: 'Transport', title: 'Transport', value: 'http' },
      {
        kind: panelKind.CONNECT_MCP_BUTTON,
        mcpUrl: 'https://example.com/mcp',
        actions: ['copy-url'],
      },
    ]);

    expect(screen.getByText('http')).toBeInTheDocument();
  });

  it('renders the overview panel for only EXTERNAL_LINK, EMAIL and ATTRIBUTE items', () => {
    renderPanel([
      link,
      { kind: panelKind.EMAIL, label: 'Write us', email: 'team@example.com' },
      { kind: panelKind.ATTRIBUTE, label: 'Version', value: '1.0.0' },
    ]);

    expect(screen.getByText('Read the docs')).toBeInTheDocument();
    expect(screen.getByText('Write us').getAttribute('href')).toBe('mailto:team@example.com');
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('renders the download panel for a single DOWNLOAD item', () => {
    renderPanel([{ kind: panelKind.DOWNLOAD, label: 'openapi.yaml', url: '/openapi.yaml' }]);

    expect(screen.getByText('openapi.yaml').getAttribute('href')).toBe('/openapi.yaml');
  });

  it('renders one example panel per item for mixed example kinds', () => {
    renderPanel([panelItem(panelKind.CODE_SAMPLE), panelItem(panelKind.RESPONSE)]);

    const panels = screen.getByTestId('right-panel');
    expect(panels).toHaveTextContent('/ping');
    expect(panels).toHaveTextContent('"pong": true');
  });

  it('renders nothing for an unknown kind', () => {
    renderPanel([{ kind: 'mystery' }]);

    expect(screen.getByTestId('right-panel')).toBeEmptyDOMElement();
  });

  it('renders nothing for mixed non-example kinds', () => {
    renderPanel([
      { kind: panelKind.DOWNLOAD, label: 'openapi.yaml', url: '/openapi.yaml' },
      { kind: panelKind.REFERENCES, references: [] },
    ]);

    expect(screen.getByTestId('right-panel')).toBeEmptyDOMElement();
  });

  it('renders nothing for empty children', () => {
    renderPanel([]);

    expect(screen.getByTestId('right-panel')).toBeEmptyDOMElement();
  });
});
