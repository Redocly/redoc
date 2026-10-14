import { useEffect, useState, type ReactElement } from 'react';
import { styled } from 'styled-components';
import * as yaml from 'js-yaml';
import { parse as parseGraphQL } from 'graphql';
import {
  buildItems,
  RedoclyApiDocsStandalone,
  markdocParser,
  loadAndBundleDefinition,
  type RawApiDocsOptions,
  type ApiSpecType,
  type ApiItem,
  type ApiStore,
} from './api.js';

import { defaultOptions } from './constants.js';

export type AppProps = {
  specUrl: string;
  basePath: string;
  type: ApiSpecType;
  options?: Partial<RawApiDocsOptions>;
  customCss?: string;
};

type Loaded = { items: ApiItem[]; store: ApiStore };

async function loadDefinition(specUrl: string, type: ApiSpecType): Promise<unknown> {
  if (type === 'graphql') {
    const res = await fetch(specUrl);
    if (!res.ok) {
      throw new Error(`Failed to load ${specUrl}: ${res.status}`);
    }
    return parseGraphQL(await res.text());
  }
  if (type === 'openapi') {
    return loadAndBundleDefinition(specUrl);
  }
  const res = await fetch(specUrl);
  if (!res.ok) {
    throw new Error(`Failed to load ${specUrl}: ${res.status}`);
  }
  return yaml.load(await res.text());
}

export default function App({
  specUrl,
  basePath,
  type,
  options,
  customCss,
}: AppProps): ReactElement {
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customCss || !data) return;
    const style = document.createElement('style');
    style.textContent = customCss;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [customCss, data]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const document = await loadDefinition(specUrl, type);
        const mergedOpts = { ...defaultOptions, ...options } as RawApiDocsOptions;
        const { items, store } = await buildItems({
          type,
          document,
          basePath,
          options: mergedOpts,
          markdownParser: markdocParser,
        } as Parameters<typeof buildItems>[0]);
        if (!cancelled) {
          setData({ items, store });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [specUrl, basePath, type, JSON.stringify(options ?? {})]);

  if (error) {
    return <LoadError>{error}</LoadError>;
  }
  if (!data) {
    return <Loading data-testid="loading">Loading…</Loading>;
  }

  const mergedOpts = { ...defaultOptions, ...options } as RawApiDocsOptions;

  return (
    <ReadyWrap className="ready">
      <RedoclyApiDocsStandalone
        items={data.items}
        store={data.store}
        basePath={basePath}
        options={mergedOpts}
        telemetryConfig={{ disabled: true }}
      />
    </ReadyWrap>
  );
}

const Loading = styled.div`
  padding: 1rem;
`;

const LoadError = styled.div`
  padding: 1rem;
  color: var(--text-color-error, #c00);
`;

const ReadyWrap = styled.div`
  min-height: 100vh;
`;
