import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import type { MarkdownAdapter, PreparedApiDocs } from 'redoc';

import {
  Redoc,
  RedocStandalone,
  ServerStyleSheet,
  convertSwagger2OpenAPI,
  prepareApiDocs,
} from 'redoc';

/** One `?case=` per contract the library promises a React embedder. */

const CAFE = '/specs/cafe/openapi.yaml';
const BASE = '/react';
const DEEP_BASE = '/react/docs';

window.__loaded = [];

const onLoaded = (error?: Error) =>
  window.__loaded?.push(error ? { ok: false, message: error.message } : { ok: true });

/**
 * `withRouter` passes no `basename`, so the overview route is exactly `/react` — no trailing
 * slash — while a static server 302s `/react` to `/react/`, which matches nothing. Rewriting the
 * address bar before mount fixes that. The result is not servable, so no spec reloads.
 */
function alignUrlWithBasePath(basePath: string): void {
  if (window.location.pathname === basePath) return;
  window.history.replaceState(null, '', `${basePath}${window.location.search}`);
}

/**
 * No adapter factory is exported and `useMarkdownAdapter()` throws on an empty context, so every
 * low-level consumer hand-rolls one. Descriptions arrive as Markdoc ASTs this cannot render.
 */
const NOOP_MARKDOWN_ADAPTER: MarkdownAdapter = {
  parse: (source) => source,
  render: () => null,
};

const INLINE_DEFINITION = {
  openapi: '3.1.0',
  info: { title: 'Inline definition object', version: '9.9.9' },
  paths: {
    '/ping': {
      get: {
        operationId: 'ping',
        summary: 'Ping from an inline object',
        responses: { 200: { description: 'Pong.' } },
      },
    },
  },
};

/** A Swagger 2 document converted through the exported helper, then rendered. */
function Swagger2() {
  const [definition, setDefinition] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    Promise.resolve(
      convertSwagger2OpenAPI({
        swagger: '2.0',
        info: { title: 'Converted from Swagger 2', version: '2.0.0' },
        paths: {
          '/legacy': {
            get: {
              operationId: 'legacy',
              summary: 'A Swagger 2 operation',
              responses: { 200: { description: 'OK.' } },
            },
          },
        },
      }),
    )
      .then(setDefinition)
      .catch((error: Error) => {
        window.__caseError = error.message;
      });
  }, []);
  if (!definition) return <p>Converting…</p>;
  return <RedocStandalone spec={definition} basePath={BASE} onLoaded={onLoaded} />;
}

/** SDL as a raw string rather than a URL. */
function GraphqlSdl() {
  const [sdl, setSdl] = useState<string | null>(null);
  useEffect(() => {
    fetch('/specs/cafe.graphql')
      .then((response) => response.text())
      .then(setSdl)
      .catch((error: Error) => {
        window.__caseError = error.message;
      });
  }, []);
  if (!sdl) return <p>Fetching SDL…</p>;
  return <RedocStandalone spec={sdl} basePath={BASE} onLoaded={onLoaded} />;
}

function LowLevel() {
  const [prepared, setPrepared] = useState<PreparedApiDocs | null>(null);
  useEffect(() => {
    prepareApiDocs({ specUrl: CAFE, basePath: BASE })
      .then((result) => {
        setPrepared(result);
        onLoaded();
      })
      .catch((error: Error) => onLoaded(error));
  }, []);
  if (!prepared) return <p>Preparing…</p>;
  return (
    <Redoc
      items={prepared.items}
      store={prepared.store}
      options={prepared.options}
      basePath={BASE}
      markdownAdapter={NOOP_MARKDOWN_ADAPTER}
    />
  );
}

/**
 * A fresh sheet's `getStyleTags()` is an empty string, so only collecting around a real render
 * proves the re-export is wired to the same styled-components instance the components use.
 */
function StyleSheet() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    prepareApiDocs({ specUrl: CAFE, basePath: BASE })
      .then((prepared) => {
        const sheet = new ServerStyleSheet();
        try {
          renderToString(
            sheet.collectStyles(
              <Redoc
                items={prepared.items}
                store={prepared.store}
                options={prepared.options}
                basePath={BASE}
                markdownAdapter={NOOP_MARKDOWN_ADAPTER}
              />,
            ),
          );
          window.__styleTags = sheet.getStyleTags();
        } finally {
          sheet.seal();
        }
        setReady(true);
      })
      .catch((error: Error) => {
        window.__caseError = error.message;
      });
  }, []);
  if (!ready) return <p>Collecting styles…</p>;
  return <p data-testid="style-sheet-ready">ServerStyleSheet collected styles</p>;
}

const CASES: Record<string, () => React.ReactElement> = {
  'definition-url': () => <RedocStandalone specUrl={CAFE} basePath={BASE} onLoaded={onLoaded} />,

  'graphql-sdl': () => <GraphqlSdl />,
  'definition-object': () => (
    <RedocStandalone spec={INLINE_DEFINITION} basePath={BASE} onLoaded={onLoaded} />
  ),
  swagger2: () => <Swagger2 />,

  children: () => (
    <RedocStandalone specUrl={CAFE} basePath={BASE} onLoaded={onLoaded}>
      <p data-testid="loading-placeholder">Loading the definition…</p>
    </RedocStandalone>
  ),

  error: () => (
    <RedocStandalone specUrl="/fixtures/broken.yaml" basePath={BASE} onLoaded={onLoaded} />
  ),

  /** A basePath deeper than where the app is served. */
  'base-path': () => <RedocStandalone specUrl={CAFE} basePath={DEEP_BASE} onLoaded={onLoaded} />,

  'low-level': () => <LowLevel />,
  'style-sheet': () => <StyleSheet />,
};

const CASE_BASE_PATHS: Record<string, string> = { 'base-path': DEEP_BASE };

const name = new URLSearchParams(window.location.search).get('case') ?? 'definition-url';

alignUrlWithBasePath(CASE_BASE_PATHS[name] ?? BASE);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Missing #root in react-host/index.html');
}

createRoot(container).render(CASES[name]());
