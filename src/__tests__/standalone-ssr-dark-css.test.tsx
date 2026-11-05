import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components';

import { RedoclyApiDocsStandalone } from '../RedoclyApiDocsStandalone.js';
import { prepareApiDocs } from '../RedocStandalone.js';

const definition = {
  openapi: '3.1.0',
  info: { title: 'SSR CSS Probe API', version: '1.0.0' },
  paths: {},
};

async function serverStyleTags(): Promise<string> {
  const prepared = await prepareApiDocs({ spec: definition, basePath: '/' });
  const sheet = new ServerStyleSheet();
  renderToString(
    sheet.collectStyles(
      createElement(
        MemoryRouter,
        null,
        createElement(RedoclyApiDocsStandalone, {
          items: prepared.items,
          store: prepared.store,
          basePath: '/',
          options: prepared.options,
          telemetryConfig: { disabled: true },
          spec: prepared.document,
        }),
      ),
    ),
  );
  return sheet.getStyleTags();
}

function splitSelectorList(list: string): string[] {
  const parts = [''];
  let depth = 0;
  for (const char of list) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) parts.push('');
    else parts[parts.length - 1] += char;
  }
  return parts.map((part) => part.trim());
}

function selectors(styleTags: string): string[] {
  const css = styleTags.replace(/<\/?style[^>]*>|\/\*!sc\*\//g, '');
  return [...css.matchAll(/(?:^|[{}])([^{}@]+)\{/g)]
    .flatMap(([, list]) => splitSelectorList(list))
    .filter((selector) => !/^(data-styled\.|from$|to$|[\d.]+%$)/.test(selector));
}

describe('server-rendered style tags', () => {
  it('declare the tokens on the page root and the dark tokens behind a dark Redoc root', async () => {
    const css = await serverStyleTags();

    expect(css).toContain(':where(:root){');
    expect(css).toContain(':where(:root:has(.redoc.dark)){');
  });

  it('scope every element rule to a Redoc root', async () => {
    const all = selectors(await serverStyleTags());
    const leaking = all.filter(
      (selector) =>
        !selector.startsWith('.') &&
        !selector.startsWith(':is(.redoc') &&
        !selector.startsWith(':where(.redoc') &&
        !selector.startsWith(':where(body >') &&
        !selector.startsWith(':where(:root:has(.redoc.dark) body >') &&
        !/^:where\(:root(:has\(\.redoc\.dark\))?\)$/.test(selector) &&
        !/^html(\.dark:not\(:has\(\.redoc\)\)|:has\(\.redoc\.dark\)) \./.test(selector),
    );

    expect(all).toContain(
      ":where(.redoc, body > :has(> [data-component-name='Dropdown/DropdownMenu'])) button",
    );
    expect(all).toContain(
      ":is(.redoc, :where(body > :has(> [data-component-name='Dropdown/DropdownMenu']))) *",
    );
    expect(leaking).toEqual([]);
  });

  it('put only custom properties on the page root', async () => {
    const css = (await serverStyleTags()).replace(/\/\*!sc\*\//g, '');
    const rootDeclarations = [
      ...css.matchAll(/:where\(:root(?::has\(\.redoc\.dark\))?\)\{([^}]*)\}/g),
    ]
      .flatMap(([, body]) => body.split(';'))
      .filter(Boolean);

    expect(rootDeclarations.length).toBeGreaterThan(100);
    expect(rootDeclarations.filter((declaration) => !declaration.startsWith('--'))).toEqual([]);
    expect(css).toContain('.redoc.dark,');
  });

  it('restore browser defaults that host CSS resets would otherwise change', async () => {
    const css = await serverStyleTags();

    expect(css).toMatch(
      /:where\(\.redoc\) :is\(ul, ?ol, ?menu, ?dd\)\{padding:revert;list-style:revert;\}/,
    );
    expect(css).toContain(":where(.redoc) svg[display='none']{display:none;}");
  });
});
