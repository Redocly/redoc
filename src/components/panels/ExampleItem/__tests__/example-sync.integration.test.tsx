import { describe, it, expect, beforeAll } from 'vitest';
import { render, fireEvent, within, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type {
  CodeSamplePanelItem,
  ResponseExamplesPanelItem,
  PanelItem,
} from '../../../../types/content.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';
import type { ApiItem, ApiStore } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../markdoc/markdocParser.js';
import { processOpenApiDocument } from '../../../../adapters/openapi/index.js';
import { collectAllItems } from '../../../../adapters/__tests__/utils.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { CodeSampleItem } from '../CodeSampleItem.js';
import { ResponseExampleItem } from '../ResponseExampleItem.js';

const syncDocument: OpenAPIDefinition = {
  openapi: '3.0.3',
  info: { title: 'Dummy Integration API', version: '1.0.0' },
  paths: {
    '/dummy': {
      get: {
        summary: 'Dummy endpoint',
        operationId: 'getDummy',
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChessResult' },
              examples: {
                winning: {
                  summary: 'Winning a match',
                  value: { opponent: 'hikaru', result: 'won' },
                },
                losing: {
                  summary: 'Losing a match',
                  value: { opponent: 'SenseiDanya', result: 'lost' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChessResult' },
                examples: {
                  winning: {
                    summary: 'Winning a match',
                    value: { opponent: 'hikaru', result: 'won', id: 'abc123' },
                  },
                  losing: {
                    summary: 'Losing a match',
                    value: { opponent: 'SenseiDanya', result: 'lost', id: 'def456' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ChessResult: {
        type: 'object',
        required: ['opponent', 'result'],
        properties: {
          opponent: { type: 'string', example: 'hikaru' },
          result: { type: 'string', enum: ['won', 'lost'], example: 'won' },
          id: { type: 'string', example: 'abc123' },
        },
      },
    },
  },
} as unknown as OpenAPIDefinition;

function findPanelChild<T extends PanelItem>(items: ApiItem[], kind: string): T {
  for (const item of items) {
    const content = item.content as {
      children?: Array<{ panels?: Array<{ children?: Array<{ kind?: string }> }> }>;
    };
    for (const child of content?.children ?? []) {
      for (const panel of child.panels ?? []) {
        for (const c of panel.children ?? []) {
          if (c.kind === kind) return c as T;
        }
      }
    }
  }
  throw new Error(`No panel child of kind ${kind}`);
}

const options = normalizeOptions({
  specType: 'openapi',
  downloadUrls: [],
  metadata: {},
  basePath: '',
  markdownParser: markdocParser,
});

type Fixture = {
  items: ApiItem[];
  store: ApiStore;
  codeSampleNode: CodeSamplePanelItem;
  responseNode: ResponseExamplesPanelItem;
};

async function buildFixture(doc: OpenAPIDefinition): Promise<Fixture> {
  const result = await processOpenApiDocument({
    type: 'openapi',
    document: doc,
    basePath: '/',
    options,
  });
  const items = collectAllItems(result.items);
  return {
    items,
    store: result.store,
    codeSampleNode: findPanelChild<CodeSamplePanelItem>(items, 'code-sample'),
    responseNode: findPanelChild<ResponseExamplesPanelItem>(items, 'response'),
  };
}

function pickExample(side: HTMLElement, label: string) {
  const trigger = within(side).getByRole('button', { name: 'Example' });
  fireEvent.click(trigger);
  // The dropdown menu is portalled to document.body; only one menu is open at
  // a time, so a document-wide lookup is unambiguous.
  const item = screen.getAllByText(label).find((el) => el.closest('[role="menuitem"]'));
  if (!item) throw new Error(`Menu item "${label}" not found`);
  fireEvent.click(item);
}

function exampleTriggerText(side: HTMLElement) {
  return within(side).getByRole('button', { name: 'Example' }).textContent;
}

function renderFixture(fixture: Fixture) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: fixture.items,
    store: fixture.store,
    options,
    replayDefinition: null,
  });

  return render(
    <Provider store={jotaiStore}>
      <ItemIdContext.Provider value="test-operation">
        <div data-testid="request-side">
          <CodeSampleItem node={{ ...fixture.codeSampleNode }} />
        </div>
        <div data-testid="response-side">
          <ResponseExampleItem node={fixture.responseNode} />
        </div>
      </ItemIdContext.Provider>
    </Provider>,
  );
}

describe('request/response example sync', () => {
  let fixture: Fixture;
  let items: ApiItem[];
  let store: ApiStore;
  let codeSampleNode: CodeSamplePanelItem;
  let responseNode: ResponseExamplesPanelItem;

  beforeAll(async () => {
    fixture = await buildFixture(syncDocument);
    ({ items, store, codeSampleNode, responseNode } = fixture);
  });

  function renderBoth() {
    return renderFixture(fixture);
  }

  it('selecting a response example updates the request panel', () => {
    renderBoth();
    const requestSide = screen.getByTestId('request-side');
    const responseSide = screen.getByTestId('response-side');

    expect(exampleTriggerText(requestSide)).toContain('Winning a match');

    pickExample(responseSide, 'Losing a match');

    expect(exampleTriggerText(responseSide)).toContain('Losing a match');
    expect(exampleTriggerText(requestSide)).toContain('Losing a match');
  });

  it('selecting a request example updates the response panel', () => {
    renderBoth();
    const requestSide = screen.getByTestId('request-side');
    const responseSide = screen.getByTestId('response-side');

    pickExample(requestSide, 'Losing a match');

    expect(exampleTriggerText(requestSide)).toContain('Losing a match');
    expect(exampleTriggerText(responseSide)).toContain('Losing a match');
  });

  it('does not leak the selection into another operation with the same example keys', () => {
    const jotaiStore = createStore();
    jotaiStore.set(globalStoreAtom, { items, store, options, replayDefinition: null });

    render(
      <Provider store={jotaiStore}>
        <ItemIdContext.Provider value="operation-a">
          <div data-testid="response-side">
            <ResponseExampleItem node={responseNode} />
          </div>
        </ItemIdContext.Provider>
        <ItemIdContext.Provider value="operation-b">
          <div data-testid="other-request-side">
            <CodeSampleItem node={{ ...codeSampleNode }} />
          </div>
        </ItemIdContext.Provider>
      </Provider>,
    );

    pickExample(screen.getByTestId('response-side'), 'Losing a match');

    expect(exampleTriggerText(screen.getByTestId('response-side'))).toContain('Losing a match');
    expect(exampleTriggerText(screen.getByTestId('other-request-side'))).toContain(
      'Winning a match',
    );
  });
});

const HTML_SUMMARY = '<b>Shared</b> <script>alert(1)</script> example';
const MARKDOWN_SUMMARY = '**Request** only {% markdoc tag %}';
const WEIRD_SUMMARY = 'юникод 🚀 例 we!rd $umm@ry <>&{}[]|`~%^*() 42.000';

const overlapDocument = {
  openapi: '3.0.3',
  info: { title: 'Overlap API', version: '1.0.0' },
  paths: {
    '/overlap': {
      post: {
        summary: 'Overlap endpoint',
        operationId: 'postOverlap',
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { a: { type: 'string' } } },
              examples: {
                shared: { summary: HTML_SUMMARY, value: { a: 'shared-req' } },
                requestOnly: { summary: MARKDOWN_SUMMARY, value: { a: 'req-only' } },
                'ключ-🚀-例!@#': { summary: WEIRD_SUMMARY, value: { a: 'weird-req' } },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { a: { type: 'string' } } },
                examples: {
                  shared: { summary: HTML_SUMMARY, value: { a: 'shared-resp' } },
                  responseOnly: { summary: 'Response only', value: { a: 'resp-only' } },
                  'ключ-🚀-例!@#': { summary: WEIRD_SUMMARY, value: { a: 'weird-resp' } },
                },
              },
            },
          },
        },
      },
    },
  },
} as unknown as OpenAPIDefinition;

