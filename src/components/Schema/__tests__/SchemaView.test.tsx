import { describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { OpenAPISchema } from '../../../types/openapi.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { markdocParser } from '../../markdoc/markdocParser.js';
import { SchemaView } from '../SchemaView.js';
import type { Node } from '@redocly/markdoc';
import { useState, type ReactNode } from 'react';
import type { ApiDocsOptions } from '../../../types/options.js';

const emptyStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
} as GlobalStoreAtom['store'];

function renderSchemaView(
  schema: OpenAPISchema,
  schemasExpansionLevel?: number | 'all',
  markdownAdapter = createMarkdocAdapter(),
  rootJsonPointer?: string,
  sortRequiredPropsFirst?: boolean,
): (next: OpenAPISchema, nextRootJsonPointer?: string) => void {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    maxDisplayedEnumValues: 10,
    basePath: '',
    schemasExpansionLevel,
    sortRequiredPropsFirst,
    markdownParser: function (
      _: string,
      __?: Partial<Pick<ApiDocsOptions, 'sanitize'>>,
    ): Node | Node[] | undefined {
      throw new Error('Function not implemented.');
    },
  });
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: emptyStore,
    options,
  });

  const tree = (root: OpenAPISchema, pointer?: string) => (
    <MemoryRouter>
      <JotaiProvider store={jotaiStore}>
        <MarkdownAdapterProvider value={markdownAdapter}>
          <SchemaView schema={root} expandByDefault rootJsonPointer={pointer} />
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>
  );
  const { rerender } = render(tree(schema, rootJsonPointer));
  return (next, nextRootJsonPointer) => rerender(tree(next, nextRootJsonPointer));
}

describe('SchemaView default level', () => {
  it('renders the collapsible nesting chrome for a oneOf object variant without an explicit level', () => {
    // Sections that omit `level` (AsyncAPI messages, MCP tools, fields) must
    // render the same nesting chrome as sections passing `level={1}`.
    renderSchemaView({
      type: 'object',
      properties: {
        actor: {
          oneOf: [{ type: 'object', properties: { id: { type: 'string' } } }, { type: 'null' }],
        },
      },
    });

    expect(screen.getByText(/^show/i)).toBeInTheDocument();
  });
});

describe('SchemaView processed schema', () => {
  it('orders the properties of a schema object shared by two views by the option of each view', () => {
    const shared: OpenAPISchema = {
      type: 'object',
      required: ['alpha'],
      properties: { zeta: { type: 'string' }, alpha: { type: 'string' } },
    };
    const text = (): string => document.body.textContent ?? '';

    renderSchemaView(shared);
    expect(text().indexOf('zeta')).toBeLessThan(text().indexOf('alpha'));
    cleanup();

    renderSchemaView(shared, undefined, undefined, undefined, true);
    expect(text().indexOf('alpha')).toBeLessThan(text().indexOf('zeta'));
  });
});

describe('SchemaView single-element tuple arrays', () => {
  it('renders a single-element items-tuple array as a positional [0] entry', () => {
    renderSchemaView(
      {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: [
              {
                type: 'object',
                properties: {
                  object: { type: 'string', const: 'api_function' },
                  status: { type: 'integer' },
                },
              },
            ],
            additionalItems: false,
            minItems: 1,
            maxItems: 1,
          },
        },
      },
      'all',
    );

    expect(screen.getByText('[0]')).toBeInTheDocument();
  });
});

describe('SchemaView boolean schemas', () => {
  it.each([true, false])('renders nothing for a %s root schema', (schema) => {
    expect(() => renderSchemaView(schema as unknown as OpenAPISchema)).not.toThrow();
  });

  it('labels a false property as no value allowed', () => {
    renderSchemaView({
      type: 'object',
      properties: { never: false, anything: true },
    } as unknown as OpenAPISchema);

    expect(screen.getByText('no value allowed')).toBeInTheDocument();
    expect(screen.getByText('any')).toBeInTheDocument();
  });
});

describe('SchemaView array root', () => {
  it('opens the items of a root array with a lowercase array bracket', () => {
    renderSchemaView({
      type: 'array',
      items: { type: 'object', properties: { name: { type: 'string' } } },
    });

    expect(screen.getByText('array [')).toBeInTheDocument();
  });
});

