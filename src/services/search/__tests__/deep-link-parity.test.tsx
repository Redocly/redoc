import { describe, it, expect, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactElement } from 'react';
import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { ApiItem, SchemaEntry } from '../../../types/store.js';
import type { ContainerNode, ItemContentNode } from '../../../types/content.js';
import type { ApiDocsOptions } from '../../../types/options.js';
import type { Node } from '@markdoc/markdoc';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../types/common.js';
import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../components/markdoc/markdocAdapter.js';
import { SchemaView } from '../../../components/Schema/SchemaView.js';
import { ParametersSection } from '../../../components/ItemContent/sections/ParametersSection.js';
import { ResponsesSection } from '../../../components/ItemContent/sections/ResponsesSection.js';
import { BodySection } from '../../../components/ItemContent/sections/BodySection.js';
import { CallbacksSection } from '../../../components/ItemContent/sections/CallbacksSection.js';
import { MessagesSection } from '../../../components/ItemContent/sections/MessagesSection.js';
import { McpTool } from '../../../components/Mcp/McpTool.js';
import { McpPrompt } from '../../../components/Mcp/McpPrompt.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { deepLinkToId } from '../../../utils/deep-link.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';

const DOCUMENT = {
  openapi: '3.1.0',
  components: {
    schemas: {
      Pet: {
        type: 'object',
        required: ['name', 'photoUrls'],
        discriminator: {
          propertyName: 'petType',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
        },
        properties: {
          petType: { type: 'string', description: 'Kind of pet' },
          name: { type: 'string', description: 'The name given to a pet' },
          photoUrls: {
            type: 'array',
            description: 'The list of URL to a cute photos featuring pet',
            items: { type: 'string' },
          },
          tags: {
            type: 'array',
            description: 'Tags attached to the pet',
            items: { $ref: '#/components/schemas/Tag' },
          },
          origin: {
            description: 'Where the pet came from',
            oneOf: [
              {
                type: 'object',
                title: 'Shelter',
                properties: { shelterName: { type: 'string', description: 'Shelter name' } },
              },
              {
                type: 'object',
                title: 'Breeder',
                properties: {
                  kennels: {
                    type: 'array',
                    description: 'Kennels the breeder runs',
                    items: {
                      type: 'object',
                      properties: { code: { type: 'string', description: 'Kennel code' } },
                    },
                  },
                },
              },
            ],
          },
        },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          {
            type: 'object',
            properties: {
              huntingSkill: { type: 'string', description: 'The measured skill for hunting' },
            },
          },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          {
            type: 'object',
            properties: { packSize: { type: 'integer', description: 'The size of the pack' } },
          },
        ],
      },
      Tag: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Tag name' } },
      },
      LimitParam: { type: 'integer', description: 'Rate limit ceiling' },
      XmlBody: {
        type: 'object',
        properties: { xmlEnvelope: { type: 'string', description: 'XML-only wrapper' } },
      },
      ResponseHeaders: {
        type: 'object',
        properties: {
          'X-Rate-Limit': { type: 'integer', description: 'Calls left in the window' },
        },
      },
    },
  },
};

const BASE_PATH = '/docs';
const ITEM_ID = '/docs/pet/updatepet';
const ROOT_SCHEMA_ID = 'components/schemas/Pet';

const SCHEMA_STORE: Record<string, SchemaEntry> = Object.fromEntries(
  Object.entries(DOCUMENT.components.schemas).map(([name, data]) => [
    `components/schemas/${name}`,
    { id: name, kind: 'json-schema', data } as SchemaEntry,
  ]),
);

function indexRequestBodyFields(): Array<{ name: string; deepLink: string }> {
  const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
  indexer.addItem({
    type: 'link',
    label: 'Update an existing pet',
    link: ITEM_ID,
    content: {
      contentType: contentType.ITEM,
      children: [
        {
          nodeType: nodeTypes.ITEM,
          variant: 'body',
          parameters: [],
          mediaTypeSchemas: { 'application/json': { schemaId: ROOT_SCHEMA_ID } },
        },
      ],
    },
  } as unknown as ApiItem);

  const [doc] = indexer.getResult();
  return (doc.parameters ?? [])
    .filter((param) => param.deepLink)
    .map((param) => ({ name: param.name as string, deepLink: param.deepLink as string }));
}

