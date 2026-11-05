import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { load } from 'js-yaml';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import type { ApiItem } from '../types/store.js';

import { prepareApiDocs } from '../RedocStandalone.js';
import { RedoclyApiDocsStandalone } from '../RedoclyApiDocsStandalone.js';

// Sets each node of each fixture to `null`, then renders every route.
// Slow: run with API_DOCS_MALFORMED_FUZZ=1.
const FIXTURES = resolve(dirname(fileURLToPath(import.meta.url)), '__fixtures__/malformed');
const PAGE_ERROR = 'Something went wrong rendering the API documentation';

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function nodePaths(node: Json, prefix: string[] = [], acc: string[][] = []): string[][] {
  if (node === null || typeof node !== 'object') return acc;
  for (const [key, value] of Object.entries(node)) {
    const path = prefix.concat(key);
    acc.push(path);
    nodePaths(value, path, acc);
  }
  return acc;
}

function withNullAt(document: Json, path: string[]): Json {
  const copy = structuredClone(document);
  let parent: Json = copy;
  for (const key of path.slice(0, -1)) parent = (parent as Record<string, Json>)[key];
  (parent as Record<string, Json>)[path[path.length - 1]] = null;
  return copy;
}

function routes(items: ApiItem[], acc: string[] = ['/']): string[] {
  for (const item of items) {
    if (typeof item.link === 'string' && !acc.includes(item.link)) acc.push(item.link);
    const nested = (item as { items?: ApiItem[] }).items;
    if (Array.isArray(nested)) routes(nested, acc);
  }
  return acc;
}

/** The first route whose render took down the page, or undefined. */
async function pageCrashRoute(
  prepared: Awaited<ReturnType<typeof prepareApiDocs>>,
): Promise<string | undefined> {
  for (const route of routes(prepared.items)) {
    const uncaught: unknown[] = [];
    const container = document.createElement('div');
    // Contained crashes are expected here.
    const root = createRoot(container, {
      onUncaughtError: (error) => uncaught.push(error),
      onCaughtError: () => {},
      onRecoverableError: () => {},
    });
    await act(async () => {
      root.render(
        createElement(
          MemoryRouter,
          { initialEntries: [route] },
          createElement(RedoclyApiDocsStandalone, {
            items: prepared.items,
            store: prepared.store,
            basePath: '/',
            options: { ...prepared.options, schemasExpansionLevel: 8 },
            telemetryConfig: { disabled: true },
          }),
        ),
      );
    });
    const pageDown = uncaught.length > 0 || (container.textContent ?? '').includes(PAGE_ERROR);
    await act(async () => root.unmount());
    if (pageDown) return route;
  }
  return undefined;
}

describe.runIf(process.env.API_DOCS_MALFORMED_FUZZ)('a null anywhere in the description', () => {
  const originalObserver = globalThis.IntersectionObserver;
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    Element.prototype.scrollIntoView = () => {};
    // Mount every lazy section at once.
    globalThis.IntersectionObserver = class {
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element): void {
        this.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve(): void {}
      disconnect(): void {}
    } as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    globalThis.IntersectionObserver = originalObserver;
    Element.prototype.scrollIntoView = originalScrollIntoView;
    vi.restoreAllMocks();
  });

  it.each(['oas31', 'swagger2', 'asyncapi3', 'asyncapi2'])(
    '%s: never fails the whole page',
    { timeout: 1_800_000 },
    async (fixture) => {
      const base = load(readFileSync(`${FIXTURES}/${fixture}.yaml`, 'utf8')) as Json;
      const failures: string[] = [];

      for (const path of nodePaths(base)) {
        const spec = withNullAt(base, path) as Record<string, unknown>;
        let prepared: Awaited<ReturnType<typeof prepareApiDocs>>;
        try {
          prepared = await prepareApiDocs({ spec, basePath: '/', convertedDownload: false });
        } catch (error) {
          // Only a load error may reject: the build reports and skips what it cannot build.
          if ((error as Error).name !== 'DefinitionLoadError') {
            failures.push(`${path.join('.')}: build threw ${String(error)}`);
          }
          continue;
        }
        const route = await pageCrashRoute(prepared);
        if (route) failures.push(`${path.join('.')}: the page failed at ${route}`);
      }

      expect(failures).toEqual([]);
    },
  );
});