describe('SchemaView root description', () => {
  const DESCRIPTION = 'root-schema-description';

  it.each<[string, OpenAPISchema]>([
    [
      'object',
      { type: 'object', description: DESCRIPTION, properties: { id: { type: 'string' } } },
    ],
    ['array', { type: 'array', description: DESCRIPTION, items: { type: 'string' } }],
    [
      'array of objects',
      {
        type: 'array',
        description: DESCRIPTION,
        items: { type: 'object', properties: { id: { type: 'string' } } },
      },
    ],
    ['primitive', { type: 'string', description: DESCRIPTION }],
    [
      'oneOf',
      {
        description: DESCRIPTION,
        oneOf: [
          { type: 'object', properties: { a: { type: 'string' } } },
          { type: 'object', properties: { b: { type: 'string' } } },
        ],
      },
    ],
    [
      'oneOf with properties',
      {
        description: DESCRIPTION,
        properties: { id: { type: 'string' } },
        oneOf: [
          { type: 'object', properties: { a: { type: 'string' } } },
          { type: 'object', properties: { b: { type: 'string' } } },
        ],
      },
    ],
  ])('renders the description of a(n) %s root exactly once', (_, schema) => {
    renderSchemaView(schema);

    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });

  it.each<[string, (description: unknown) => unknown]>([
    [
      'the root',
      (description) => ({ type: 'object', description, properties: { id: { type: 'string' } } }),
    ],
    [
      'an array item',
      (description) => ({
        type: 'array',
        items: { type: 'object', description, properties: { id: { type: 'string' } } },
      }),
    ],
    [
      'a field',
      (description) => ({ type: 'object', properties: { id: { type: 'string', description } } }),
    ],
  ])(
    'remounts a pre-parsed description of %s when the root schema switches',
    (_, withDescription) => {
      function City({ name }: { name: string }) {
        const [shown] = useState(name);
        return <i>{shown}</i>;
      }
      const adapter = createMarkdocAdapter({
        tags: {
          city: { render: 'City', selfClosing: true, attributes: { name: { type: String } } },
        },
        components: { City },
      });
      const withCity = (name: string) =>
        withDescription(markdocParser(`{% city name="${name}" /%}`)) as OpenAPISchema;

      const switchTo = renderSchemaView(withCity('Paris'), 'all', adapter, '#/a');
      switchTo(withCity('Sydney'), '#/b');

      expect(screen.getByText('Sydney')).toBeInTheDocument();
    },
  );

  it('renders a Markdoc description with the host tags', () => {
    const adapter = createMarkdocAdapter({
      tags: { note: { render: 'Note', children: ['paragraph'] } },
      components: { Note: ({ children }: { children: ReactNode }) => <aside>{children}</aside> },
    });
    renderSchemaView(
      {
        type: 'object',
        description: 'Plain **bold** text.\n\n{% note %}\nInside a tag.\n{% /note %}',
        properties: { id: { type: 'string' } },
      },
      undefined,
      adapter,
    );

    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('Inside a tag.').closest('aside')).toBeInTheDocument();
  });
});

describe('SchemaView array item description', () => {
  const ITEM = 'array-item-description';
  const object = { type: 'object', description: ITEM, properties: { id: { type: 'string' } } };

  it.each<[string, OpenAPISchema]>([
    ['an object item at the root', { type: 'array', description: 'list', items: object }],
    [
      'an object item of a nested array field',
      {
        type: 'object',
        properties: { list: { type: 'array', description: 'list', items: object } },
      },
    ],
    [
      'a primitive array item at the root',
      { type: 'array', items: { type: 'array', description: ITEM, items: { type: 'string' } } },
    ],
    [
      'an array item of objects at the root',
      {
        type: 'array',
        items: {
          type: 'array',
          description: ITEM,
          items: { type: 'object', properties: { id: { type: 'string' } } },
        },
      },
    ],
    ['a primitive item', { type: 'array', items: { type: 'string', description: ITEM } }],
    [
      'a tuple item',
      { type: 'array', prefixItems: [{ type: 'string', description: ITEM }, { type: 'integer' }] },
    ],
    [
      'a oneOf item',
      {
        type: 'array',
        items: {
          description: ITEM,
          oneOf: [
            { type: 'object', properties: { a: { type: 'string' } } },
            { type: 'object', properties: { b: { type: 'string' } } },
          ],
        },
      },
    ],
  ] as [string, OpenAPISchema][])('renders the description of %s exactly once', (_, schema) => {
    renderSchemaView(schema, 'all');

    expect(screen.getAllByText(ITEM)).toHaveLength(1);
  });
});

describe('SchemaView discriminator description', () => {
  const DESCRIPTION = 'discriminator-description';
  const pet = {
    type: 'object',
    description: DESCRIPTION,
    properties: { kind: { type: 'string' } },
    required: ['kind'],
    discriminator: { propertyName: 'kind' },
    oneOf: [
      {
        title: 'Cat',
        type: 'object',
        properties: { kind: { type: 'string', enum: ['cat'] }, meow: { type: 'boolean' } },
      },
      {
        title: 'Dog',
        type: 'object',
        properties: { kind: { type: 'string', enum: ['dog'] }, bark: { type: 'boolean' } },
      },
    ],
  };

  it.each<[string, OpenAPISchema]>([
    ['a discriminator root', pet as OpenAPISchema],
    ['a discriminator field', { type: 'object', properties: { pet } } as OpenAPISchema],
    ['a discriminator array item', { type: 'array', items: pet } as OpenAPISchema],
  ])('renders the description of %s exactly once', (_, schema) => {
    renderSchemaView(schema, 'all');

    expect(screen.getAllByText(DESCRIPTION)).toHaveLength(1);
  });
});

describe('SchemaView oneOf variant description', () => {
  const PARENT = 'oneof-parent-description';
  const VARIANT = 'oneof-variant-description';
  const object = (name: string) => ({ type: 'object', properties: { [name]: { type: 'string' } } });
  const payment = {
    description: PARENT,
    oneOf: [
      { title: 'Card', description: VARIANT, ...object('number') },
      { title: 'Transfer', ...object('iban') },
    ],
  };

  it.each<[string, OpenAPISchema]>([
    ['a root', payment],
    ['a field', { type: 'object', properties: { payment } }],
    [
      'a variant that is itself a oneOf',
      {
        description: PARENT,
        oneOf: [
          { title: 'Card', description: VARIANT, oneOf: [object('a'), object('b')] },
          { title: 'Transfer', ...object('iban') },
        ],
      },
    ],
  ])('shows the parent and the selected variant description once each on %s', (_, schema) => {
    renderSchemaView(schema, 'all');

    expect(screen.getAllByText(PARENT)).toHaveLength(1);
    expect(screen.getAllByText(VARIANT)).toHaveLength(1);
  });

  it('shows a variant description that repeats the parent once', () => {
    renderSchemaView({
      description: PARENT,
      oneOf: [{ title: 'Card', description: PARENT, ...object('number') }, object('iban')],
    });

    expect(screen.getAllByText(PARENT)).toHaveLength(1);
  });
});