function renderAtHash(
  hash: string,
  ui?: ReactElement,
  storeExtras: Partial<GlobalStoreAtom['store']> = {},
): HTMLElement {
  window.location.hash = hash;
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore: SCHEMA_STORE,
      exampleStore: {},
      securitySchemeStore: {},
      ...storeExtras,
    } as GlobalStoreAtom['store'],
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      maxDisplayedEnumValues: 10,
      basePath: BASE_PATH,
      schemasExpansionLevel: 'all',
      markdownParser: (
        source: string,
        _?: Partial<Pick<ApiDocsOptions, 'sanitize' | 'unstable_hooks'>>,
      ): Node | Node[] | undefined => ({ type: 'text', attributes: { content: source } }) as Node,
    }),
    replayDefinition: null,
  });

  const wrapped: ReactElement = (
    <MemoryRouter initialEntries={[{ pathname: ITEM_ID, hash }]}>
      <JotaiProvider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={ITEM_ID}>
            {ui ?? (
              <DeepLinkSectionContext.Provider value={{ t: 'request' }}>
                <SchemaView schemaId={ROOT_SCHEMA_ID} level={1} expandByDefault />
              </DeepLinkSectionContext.Provider>
            )}
          </ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>
  );

  return render(wrapped).container;
}

describe('search deep links resolve to rendered field ids', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it.each(indexRequestBodyFields())(
    'lands on $name',
    ({ deepLink }: { name: string; deepLink: string }) => {
      const targetId = deepLinkToId(deepLink);
      const container = renderAtHash(`#${targetId}`);

      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    },
  );

  it.each(['query', 'path', 'headers', 'cookies', 'querystring', 'parameters'] as const)(
    'lands on a %s parameter field',
    (variant) => {
      const paramsNode = {
        nodeType: nodeTypes.ITEM,
        variant,
        parameters: [
          {
            name: 'X-Rate-Limit',
            description: 'Rate limit',
            schemaId: 'components/schemas/LimitParam',
            required: true,
          },
        ],
      } as unknown as ItemContentNode;

      const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
      indexer.addItem({
        type: 'link',
        label: 'Update an existing pet',
        link: ITEM_ID,
        content: { contentType: contentType.ITEM, children: [paramsNode] },
      } as unknown as ApiItem);

      const [doc] = indexer.getResult();
      const param = (doc.parameters ?? []).find((p) => p.name === 'X-Rate-Limit');
      const targetId = deepLinkToId(param?.deepLink ?? '');
      expect(targetId).not.toBe('');

      const container = renderAtHash(`#${targetId}`, <ParametersSection node={paramsNode} />);
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    },
  );

  it('lands on response body fields, second-media-type fields, and response headers', () => {
    const responsesNode = {
      nodeType: nodeTypes.ITEM,
      variant: 'responses',
      responses: [
        {
          code: '200',
          mediaTypeContent: {
            'application/json': { schemaId: 'components/schemas/Tag' },
            'application/xml': { schemaId: 'components/schemas/XmlBody' },
          },
          headerSchemaId: 'components/schemas/ResponseHeaders',
        },
      ],
    } as unknown as ItemContentNode;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'Update an existing pet',
      link: ITEM_ID,
      content: { contentType: contentType.ITEM, children: [responsesNode] },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const fieldParams = (doc.parameters ?? []).filter(
      (p) => p.deepLink && String(p.place).endsWith('fields'),
    );
    const headerParams = (doc.parameters ?? []).filter(
      (p) => p.deepLink && String(p.place).endsWith('headers'),
    );
    expect(fieldParams.map((p) => p.name)).toEqual(expect.arrayContaining(['name', 'xmlEnvelope']));
    expect(headerParams.map((p) => p.name)).toEqual(['X-Rate-Limit']);

    for (const param of [...fieldParams, ...headerParams]) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <ResponsesSection node={responsesNode} />);
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }
  });

  it('lands on request body fields of every media type', () => {
    const bodyNode = {
      nodeType: nodeTypes.ITEM,
      variant: 'body',
      mediaTypeSchemas: {
        'application/json': { schemaId: 'components/schemas/Tag' },
        'application/xml': { schemaId: 'components/schemas/XmlBody' },
      },
    } as unknown as ItemContentNode;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'Update an existing pet',
      link: ITEM_ID,
      content: { contentType: contentType.ITEM, children: [bodyNode] },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const fieldParams = (doc.parameters ?? []).filter((p) => p.deepLink);
    expect(fieldParams.map((p) => p.name)).toEqual(expect.arrayContaining(['name', 'xmlEnvelope']));

    for (const param of fieldParams) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <BodySection node={bodyNode} />);
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }
  });

  it('lands on callback parameters, body fields, and response fields', async () => {
    const callbackNode = {
      nodeType: nodeTypes.ITEM,
      variant: 'callback',
      callback: {
        httpVerb: 'post',
        pathName: '{$request.body#/callbackUrl}',
        summary: 'Job completed callback',
        callbackName: 'jobCompleted',
        callbackId: 'jobCompleted/post',
        contentChildren: [
          {
            nodeType: nodeTypes.ITEM,
            variant: 'query',
            parameters: [
              {
                name: 'verbose',
                description: 'Verbose flag',
                schemaId: 'components/schemas/LimitParam',
              },
            ],
          },
          {
            nodeType: nodeTypes.ITEM,
            variant: 'body',
            mediaTypeSchemas: { 'application/json': { schemaId: 'components/schemas/Tag' } },
          },
          {
            nodeType: nodeTypes.ITEM,
            variant: 'responses',
            responses: [
              {
                code: '200',
                description: 'OK',
                mediaTypeContent: { 'application/json': { schemaId: 'components/schemas/Tag' } },
              },
            ],
          },
        ],
      },
    } as unknown as ItemContentNode;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'Update an existing pet',
      link: ITEM_ID,
      content: { contentType: contentType.ITEM, children: [callbackNode] },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const byName = Object.fromEntries(
      (doc.parameters ?? []).map((p) => [`${p.place}:${p.name}`, p]),
    );
    const link = (suffix: string): string => `/pet/updatepet#pet/updatepet/${suffix}`;

    expect(byName['callback:jobCompleted']?.deepLink).toBe(link('callbacks/jobcompleted/post'));
    expect(byName['callback response 200:200']?.deepLink).toBe(
      link('callbacks/jobcompleted/post/response&c=200'),
    );

    const fieldParams = [
      byName['callback query parameters:verbose'],
      byName['callback request fields:name'],
      byName['callback response 200 fields:name'],
    ];
    for (const param of fieldParams) {
      expect(param?.deepLink).toBeTruthy();
      const targetId = deepLinkToId(param?.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <CallbacksSection node={callbackNode} />);
      // The callback panel expands from the hash via an effect + item store write.
      await waitFor(() => {
        const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
        expect(rendered).toContain(targetId);
      });
    }
  });

  it('lands on schema definition page fields (pathOnly anchors)', () => {
    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'Pet',
      link: ITEM_ID,
      content: {
        contentType: contentType.ITEM,
        itemVariant: itemVariant.SCHEMA,
        meta: { name: 'Pet' },
        children: [],
      },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const fieldParams = (doc.parameters ?? []).filter((p) => p.deepLink);
    expect(fieldParams.map((p) => p.name)).toEqual(expect.arrayContaining(['petType', 'name']));

    for (const param of fieldParams) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(
        `#${targetId}`,
        <DeepLinkSectionContext.Provider value={{ pathOnly: true }}>
          <SchemaView schemaId={ROOT_SCHEMA_ID} level={1} expandByDefault />
        </DeepLinkSectionContext.Provider>,
      );
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }
  });

  it('lands on the AsyncAPI message switcher and payload fields', () => {
    const messagesNode = {
      nodeType: nodeTypes.ITEM,
      variant: 'messages',
      messages: [
        {
          name: 'userSignedUp',
          label: 'userSignedUp',
          summary: 'A user signed up',
          schemaId: 'components/schemas/Tag',
        },
      ],
    } as unknown as ItemContentNode;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'User events',
      link: ITEM_ID,
      content: { contentType: contentType.ITEM, children: [messagesNode] },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const params = (doc.parameters ?? []).filter((p) => p.deepLink);
    const message = params.find((p) => p.place === 'message');
    expect(message?.deepLink).toBe('/pet/updatepet#pet/updatepet/messages&m=usersignedup');

    for (const param of params) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <MessagesSection node={messagesNode} />);
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }
  });

  it('lands on MCP tool schema fields and prompt arguments', () => {
    const mcp = {
      tools: [
        {
          name: 'echo',
          description: 'Echoes back the input',
          inputSchema: {
            type: 'object',
            properties: { message: { type: 'string', description: 'Message to echo' } },
            required: ['message'],
          },
          outputSchema: {
            type: 'object',
            properties: { echoed: { type: 'string', description: 'The echoed text' } },
          },
        },
      ],
      prompts: [
        {
          name: 'complex_prompt',
          description: 'A prompt with arguments',
          arguments: [{ name: 'temperature', description: 'Temperature setting', required: true }],
        },
      ],
    };
    const document = { ...DOCUMENT, 'x-mcp': mcp };
    const mcpItem = (httpVerb: string, name: string) =>
      ({
        type: 'link',
        label: name,
        link: ITEM_ID,
        httpVerb,
        content: {
          contentType: contentType.ITEM,
          meta: { name },
          children: [{ nodeType: nodeTypes.MARKDOC, content: [] }],
        },
      }) as unknown as ApiItem;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, document);
    indexer.addItem(mcpItem('tool', 'echo'));
    indexer.addItem(mcpItem('prompt', 'complex_prompt'));
    const [tool, prompt] = indexer.getResult();

    expect((tool.parameters ?? []).map((p) => p.name)).toEqual(['message', 'echoed']);
    for (const param of tool.parameters ?? []) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <McpTool name="echo" />, { mcp });
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }

    expect((prompt.parameters ?? []).map((p) => p.name)).toEqual(['temperature']);
    for (const param of prompt.parameters ?? []) {
      const targetId = deepLinkToId(param.deepLink as string);
      const container = renderAtHash(`#${targetId}`, <McpPrompt name="complex_prompt" />, { mcp });
      const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
      expect(rendered).toContain(targetId);
    }
  });

  it('lands on Kafka message-binding key fields', () => {
    const container = {
      nodeType: nodeTypes.CONTAINER,
      panels: [
        {
          title: 'Message configuration',
          children: [
            {
              kind: panelKind.MESSAGE_BINDING,
              bindingsByMessageKey: {
                userSignedUp: {
                  bindingKey: 'kafka',
                  bindingValue: {},
                  keySchemaId: 'components/schemas/Tag',
                },
              },
            },
          ],
        },
      ],
      children: [],
    } as unknown as ContainerNode;

    const indexer = new ApiDocsSearchIndexer(BASE_PATH, SCHEMA_STORE, DOCUMENT);
    indexer.addItem({
      type: 'link',
      label: 'User events',
      link: ITEM_ID,
      content: { contentType: contentType.ITEM, children: [container] },
    } as unknown as ApiItem);

    const [doc] = indexer.getResult();
    const params = (doc.parameters ?? []).filter((p) => p.place === 'message bindings');
    expect(params.length).toBeGreaterThan(0);
    expect(params[0].deepLink).toBe(
      '/pet/updatepet#pet/updatepet/messages&m=usersignedup&t=bindings&path=name',
    );

    for (const param of params) {
      const targetId = deepLinkToId(param.deepLink as string);
      const rendered = renderAtHash(
        `#${targetId}`,
        <DeepLinkSectionContext.Provider
          value={{ asyncSection: 'messages', messageKey: 'userSignedUp', t: 'bindings' }}
        >
          <SchemaView schemaId="components/schemas/Tag" expandByDefault level={1} />
        </DeepLinkSectionContext.Provider>,
      );
      const ids = Array.from(rendered.querySelectorAll('[id]')).map((el) => el.id);
      expect(ids).toContain(targetId);
    }
  });

  it('keeps the discriminated field path the renderer builds', () => {
    const deepLinks = indexRequestBodyFields().map((field) => field.deepLink);
    const link = (suffix: string): string => `/pet/updatepet#pet/updatepet/t=request&${suffix}`;

    expect(deepLinks).toContain(link('path=&d=0/photourls'));
    expect(deepLinks).toContain(link('path=&d=0/huntingskill'));
    expect(deepLinks).toContain(link('path=&d=1/packsize'));
    expect(deepLinks).toContain(link('path=&d=0/origin&oneof=0/sheltername'));
    expect(deepLinks).toContain(link('path=&d=0/origin&oneof=1/kennels'));
    expect(deepLinks).toContain(link('path=&d=0/tags[]/name'));
    expect(deepLinks).toContain(link('path=&d=0/origin&oneof=1/kennels[]/code'));
    expect(deepLinks).toContain(link('path=pettype'));
  });
});