describe('partially overlapping example names', () => {
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await buildFixture(overlapDocument);
  });

  it('syncs the shared name and leaves the other panel untouched for names it does not have', () => {
    renderFixture(fixture);
    const requestSide = screen.getByTestId('request-side');
    const responseSide = screen.getByTestId('response-side');

    // response-only name: response switches, request keeps its selection
    pickExample(responseSide, 'Response only');
    expect(exampleTriggerText(responseSide)).toContain('Response only');
    expect(exampleTriggerText(requestSide)).toContain(HTML_SUMMARY);

    // shared name: both panels follow
    pickExample(responseSide, HTML_SUMMARY);
    expect(exampleTriggerText(responseSide)).toContain(HTML_SUMMARY);
    expect(exampleTriggerText(requestSide)).toContain(HTML_SUMMARY);

    // request-only name: request switches, response keeps the shared selection
    pickExample(requestSide, MARKDOWN_SUMMARY);
    expect(exampleTriggerText(requestSide)).toContain(MARKDOWN_SUMMARY);
    expect(exampleTriggerText(responseSide)).toContain(HTML_SUMMARY);

    // unmatched key must not reset the other panel to its first example:
    // request sits on a non-first example, response picks a response-only name
    pickExample(responseSide, 'Response only');
    expect(exampleTriggerText(responseSide)).toContain('Response only');
    expect(exampleTriggerText(requestSide)).toContain(MARKDOWN_SUMMARY);

    // unicode/special-chars key and summary sync too
    pickExample(responseSide, WEIRD_SUMMARY);
    expect(exampleTriggerText(responseSide)).toBe(WEIRD_SUMMARY);
    expect(exampleTriggerText(requestSide)).toBe(WEIRD_SUMMARY);
  });

  it('renders HTML and markdown in example summaries as literal text', () => {
    renderFixture(fixture);
    const requestSide = screen.getByTestId('request-side');
    const trigger = within(requestSide).getByRole('button', { name: 'Example' });

    // the raw string is shown verbatim, not parsed into elements
    expect(trigger.textContent).toBe(HTML_SUMMARY);
    expect(trigger.querySelector('b, script')).toBeNull();

    fireEvent.click(trigger);
    // menu options are portalled to document.body
    const markdownOption = screen
      .getAllByText(MARKDOWN_SUMMARY)
      .find((el) => el.closest('[role="menuitem"]'));
    expect(markdownOption).toBeDefined();
    expect(document.body.querySelector('b, script')).toBeNull();
  });
});
