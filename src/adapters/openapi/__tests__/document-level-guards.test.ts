import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { prepareApiDocs } from '../../../RedocStandalone.js';
import { buildItems } from '../../build.js';

const okResponses = { '200': { description: 'ok' } };

const load = (spec: Record<string, unknown>) =>
  prepareApiDocs({ spec, basePath: '/', convertedDownload: false });

/** Every object in `value` with this `label`. */
function labelled(value: unknown, label: string): Array<Record<string, unknown>> {
  if (!value || typeof value !== 'object') return [];
  const own =
    (value as Record<string, unknown>).label === label ? [value as Record<string, unknown>] : [];
  return own.concat(Object.values(value).flatMap((child) => labelled(child, label)));
}

/** The nav items with this `label` (content nodes carry `label` too). */
function navItems(items: unknown, label: string): Array<Record<string, unknown>> {
  return labelled(items, label).filter((item) => 'content' in item);
}

describe('a wrong-typed value read while the document is indexed', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ignores an x-badges that is not an array and badge entries that are not objects', async () => {
    const { items, store } = await load({
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/a': { get: { summary: 'String badges', 'x-badges': 'beta', responses: okResponses } },
        '/b': {
          get: {
            summary: 'Null badge',
            'x-badges': [null, { name: 'New' }],
            responses: okResponses,
          },
        },
        '/c': { get: { summary: 'Fine', responses: okResponses } },
      },
    });

    expect(navItems(items, 'String badges').length).toBe(1);
    expect(navItems(items, 'Null badge')).toEqual([
      expect.objectContaining({ badges: [expect.objectContaining({ name: 'New' })] }),
    ]);
    expect(navItems(items, 'Fine').length).toBe(1);
    expect(store.buildErrors).toEqual([
      { id: 'invalidValue', name: 'TypeError', message: 'expected a list of badges, got string' },
      {
        id: 'invalidValue',
        name: 'TypeError',
        message: 'expected a list of badges, got a list with invalid entries',
      },
    ]);
  });

  it('keeps an invalid x-badges in the build errors when the same document is built again', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: { '/a': { get: { 'x-badges': { name: 'Beta' }, responses: okResponses } } },
    };
    const build = () => buildItems({ type: 'openapi', document, options: {}, basePath: '/' });

    const first = await build();
    const second = await build();

    expect(second.store.buildErrors).toEqual(first.store.buildErrors);
    expect(second.store.buildErrors).toEqual([
      { id: 'invalidValue', name: 'TypeError', message: 'expected a list of badges, got object' },
    ]);
  });

  it('skips a schema that is not an object and an x-tags that is not an array', async () => {
    const { items, store } = await load({
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Pets' }],
      paths: {
        '/a': { get: { tags: ['Pets'], summary: 'Fine', responses: okResponses } },
        '/b': { get: { summary: 'Untagged', responses: okResponses } },
      },
      components: {
        schemas: {
          Broken: null,
          StringTags: { type: 'object', title: 'String tags', 'x-tags': 'Pets' },
          Pet: { type: 'object', 'x-tags': ['Pets'] },
        },
      },
    });

    const pets = labelled(items, 'Pets')[0];
    expect(pets?.items).toEqual([
      expect.objectContaining({ label: 'Pet' }),
      expect.objectContaining({ label: 'Fine' }),
    ]);
    expect(navItems(items, 'Untagged').length).toBe(1);
    expect(store.buildErrors).toBeUndefined();
  });

  it('ignores operation parameters that are not an array and parameter entries that are not objects', async () => {
    const pathParam = { name: 'id', in: 'path', required: true, schema: { type: 'string' } };
    const { items, store } = await load({
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/a/{id}': {
          parameters: [pathParam, null],
          get: { summary: 'String parameters', parameters: 'id', responses: okResponses },
          put: {
            summary: 'Null parameter',
            parameters: [null, { name: 'q', in: 'query', schema: { type: 'string' } }],
            responses: okResponses,
          },
        },
        '/b': {
          parameters: 'id',
          get: {
            summary: 'With callback',
            responses: okResponses,
            callbacks: {
              onEvent: {
                '{$request.body#/url}': {
                  parameters: 'id',
                  post: { summary: 'Event', parameters: [null], responses: okResponses },
                },
              },
            },
          },
        },
        '/c': { get: { summary: 'Fine', responses: okResponses } },
      },
    });

    expect(navItems(items, 'String parameters').length).toBe(1);
    expect(navItems(items, 'Null parameter').length).toBe(1);
    expect(navItems(items, 'With callback').length).toBe(1);
    expect(navItems(items, 'Fine').length).toBe(1);
    expect(store.buildErrors).toBeUndefined();
  });

  it('skips an additional operation that is not an object', async () => {
    const { items, store } = await load({
      openapi: '3.2.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/a': {
          additionalOperations: {
            BROKEN: null,
            COPY: { summary: 'Copy', responses: okResponses },
          },
        },
        '/b': { get: { summary: 'Fine', responses: okResponses } },
      },
    });

    expect(navItems(items, 'Copy').length).toBe(1);
    expect(navItems(items, 'Fine').length).toBe(1);
    expect(store.buildErrors).toBeUndefined();
  });

  it('skips x-mcp entities that are not objects or have no string name', async () => {
    const { items, store } = await load({
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      'x-mcp': {
        protocolVersion: '2025-06-18',
        tools: [null, { title: 'No name' }, { name: 42 }, { name: 'getWeather', tags: 'Weather' }],
        resources: 'none',
        prompts: [{ name: 'summarize', tags: [null, 'Prompts'] }],
      },
      paths: { '/a': { get: { summary: 'Fine', responses: okResponses } } },
    });

    expect(navItems(items, 'Fine').length).toBe(1);
    expect(navItems(items, 'getWeather').length).toBe(1);
    expect(navItems(items, 'summarize').length).toBe(1);
    expect(navItems(items, 'No name')).toEqual([]);
    expect(store.buildErrors).toBeUndefined();
  });
});
