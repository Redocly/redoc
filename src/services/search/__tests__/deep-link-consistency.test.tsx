import { describe, it, expect, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactElement } from 'react';
import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { ApiItem, SchemaEntry } from '../../../types/store.js';
import type { ContainerNode, ItemContentNode } from '../../../types/content.js';
import type { ApiDocsOptions } from '../../../types/options.js';
import type { Node } from '@redocly/markdoc';

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

function storeOf(schemas: Record<string, Record<string, unknown>>): Record<string, SchemaEntry> {
  return Object.fromEntries(
    Object.entries(schemas).map(([name, data]) => [
      `components/schemas/${name}`,
      { id: name, kind: 'json-schema', data },
    ]),
  );
}

const SCHEMA_STORE = storeOf(DOCUMENT.components.schemas);

function indexRequestBodyFields(
  schemaStore = SCHEMA_STORE,
  document: Record<string, unknown> = DOCUMENT,
  schemaId = ROOT_SCHEMA_ID,
): Array<{ name: string; deepLink: string }> {
  const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
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
          mediaTypeSchemas: { 'application/json': { schemaId } },
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
    },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      maxDisplayedEnumValues: 10,
      basePath: BASE_PATH,
      schemasExpansionLevel: 'all',
      markdownParser: (
        source: string,
        _?: Partial<Pick<ApiDocsOptions, 'sanitize'>>,
      ): Node | Node[] | undefined => ({ type: 'text', attributes: { content: source } }) as Node,
    }),
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

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

function discriminator(propertyName: string, mapping: Record<string, string>) {
  return {
    propertyName,
    mapping: Object.fromEntries(
      Object.entries(mapping).map(([value, name]) => [value, ref(name).$ref]),
    ),
  };
}

function indexBodyFields(
  schemas: Record<string, Record<string, unknown>>,
  root: string,
): Array<{ name: string; deepLink: string }> {
  return indexRequestBodyFields(
    storeOf(schemas),
    { ...DOCUMENT, components: { schemas } },
    `components/schemas/${root}`,
  );
}

function unrenderedFieldIds(
  fields: Array<{ deepLink: string }>,
  schemas: Record<string, Record<string, unknown>>,
  root: string,
): string[] {
  return fields
    .map(({ deepLink }) => deepLinkToId(deepLink))
    .filter((targetId) => {
      const container = renderAtHash(
        `#${targetId}`,
        <DeepLinkSectionContext.Provider value={{ t: 'request' }}>
          <SchemaView schemaId={`components/schemas/${root}`} level={1} expandByDefault />
        </DeepLinkSectionContext.Provider>,
        { schemaStore: storeOf(schemas) },
      );
      return !Array.from(container.querySelectorAll('[id]')).some((el) => el.id === targetId);
    });
}

