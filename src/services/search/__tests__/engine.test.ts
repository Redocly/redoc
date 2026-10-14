import { describe, expect, it } from 'vitest';

import type { SearchDocument } from '../types.js';

import { SearchEngine } from '../engine/index.js';
import {
  HIGHLIGHTED_TEXT_MAX_LENGTH,
  SEARCH_LIMIT,
  SHARED_FIELD_COPIES,
} from '../engine/constants.js';

function makeDocument(overrides: Partial<SearchDocument> & { id: string }): SearchDocument {
  return {
    url: `/docs/${overrides.id}`,
    title: 'Untitled',
    text: '',
    ...overrides,
  };
}

describe('SearchEngine', () => {
  it('returns one result per message when matching fields live in different messages', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'liveboard',
        title: 'Live order board',
        parameters: [
          {
            name: 'status',
            description: 'Status shown on the pickup board.',
            place: 'message payload',
            path: ['orders'],
            type: 'string',
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink:
              '/docs/liveboard#liveboard/messages&m=boardsnapshot&t=payload&path=orders[]/status',
          },
          {
            name: 'status',
            description: 'Status shown on the pickup board.',
            place: 'message payload',
            path: [],
            type: 'string',
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink: '/docs/liveboard#liveboard/messages&m=orderupdate&t=payload&path=status',
          },
        ],
      }),
    );

    const results = await engine.search('status');

    // Two messages carry a matching field — the reader must see both variants.
    expect(results).toHaveLength(2);
    expect(results[0].document.url).toContain('m=orderupdate');
    expect(results[1].document.url).toContain('m=boardsnapshot');
    expect(results[1].highlight.parameters?.[0].path).toEqual(['orders']);
  });

  it('prefers the shallowest parameter when several match a query equally', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'liveboard',
        title: 'Live order board',
        parameters: [
          {
            name: 'status',
            description: 'Status shown on the pickup board.',
            place: 'message payload',
            path: ['orders'],
            type: 'string',
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink: '/x#x/messages&m=boardsnapshot&t=payload&path=orders[]/status',
          },
          {
            name: 'status',
            description: 'Status shown on the pickup board.',
            place: 'message payload',
            path: [],
            type: 'string',
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink: '/x#x/messages&m=orderupdate&t=payload&path=status',
          },
        ],
      }),
    );

    const [result] = await engine.search('status');

    expect(result.document.url).toContain('m=orderupdate');
  });

  it('prefers the parameter holding the query in word order when every word matches twice', async () => {
    const engine = new SearchEngine();
    const message = (key: string, description: string) => ({
      name: key,
      description,
      place: 'message',
      path: [],
      type: 'object',
      required: false,
      mediaType: undefined,
      example: undefined,
      enum: undefined,
      deepLink: `/x#x/messages&m=${key}`,
    });
    engine.addDocument(
      makeDocument({
        id: 'ratings',
        title: 'User Ratings Topic',
        parameters: [
          message(
            'driverrating',
            'Post-ride feedback from passenger about driver performance. Passenger has submitted a rating for their driver',
          ),
          message(
            'passengerrating',
            'Post-ride feedback from driver about passenger behavior. Driver has submitted a rating for their passenger',
          ),
        ],
      }),
    );

    const [result] = await engine.search('Driver has submitted a rating for their passenger');

    expect(result.document.url).toContain('m=passengerrating');
  });

  it('keeps operations ahead of extra schema pages when scores tie', async () => {
    const engine = new SearchEngine();
    const sharedParam = (place: string, path: string[] = []) => ({
      name: 'calories',
      description: 'Amount of calories.',
      place,
      path,
      type: 'number',
      required: false,
      mediaType: undefined,
      example: undefined,
      enum: undefined,
      deepLink: `/x#x/path=${[...path, 'calories'].join('/')}`,
    });
    for (const [id, path] of [
      ['Dessert', []],
      ['OrderItem', ['menuItem']],
      ['MenuItem', []],
      ['MenuItemList', ['items']],
    ] as Array<[string, string[]]>) {
      engine.addDocument(
        makeDocument({
          id,
          title: id,
          isSchemaDefinition: true,
          parameters: [sharedParam('schema fields', path)],
        }),
      );
    }
    engine.addDocument(
      makeDocument({
        id: 'list-menu',
        title: 'List all menu items',
        httpMethod: 'get',
        httpPath: '/menu',
        parameters: [sharedParam('response 200 fields', ['items'])],
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'create-menu',
        title: 'Create menu item',
        httpMethod: 'post',
        httpPath: '/menu',
        parameters: [sharedParam('request fields')],
      }),
    );

    const ids = (await engine.search('calories')).map((result) => result.document.id);

    // The canonical schema page stays; the kept copies answer "which operations
    // have this field", so operations must survive ahead of extra schema pages.
    expect(ids).toContain('list-menu');
    expect(ids).toContain('create-menu');
  });

  it('finds documents by title and highlights the match', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'list-pets', title: 'List pets' }));
    engine.addDocument(makeDocument({ id: 'create-order', title: 'Create order' }));

    const results = await engine.search('pets');

    expect(results).toHaveLength(1);
    expect(results[0].document.id).toBe('list-pets');
    expect(results[0].highlight.title).toContain('<mark>');
  });

  it('finds documents by text content', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({ id: 'health', title: 'Health', text: 'Returns the service status' }),
    );

    const results = await engine.search('status');

    expect(results).toHaveLength(1);
    expect(results[0].highlight.text).toContain('<mark>');
  });

  it('returns an empty array when nothing matches', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'list-pets', title: 'List pets' }));

    expect(await engine.search('nonexistentterm')).toEqual([]);
  });

  it('matches parameter names, resolves the deep link into the url, and highlights the parameter', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'create-order',
        url: '/docs/orders',
        title: 'Create order',
        text: 'Creates a new order',
        parameters: [
          {
            name: 'customerId',
            description: 'Unique customer identifier',
            place: 'query parameters',
            path: [],
            deepLink: '/orders#orders/t=request&in=query&path=customerid',
          },
        ],
      }),
    );

    const results = await engine.search('customerId');

    expect(results).toHaveLength(1);
    expect(results[0].document.url).toBe('/docs/orders#orders/t=request&in=query&path=customerid');
    expect(results[0].highlight.parameters?.[0].name).toContain('<mark>');
  });

  it('does not resolve deep links when the title also matches the query', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'customer',
        url: '/docs/customer',
        title: 'customerId lookup',
        parameters: [
          {
            name: 'customerId',
            description: '',
            place: 'query parameters',
            path: [],
            deepLink: '/customer#customer/t=request&in=query&path=customerid',
          },
        ],
      }),
    );

    const results = await engine.search('customerId');

    expect(results).toHaveLength(1);
    expect(results[0].document.url).toBe('/docs/customer');
  });

  it('caps the number of results at SEARCH_LIMIT', async () => {
    const engine = new SearchEngine();
    for (let i = 0; i < SEARCH_LIMIT + 20; i++) {
      engine.addDocument(makeDocument({ id: `doc-${i}`, title: `Pets page ${i}` }));
    }

    expect((await engine.search('pets')).length).toBeLessThanOrEqual(SEARCH_LIMIT);
  });

  it('ranks an exact title above a longer title that starts with the query', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'build', title: 'Create project build' }));
    engine.addDocument(makeDocument({ id: 'logs', title: 'Create project build logs' }));
    engine.addDocument(makeDocument({ id: 'project', title: 'Create project' }));

    const results = await engine.search('create project');

    expect(results.map((result) => result.document.id)).toEqual(['project', 'build', 'logs']);
  });

  it('prefers a parameter matched by name over one matched by its description', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'mentions',
        title: 'List orders',
        parameters: [
          {
            name: 'limit',
            description: 'Ignored when eventId is set',
            place: 'query parameters',
            path: [],
            deepLink: '/orders#orders/t=request&in=query&path=limit',
          },
        ],
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'owns',
        url: '/docs/events',
        title: 'Get event',
        parameters: [
          {
            name: 'other',
            description: 'Unrelated eventId note',
            place: 'query parameters',
            path: [],
            deepLink: '/events#events/t=request&in=query&path=other',
          },
          {
            name: 'eventId',
            description: 'Identifier for a special event',
            place: 'path parameters',
            path: [],
            deepLink: '/events#events/t=request&in=path&path=eventid',
          },
        ],
      }),
    );

    const results = await engine.search('eventId');

    expect(results[0].document.id).toBe('owns');
    expect(results[0].document.url).toBe('/docs/events#events/t=request&in=path&path=eventid');
    expect(results[0].highlight.parameters?.[0].name).toContain('<mark>');
  });

  it('hides documents that only match after the index folds repeated letters', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'source', title: 'Create source code repository' }));
    engine.addDocument(makeDocument({ id: 'sso', title: 'SSO settings' }));

    const results = await engine.search('sso');

    expect(results.map((result) => result.document.id)).toEqual(['sso']);
  });

  it('falls back to folded matches when nothing contains the query', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'source', title: 'Create source code repository' }));

    const results = await engine.search('sso');

    expect(results.map((result) => result.document.id)).toEqual(['source']);
    expect(results[0].highlight).toEqual({});
  });

  it('ranks a heading sub-result above prose but below a parameter-name match', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'prose',
        title: 'List orders',
        text: 'Mentions throttling in passing prose only.',
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'section',
        url: '/docs/payments',
        title: 'Create payment',
        parameters: [
          {
            name: 'Throttling',
            description: 'Requests are limited per minute.',
            place: 'description',
            path: [],
            deepLink: '/payments#payments/section/throttling',
          },
        ],
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'param',
        title: 'Get limits',
        parameters: [
          {
            name: 'throttling',
            description: 'Throttling mode',
            place: 'query parameters',
            path: [],
            deepLink: '/limits#limits/t=request&in=query&path=throttling',
          },
        ],
      }),
    );

    const results = await engine.search('throttling');

    expect(results.map((result) => result.document.id)).toEqual(['param', 'section', 'prose']);
    // The section hit deep-links to the heading anchor.
    expect(results[1].document.url).toBe('/docs/payments#payments/section/throttling');
  });

  it('trims long highlighted text around the match', async () => {
    const engine = new SearchEngine();
    const text = `${'lorem ipsum dolor '.repeat(15)}wombat${' sit amet consectetur'.repeat(15)}`;
    engine.addDocument(makeDocument({ id: 'long', title: 'Long page', text }));

    const results = await engine.search('wombat');

    expect(results).toHaveLength(1);
    const highlighted = results[0].highlight.text;
    expect(highlighted).toContain('<mark>');
    expect(highlighted).toContain('...');
    expect(highlighted.length).toBeLessThan(text.length);
  });

  it('deep-links to the field when a phrase only brushes the title', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'menu',
        url: '/docs/menu',
        title: 'List all menu items',
        text: 'Retrieve a collection of menu items.',
        parameters: [
          {
            name: 'filter',
            description: 'Filters the collection items using space-separated field:value pairs.',
            place: 'query parameters',
            path: [],
            deepLink: '/menu#menu/t=request&in=query&path=filter',
          },
        ],
      }),
    );

    const results = await engine.search('Filters the collection items using space-separated');

    expect(results).toHaveLength(1);
    expect(results[0].document.url).toBe('/docs/menu#menu/t=request&in=query&path=filter');
    expect(results[0].highlight.parameters?.[0].name).toBe('filter');
  });

  it('prefers the field whose description is the whole query over a partial prose match', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'menu',
        url: '/docs/menu',
        title: 'List all menu items',
        parameters: [
          {
            name: 'before',
            description: 'Use the startCursor as a value for the before parameter to get a page.',
            place: 'query parameters',
            path: [],
            deepLink: '/menu#menu/t=request&in=query&path=before',
          },
          {
            name: 'startCursor',
            description: 'Use with the before query parameter to load the previous page of data.',
            place: 'response 200 fields',
            path: ['page'],
            deepLink: '/menu#menu/t=response&code=200&path=page.startcursor',
          },
        ],
      }),
    );

    const results = await engine.search('Use with the before query parameter to');

    expect(results[0].highlight.parameters?.[0].name).toBe('startCursor');
    expect(results[0].document.url).toBe(
      '/docs/menu#menu/t=response&code=200&path=page.startcursor',
    );
  });

  it('deep-links to a heading whose title is the whole query even though the prose holds it too', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'placeorder',
        title: 'Place an order',
        text: 'Creates an order from the cart. Idempotency keys Repeat a request safely with the same key.',
        parameters: [
          {
            name: 'Idempotency keys',
            description: 'Repeat a request safely with the same key.',
            place: 'description',
            path: [],
            type: undefined,
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink: '/docs/placeorder#placeorder/request/idempotency-keys',
          },
        ],
      }),
    );

    const [result] = await engine.search('Idempotency keys');

    expect(result.document.url).toContain('#placeorder/request/idempotency-keys');
  });

  it('keeps the reader on the page when its prose covers the query and only an example label matches too', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'telemetry',
        title: 'Machine telemetry',
        text: 'Periodic measurements, published every 30 seconds while brewing is idle and every 5 seconds during extraction.',
        parameters: [
          {
            name: 'Reading taken mid-extraction',
            description: '',
            place: 'message examples',
            path: [],
            deepLink: '/channels/telemetry#channels/telemetry/messages&m=telemetry',
          },
        ],
      }),
    );

    const [byProse] = await engine.search('extraction');
    expect(byProse.document.url).toBe('/docs/telemetry');

    const [byLabel] = await engine.search('Reading taken mid-extraction');
    expect(byLabel.document.url).toBe('/docs/telemetry#channels/telemetry/messages&m=telemetry');
  });

  it('keeps the reader on the item when the query is the item description itself', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'cleanup',
        url: '/docs/cleanup',
        title: 'Delete all data and reseed',
        text: 'Reset the cafe database to a clean state and reseed the menu.',
        parameters: [
          {
            name: '204',
            description: 'Cafe cleaned up and reseeded successfully.',
            place: 'response 204',
            path: [],
            deepLink: '/cleanup#cleanup/response&c=204',
          },
        ],
      }),
    );

    const results = await engine.search('Reset the cafe database to a clean state and reseed');

    expect(results[0].document.url).toBe('/docs/cleanup');
  });

  it('marks the whole word a query word is a prefix of', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({ id: 'doc', title: 'Delete an order', text: 'Skip it if they need it.' }),
    );

    const results = await engine.search('the');

    expect(results[0].highlight.text).toBe('Skip it if <mark>they</mark> need it.');
  });

  it('does not re-mark its own tags when the query repeats a word', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'doc',
        title: 'Create order',
        text: 'Order items cannot be changed - if they need it, cancel the order.',
      }),
    );

    const highlighted = (await engine.search('the items the order'))[0].highlight.text ?? '';

    expect(highlighted).toContain(' <mark>they</mark>');
    expect(highlighted.replaceAll('<mark>', '').replaceAll('</mark>', '')).not.toContain('<');
  });

  it('marks adjacent query words as one run and every other occurrence on its own', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'doc',
        title: 'Orders',
        text: 'Order status is set when the order is paid.',
      }),
    );

    const highlighted = (await engine.search('order status'))[0].highlight.text ?? '';

    expect(highlighted).toBe(
      '<mark>Order status</mark> is set when the <mark>order</mark> is paid.',
    );
  });

  it('shows the whole description when the phrase and its context fit the window', async () => {
    const engine = new SearchEngine();
    const text =
      'Demo API for cafe operators (not customers) to manage menus, orders, and revenue. ' +
      'Create API credentials and try it yourself in a realistic OpenAPI workflow.';
    engine.addDocument(makeDocument({ id: 'cafe', title: 'Redocly Cafe', text }));

    const highlighted =
      (await engine.search('Create API credentials and try'))[0].highlight.text ?? '';

    expect(highlighted).toBe(
      'Demo <mark>API</mark> for cafe operators (not customers) to manage menus, orders, ' +
        '<mark>and</mark> revenue. <mark>Create API credentials and try</mark> it yourself in a ' +
        'realistic Open<mark>API</mark> workflow.',
    );
  });

  it('anchors the snippet on the phrase rather than on the first query word', async () => {
    const engine = new SearchEngine();
    const text = `The API returns menus. ${'Operators manage stock levels. '.repeat(12)}Create API credentials and try it yourself in a realistic OpenAPI workflow.`;
    engine.addDocument(makeDocument({ id: 'cafe', title: 'Redocly Cafe', text }));

    const highlighted =
      (await engine.search('Create API credentials and try'))[0].highlight.text ?? '';

    expect(highlighted).toContain('<mark>Create API credentials and try</mark> it yourself');
    expect(highlighted.startsWith('...')).toBe(true);
    expect(highlighted).not.toContain('The API');
  });

  it('shifts the window instead of shrinking it when the match sits at the start', async () => {
    const engine = new SearchEngine();
    const text = `Wombat ${'sit amet consectetur '.repeat(20)}`.trim();
    engine.addDocument(makeDocument({ id: 'long', title: 'Long page', text }));

    const highlighted = (await engine.search('wombat'))[0].highlight.text ?? '';

    expect(highlighted.startsWith('<mark>Wombat</mark> sit')).toBe(true);
    expect(highlighted.endsWith('...')).toBe(true);
    const shown = highlighted.replaceAll('<mark>', '').replaceAll('</mark>', '').slice(0, -3);
    expect(shown.length).toBeGreaterThanOrEqual(HIGHLIGHTED_TEXT_MAX_LENGTH - 'consectetur'.length);
  });

  it('collapses a shared field into the schema page that defines it', async () => {
    const engine = new SearchEngine();
    const field = (path: string[], place: string, deepLink: string) => ({
      name: 'instance',
      description: 'URI reference that identifies the specific occurrence of the problem.',
      place,
      path,
      deepLink,
    });

    engine.addDocument(
      makeDocument({
        id: 'error',
        url: '/docs/schemas/error',
        title: 'Error',
        isSchemaDefinition: true,
        parameters: [field([], 'schema fields', '/error#schemas/error/path=instance')],
      }),
    );
    for (const op of ['listorders', 'createorder', 'deleteorder']) {
      engine.addDocument(
        makeDocument({
          id: op,
          url: `/docs/orders/${op}`,
          title: `Operation ${op}`,
          parameters: [
            field([], 'response 400 fields', `/${op}#orders/${op}/t=response&c=400&path=instance`),
          ],
        }),
      );
    }

    const results = await engine.search('URI reference that identifies the specific occurrence');

    // The schema page leads; a bounded number of the operations referencing it follow.
    expect(results[0].document.url).toBe('/docs/schemas/error#schemas/error/path=instance');
    expect(results).toHaveLength(1 + SHARED_FIELD_COPIES);
  });

  it('keeps every reference when the group is smaller than the cap', async () => {
    const engine = new SearchEngine();
    const field = (place: string, deepLink: string) => ({
      name: 'quantity',
      description: 'Quantity of the menu item.',
      place,
      path: [],
      deepLink,
    });

    engine.addDocument(
      makeDocument({
        id: 'orderitem',
        url: '/docs/schemas/orderitem',
        title: 'OrderItem',
        isSchemaDefinition: true,
        parameters: [field('schema fields', '/x#schemas/orderitem/path=quantity')],
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'createorder',
        url: '/docs/orders/createorder',
        title: 'Create order',
        parameters: [field('request fields', '/x#orders/createorder/t=request&path=quantity')],
      }),
    );

    const results = await engine.search('Quantity of the menu item.');

    expect(results).toHaveLength(2);
    expect(results.map((result) => result.document.url.split('#')[0])).toContain(
      '/docs/orders/createorder',
    );
  });

  it('keeps every copy of a shared field with no schema page to collapse into', async () => {
    const engine = new SearchEngine();
    for (const op of ['listorders', 'listmenuitems']) {
      engine.addDocument(
        makeDocument({
          id: op,
          url: `/docs/${op}`,
          title: `Operation ${op}`,
          parameters: [
            {
              name: 'filter',
              description: 'Filters the collection items using space-separated pairs.',
              place: 'query parameters',
              path: [],
              deepLink: `/${op}#${op}/t=request&in=query&path=filter`,
            },
          ],
        }),
      );
    }

    const results = await engine.search('Filters the collection items using space-separated');

    expect(results).toHaveLength(2);
  });

  it('does not collapse a page that matched on its own title or prose', async () => {
    const engine = new SearchEngine();
    const shared = {
      name: 'instance',
      description: 'Identifies the specific occurrence of the problem.',
      place: 'response 400 fields',
      path: [],
      deepLink: '/x#x/t=response&c=400&path=instance',
    };
    engine.addDocument(
      makeDocument({
        id: 'error',
        url: '/docs/schemas/error',
        title: 'Error',
        isSchemaDefinition: true,
        parameters: [shared],
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'op',
        url: '/docs/op',
        title: 'Identifies the specific occurrence of the problem.',
        parameters: [shared],
      }),
    );

    const results = await engine.search('Identifies the specific occurrence of the problem.');

    expect(results.map((result) => result.document.url)).toContain('/docs/op');
  });

  it('never leaves a half-cut mark tag when trimming', async () => {
    // The second match slides across the trim boundary, which used to cut a `<mark>` in half.
    for (let pad = 0; pad < 60; pad++) {
      const engine = new SearchEngine();
      const text = `wombat ${'x '.repeat(pad)}numbat${' sit amet consectetur'.repeat(15)}`;
      engine.addDocument(makeDocument({ id: 'long', title: 'Long page', text }));

      const highlighted = (await engine.search('wombat numbat'))[0].highlight.text ?? '';
      const stripped = highlighted.replaceAll('<mark>', '').replaceAll('</mark>', '');
      expect(stripped).not.toContain('<');
      expect(stripped).not.toContain('mark>');
    }
  });

  it('finds a query hidden inside a word the index cannot reach', async () => {
    // FlexSearch tokenizes forward, so `hook` never returns `Webhook` as a candidate;
    // the engine falls back to scanning every document.
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'order-notification',
        title: 'Order notification webhook',
        text: 'Notifies the merchant about order status changes.',
      }),
    );
    engine.addDocument(makeDocument({ id: 'health', title: 'Get health status' }));

    const results = await engine.search('hook');

    expect(results.map((result) => result.document.id)).toEqual(['order-notification']);
    expect(results[0].highlight.title).toBe('Order notification web<mark>hook</mark>');
  });

  it('lists every operation with the queried HTTP method', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'create-order',
        title: 'Create order',
        httpMethod: 'post',
        httpPath: '/orders',
        text: 'Names can contain hyphens and apostrophes.',
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'register-client',
        title: 'Create OAuth2 client',
        httpMethod: 'post',
        httpPath: '/oauth2/register',
      }),
    );
    engine.addDocument(
      makeDocument({
        id: 'get-health',
        title: 'Get health status',
        httpMethod: 'get',
        httpPath: '/health',
      }),
    );

    const results = await engine.search('POST');
    const ids = results.map((result) => result.document.id);

    // The page whose prose also contains `post` (apostrophes) leads; GET pages stay out.
    expect(ids).toEqual(['create-order', 'register-client']);
    expect(results[0].highlight.text).toContain('a<mark>post</mark>rophes');
  });

  it('marks a word after punctuation and keeps punctuation out of the mark', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'comment',
        title: 'Create order',
        parameters: [
          {
            name: 'comment',
            description: 'Optional comment for the order item (e.g., "No sugar").',
            place: 'request fields',
            path: ['orderItems'],
            type: 'string',
            required: false,
            mediaType: undefined,
            example: undefined,
            enum: undefined,
            deepLink: '/docs/comment#request&path=orderitems[]/comment',
          },
        ],
      }),
    );

    const description =
      (await engine.search('No sugar'))[0].highlight.parameters?.[0].description ?? '';

    expect(description).toBe(
      'Optional comment for the order item (e.g., "<mark>No sugar</mark>").',
    );
  });

  it('marks only the found part of a mid-word match', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'names',
        title: 'Create order',
        text: 'Names can contain hyphens and apostrophes.',
      }),
    );

    const highlighted = (await engine.search('post'))[0].highlight.text ?? '';

    expect(highlighted).toBe('Names can contain hyphens and a<mark>post</mark>rophes.');
  });

  it('ignores one-letter query words entirely', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({ id: 'health', title: 'Get health status', text: 'Check the health of it.' }),
    );

    expect(await engine.search('t')).toEqual([]);
  });

  it('does not let a one-letter word prefix-match an HTTP method', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({ id: 'post-op', title: 'First', httpMethod: 'post', httpPath: '/zeta' }),
    );
    engine.addDocument(
      makeDocument({
        id: 'get-op',
        title: 'Second',
        httpMethod: 'get',
        httpPath: '/zeta',
        text: 'p',
      }),
    );

    const results = await engine.search('zeta p');

    // A `p` POST bonus (50) would outweigh the standalone-word text hit (10).
    expect(results[0].document.id).toBe('get-op');
  });

  it('keeps a short word significant inside a multi-word query', async () => {
    const engine = new SearchEngine();
    engine.addDocument(makeDocument({ id: 'doc-1', title: 'Doc 1', text: 'First document.' }));
    engine.addDocument(
      makeDocument({ id: 'documentation', title: 'Documentation', text: 'General docs.' }),
    );

    const results = await engine.search('Doc 1');

    expect(results[0].document.id).toBe('doc-1');
    expect(results[0].highlight.title).toBe('<mark>Doc 1</mark>');
  });

  it('shows no results when a document holds only part of the query words', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'documentation',
        title: 'Documentation',
        text: 'General documentation with lots of content.',
      }),
    );

    expect(await engine.search('Doc 1')).toEqual([]);
    expect(await engine.search('hidden content')).toEqual([]);
  });

  it('matches a two-letter word only at word starts', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'create-order',
        title: 'Create order',
        text: 'Order items cannot be changed once placed.',
      }),
    );
    engine.addDocument(
      makeDocument({ id: 'notes', title: 'Order notes', text: 'No smoking area nearby.' }),
    );

    const results = await engine.search('no');

    expect(results.map((result) => result.document.id)).toEqual(['notes']);
    expect(results[0].highlight.text).toBe('<mark>No</mark> smoking area nearby.');
  });

  it('surfaces a matched enum value that the row would otherwise not show', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'alerts',
        title: 'Machine alerts',
        text: 'Emergency conditions that require staff attention.',
        parameters: [
          {
            name: 'code',
            description: 'Machine-readable alert code.',
            place: 'message payload',
            path: [],
            type: 'string',
            required: true,
            mediaType: undefined,
            example: undefined,
            enum: ['DESCALE_REQUIRED', 'OVER_PRESSURE'],
            deepLink: '/docs/alerts#alerts/messages&m=alert&t=payload&path=code',
          },
        ],
      }),
    );

    const [result] = await engine.search('required');
    expect(result.highlight.parameters?.[0].enum).toBe(
      'DESCALE_<mark>REQUIRED</mark>, OVER_PRESSURE',
    );

    // A query the enum does not contain must not attach the enum line.
    const [byName] = await engine.search('alert code');
    expect(byName.highlight.parameters?.[0].enum).toBeUndefined();
  });

  it('surfaces a matched example value that the row would otherwise not show', async () => {
    const engine = new SearchEngine();
    engine.addDocument(
      makeDocument({
        id: 'order',
        title: 'Create order',
        parameters: [
          {
            name: 'customerName',
            description: 'Name of the customer.',
            place: 'request fields',
            path: [],
            type: 'string',
            required: true,
            mediaType: undefined,
            example: 'Mary-Jane',
            enum: undefined,
            deepLink: '/docs/order#request&path=customername',
          },
        ],
      }),
    );

    const [result] = await engine.search('mary');

    expect(result.highlight.parameters?.[0].example).toBe('<mark>Mary-Jane</mark>');
  });
});