const requestLink = (suffix: string): string => `/pet/updatepet#pet/updatepet/t=request&${suffix}`;

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

  it('keeps the field path of a discriminator option that is a discriminator host', () => {
    const schemas = {
      Drink: {
        oneOf: [ref('Brew'), ref('Juice')],
        discriminator: discriminator('kind', { brew: 'Brew', juice: 'Juice' }),
      },
      Brew: {
        properties: { temperature: { type: 'string' } },
        oneOf: [ref('Espresso'), ref('Latte')],
        discriminator: discriminator('style', { espresso: 'Espresso', latte: 'Latte' }),
      },
      Espresso: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          shots: { type: 'integer' },
        },
      },
      Latte: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
      Juice: {
        type: 'object',
        properties: { kind: { type: 'string' }, fruit: { type: 'string' } },
      },
    };
    const deepLinks = indexBodyFields(schemas, 'Drink').map((field) => field.deepLink);

    expect(deepLinks).toContain(requestLink('path=kind'));
    expect(deepLinks).toContain(requestLink('path=&d=0/style'));
    expect(deepLinks).toContain(requestLink('path=&d=0&d=0/shots'));
    expect(deepLinks).toContain(requestLink('path=&d=0&d=1/milk'));
    expect(deepLinks).toContain(requestLink('path=&d=1/fruit'));
    expect(deepLinks).toContain(requestLink('path=&d=0/temperature'));
  });

  it('keeps the outer discriminator row for a nested host on the same property', () => {
    const schemas = {
      Drink: {
        oneOf: [ref('Brew'), ref('Juice')],
        discriminator: discriminator('kind', { brew: 'Brew', juice: 'Juice' }),
      },
      Brew: {
        oneOf: [ref('Espresso'), ref('Latte')],
        discriminator: discriminator('kind', { espresso: 'Espresso', latte: 'Latte' }),
      },
      Espresso: {
        type: 'object',
        properties: { kind: { type: 'string' }, shots: { type: 'integer' } },
      },
      Latte: {
        type: 'object',
        properties: { kind: { type: 'string' }, milk: { type: 'string' } },
      },
      Juice: {
        type: 'object',
        properties: { kind: { type: 'string' }, fruit: { type: 'string' } },
      },
    };
    const fields = indexBodyFields(schemas, 'Drink');

    expect(fields).toEqual([
      { name: 'kind', deepLink: requestLink('path=kind') },
      { name: 'shots', deepLink: requestLink('path=&d=0&d=0/shots') },
      { name: 'milk', deepLink: requestLink('path=&d=0&d=1/milk') },
      { name: 'fruit', deepLink: requestLink('path=&d=1/fruit') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Drink')).toEqual([]);
  });

  it('keeps every outer discriminator row in options three hosts deep', () => {
    const schemas = {
      Drink: {
        oneOf: [ref('Brew'), ref('Juice')],
        discriminator: discriminator('kind', { brew: 'Brew', juice: 'Juice' }),
      },
      Brew: {
        oneOf: [ref('Espresso'), ref('Tea')],
        discriminator: discriminator('style', { espresso: 'Espresso', tea: 'Tea' }),
      },
      Espresso: {
        oneOf: [ref('Single'), ref('Double')],
        discriminator: discriminator('size', { single: 'Single', double: 'Double' }),
      },
      Single: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          size: { type: 'string' },
          shots: { type: 'integer' },
        },
      },
      Double: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          size: { type: 'string' },
          crema: { type: 'string' },
        },
      },
      Tea: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          leaf: { type: 'string' },
        },
      },
      Juice: {
        type: 'object',
        properties: { kind: { type: 'string' }, fruit: { type: 'string' } },
      },
    };
    const fields = indexBodyFields(schemas, 'Drink');

    expect(fields).toEqual([
      { name: 'kind', deepLink: requestLink('path=kind') },
      { name: 'style', deepLink: requestLink('path=&d=0/style') },
      { name: 'size', deepLink: requestLink('path=&d=0&d=0/size') },
      { name: 'shots', deepLink: requestLink('path=&d=0&d=0&d=0/shots') },
      { name: 'crema', deepLink: requestLink('path=&d=0&d=0&d=1/crema') },
      { name: 'leaf', deepLink: requestLink('path=&d=0&d=1/leaf') },
      { name: 'fruit', deepLink: requestLink('path=&d=1/fruit') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Drink')).toEqual([]);
  });

  it('keeps sibling option paths when an option that inherits the discriminator declares a oneOf', () => {
    const schemas = {
      Pet: {
        type: 'object',
        properties: {
          petType: { type: 'string' },
          name: { type: 'string' },
          nickname: { type: 'string' },
        },
        discriminator: discriminator('petType', { cat: 'Cat', dog: 'Dog' }),
      },
      Cat: {
        allOf: [ref('Pet'), { oneOf: [{ required: ['name'] }, { required: ['nickname'] }] }],
      },
      Dog: {
        allOf: [ref('Pet'), { type: 'object', properties: { packSize: { type: 'integer' } } }],
      },
    };
    const fields = indexBodyFields(schemas, 'Pet');

    expect(fields).toEqual([
      { name: 'petType', deepLink: requestLink('path=pettype') },
      { name: 'name', deepLink: requestLink('path=&d=0/name') },
      { name: 'nickname', deepLink: requestLink('path=&d=0/nickname') },
      { name: 'packSize', deepLink: requestLink('path=&d=1/packsize') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Pet')).toEqual([]);
  });

  it('walks an option that redeclares a discriminator without variants as a plain option', () => {
    const schemas = {
      Pet: {
        oneOf: [ref('Cat'), ref('Dog')],
        discriminator: discriminator('petType', { cat: 'Cat', dog: 'Dog' }),
      },
      Cat: {
        type: 'object',
        properties: { petType: { type: 'string' }, breed: { type: 'string' } },
        discriminator: discriminator('breed', { lion: 'Lion' }),
      },
      Lion: {
        allOf: [ref('Cat'), { type: 'object', properties: { mane: { type: 'string' } } }],
      },
      Dog: {
        type: 'object',
        properties: { petType: { type: 'string' }, bark: { type: 'string' } },
      },
    };
    const fields = indexBodyFields(schemas, 'Pet');

    expect(fields).toEqual([
      { name: 'petType', deepLink: requestLink('path=pettype') },
      { name: 'breed', deepLink: requestLink('path=&d=0/breed') },
      { name: 'bark', deepLink: requestLink('path=&d=1/bark') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Pet')).toEqual([]);
  });

  it('keeps nested host paths below a schema that inherits the discriminator', () => {
    const schemas = {
      Cat: {
        allOf: [ref('Pet'), { type: 'object', properties: { huntingSkill: { type: 'string' } } }],
      },
      Pet: {
        type: 'object',
        properties: { petType: { type: 'string' }, name: { type: 'string' } },
        discriminator: discriminator('petType', { cat: 'Cat', dog: 'Dog' }),
      },
      Dog: {
        oneOf: [ref('Puppy'), ref('Adult')],
        discriminator: discriminator('age', { puppy: 'Puppy', adult: 'Adult' }),
      },
      Puppy: {
        type: 'object',
        properties: {
          petType: { type: 'string' },
          age: { type: 'string' },
          teeth: { type: 'integer' },
        },
      },
      Adult: {
        type: 'object',
        properties: {
          petType: { type: 'string' },
          age: { type: 'string' },
          packSize: { type: 'integer' },
        },
      },
    };
    const fields = indexBodyFields(schemas, 'Cat');

    expect(fields).toEqual([
      { name: 'petType', deepLink: requestLink('path=pettype') },
      { name: 'name', deepLink: requestLink('path=&d=0/name') },
      { name: 'huntingSkill', deepLink: requestLink('path=&d=0/huntingskill') },
      { name: 'age', deepLink: requestLink('path=&d=1/age') },
      { name: 'teeth', deepLink: requestLink('path=&d=1&d=0/teeth') },
      { name: 'packSize', deepLink: requestLink('path=&d=1&d=1/packsize') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Cat')).toEqual([]);
  });

  it('walks an option whose own discriminator sits in an inline allOf part as a nested host', () => {
    const schemas = {
      Payment: {
        oneOf: [ref('Card'), ref('Bank')],
        discriminator: discriminator('kind', { card: 'Card', bank: 'Bank' }),
      },
      Common: { type: 'object', properties: { kind: { type: 'string' } } },
      Card: {
        allOf: [
          ref('Common'),
          {
            oneOf: [ref('Visa'), ref('Amex')],
            discriminator: discriminator('network', { visa: 'Visa', amex: 'Amex' }),
          },
        ],
      },
      Visa: {
        type: 'object',
        properties: { network: { type: 'string' }, cvv: { type: 'string' } },
      },
      Amex: {
        type: 'object',
        properties: { network: { type: 'string' }, cid: { type: 'string' } },
      },
      Bank: {
        type: 'object',
        properties: { kind: { type: 'string' }, iban: { type: 'string' } },
      },
    };
    const fields = indexBodyFields(schemas, 'Payment');

    expect(fields).toEqual([
      { name: 'kind', deepLink: requestLink('path=kind') },
      { name: 'network', deepLink: requestLink('path=&d=0/network') },
      { name: 'cvv', deepLink: requestLink('path=&d=0&d=0/cvv') },
      { name: 'cid', deepLink: requestLink('path=&d=0&d=1/cid') },
      { name: 'iban', deepLink: requestLink('path=&d=1/iban') },
    ]);
    expect(unrenderedFieldIds(fields, schemas, 'Payment')).toEqual([]);
  });

  it('does not walk an option that inherits the discriminator through an intermediate parent as a nested host', () => {
    const schemas = {
      Pet: {
        type: 'object',
        properties: { petType: { type: 'string' } },
        discriminator: discriminator('petType', { cat: 'Cat' }),
      },
      Feline: { allOf: [ref('Pet')] },
      Cat: {
        allOf: [
          ref('Feline'),
          {
            oneOf: [ref('Lion'), ref('Lynx')],
            discriminator: discriminator('breed', { lion: 'Lion', lynx: 'Lynx' }),
          },
        ],
      },
      Lion: { type: 'object', properties: { breed: { type: 'string' }, mane: { type: 'string' } } },
      Lynx: {
        type: 'object',
        properties: { breed: { type: 'string' }, tufts: { type: 'string' } },
      },
    };
    const deepLinks = indexBodyFields(schemas, 'Pet').map((field) => field.deepLink);

    expect(deepLinks.filter((link) => link.includes('&d=0&d='))).toEqual([]);
  });
});
