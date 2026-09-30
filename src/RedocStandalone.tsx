import { useContext, useEffect, useMemo, useState } from 'react';

import type { ReactElement, ReactNode } from 'react';
import type { ApiItem, ApiStore } from './types/store.js';
import type { ApiSpecType } from './types/common.js';
import type { RawApiDocsOptions } from './types/options.js';
import type { MarkdownAdapter } from './contexts/markdownAdapter.js';
import type { RedoclyApiDocsStandaloneProps } from './RedoclyApiDocsStandalone.js';
import type { BuildTimings } from './telemetry/index.js';

import { Loading } from '@redocly/theme/components/Loaders/Loading';

import { RedoclyApiDocsStandalone } from './RedoclyApiDocsStandalone.js';
import { buildItems } from './adapters/build.js';
import { markdocParser } from './components/markdoc/markdocParser.js';
import { TypeOfUsageContext } from './telemetry/TypeOfUsageContext.js';
import { reportDefinitionLoadFailed } from './telemetry/index.js';
import { DefinitionLoadError, errorMessage } from './utils/definitionLoadError.js';
import { argValueToBoolean } from './options/helpers.js';
import { loadAndBundleDefinition } from './utils/loadAndBundleSpec.js';
import { logoFromSpec } from './utils/x-logo.js';
import { isRecord } from './utils/is-record.js';
import { apiSpecType } from './types/common.js';

type RedocStandaloneProps = {
  /** Parsed API description object, or a GraphQL SDL string. */
  spec?: Record<string, unknown> | string;
  /** URL of the API description. Ignored when `spec` is provided. */
  specUrl?: string;
  options?: Partial<RawApiDocsOptions>;
  basePath?: string;
  logo?: RedoclyApiDocsStandaloneProps['logo'];
  markdownAdapter?: MarkdownAdapter;
  onLoaded?: (error?: Error) => void;
  /** Rendered while the spec is loading. */
  children?: ReactNode;
};

type PreparedApiDocs = {
  items: ApiItem[];
  store: ApiStore;
  options: RawApiDocsOptions;
  specType: ApiSpecType;
  /** Bundled spec, or the raw SDL string for GraphQL. */
  document?: Record<string, unknown> | string;
  timings: BuildTimings;
};

const GRAPHQL_URL_PATTERN = /\.(graphql|gql)([?#]|$)/i;
const JSON_START_PATTERN = /^\s*[[{]/;

type ResolvedSpec = { document: unknown; type: ApiSpecType; sdl?: string };

function documentSpecType(document: Record<string, unknown>): ApiSpecType {
  const isIntrospection =
    '__schema' in document || (isRecord(document.data) && '__schema' in document.data);
  if (isIntrospection) {
    throw new DefinitionLoadError(
      'unsupported',
      'GraphQL introspection results are not supported; provide the schema as SDL',
    );
  }
  return 'asyncapi' in document ? apiSpecType.ASYNCAPI : apiSpecType.OPENAPI;
}

function parseJsonSpec(json: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    throw new DefinitionLoadError('parse', errorMessage(error));
  }
  if (!isRecord(parsed))
    throw new DefinitionLoadError('unsupported', 'A JSON "spec" must be an object');
  return parsed;
}

async function bundle(source: Record<string, unknown> | string): Promise<Record<string, unknown>> {
  const bundled: unknown = await loadAndBundleDefinition(source);
  if (!isRecord(bundled)) {
    throw new DefinitionLoadError(
      'unsupported',
      'The spec did not resolve to an OpenAPI or AsyncAPI document',
    );
  }
  return bundled;
}

async function resolveGraphqlSdl(sdl: string): Promise<ResolvedSpec> {
  const { parse } = await import('./utils/graphql-parse.js');
  try {
    return { document: parse(sdl), type: apiSpecType.GRAPHQL, sdl };
  } catch (error) {
    throw new DefinitionLoadError('parse', errorMessage(error));
  }
}

async function fetchText(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new DefinitionLoadError('fetch', errorMessage(error), 0);
  }
  if (response.ok === false) {
    throw new DefinitionLoadError(
      'fetch',
      `Request failed with status ${response.status}`,
      response.status,
    );
  }
  return response.text();
}

async function resolveDocument(
  document: Record<string, unknown>,
  skipBundle: boolean,
): Promise<ResolvedSpec> {
  const type = documentSpecType(document);
  return { document: skipBundle ? document : await bundle(document), type };
}

async function resolveUrl(url: string, skipBundle: boolean): Promise<ResolvedSpec> {
  if (skipBundle) {
    throw new DefinitionLoadError(
      'unsupported',
      '"spec" must be an object when "skipBundle" is enabled',
    );
  }
  if (GRAPHQL_URL_PATTERN.test(url)) {
    return resolveGraphqlSdl(await fetchText(url));
  }
  try {
    const document = await bundle(url);
    return { document, type: documentSpecType(document) };
  } catch (bundleError) {
    const text = await fetchText(url);
    if (/^\s*<(!doctype|html)/i.test(text)) {
      throw new DefinitionLoadError(
        'unsupported',
        `${url} returned an HTML page instead of an API description. Check that your server serves the file at this URL.`,
      );
    }
    try {
      return await resolveGraphqlSdl(text);
    } catch {
      throw bundleError;
    }
  }
}

async function resolveSpec({
  spec,
  specUrl,
  skipBundle,
}: Pick<RedocStandaloneProps, 'spec' | 'specUrl'> & {
  skipBundle: boolean;
}): Promise<ResolvedSpec> {
  if (typeof spec === 'string') {
    return JSON_START_PATTERN.test(spec)
      ? resolveDocument(parseJsonSpec(spec), skipBundle)
      : resolveGraphqlSdl(spec);
  }
  if (spec !== undefined) {
    return resolveDocument(spec, skipBundle);
  }
  if (specUrl !== undefined) {
    return resolveUrl(specUrl, skipBundle);
  }
  throw new DefinitionLoadError('unsupported', 'Either "spec" or "specUrl" must be provided');
}

async function prepareApiDocs({
  spec,
  specUrl,
  options = {},
  basePath = '/',
}: Pick<
  RedocStandaloneProps,
  'spec' | 'specUrl' | 'options' | 'basePath'
>): Promise<PreparedApiDocs> {
  const resolveStart = performance.now();
  const resolved = await resolveSpec({
    spec,
    specUrl,
    skipBundle: argValueToBoolean(options.skipBundle, false),
  });
  const resolveSpecMs = Math.round(performance.now() - resolveStart);

  const defaultDownloadUrls =
    spec === undefined && specUrl !== undefined ? [{ url: specUrl }] : undefined;

  const mergedOptions = {
    downloadUrls: defaultDownloadUrls,
    ...options,
    specType: resolved.type,
    metadata: { ...options.metadata, type: resolved.type },
  } as RawApiDocsOptions;

  const buildStart = performance.now();
  const { items, store } = await buildItems({
    type: resolved.type,
    document: resolved.document,
    options: mergedOptions,
    basePath,
    markdownParser: markdocParser,
  } as Parameters<typeof buildItems>[0]);
  const buildItemsMs = Math.round(performance.now() - buildStart);

  return {
    items,
    store,
    options: mergedOptions,
    specType: resolved.type,
    timings: { resolveSpecMs, buildItemsMs },
    document:
      resolved.type === apiSpecType.GRAPHQL
        ? resolved.sdl
        : (resolved.document as Record<string, unknown>),
  };
}

function isTelemetryDisabled(value: unknown): boolean {
  return value === true || String(value) === 'true';
}

/** Loads and bundles the spec, builds the item model, and renders `RedoclyApiDocsStandalone`. */
const RedocStandalone = ({
  spec,
  specUrl,
  options,
  basePath = '/',
  logo,
  markdownAdapter,
  onLoaded,
  children,
}: RedocStandaloneProps): ReactElement | null => {
  const [prepared, setPrepared] = useState<PreparedApiDocs | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const typeOfUsage = useContext(TypeOfUsageContext);
  const disableTelemetry = isTelemetryDisabled(options?.disableTelemetry);
  const telemetryConfig = useMemo(
    () => ({
      ...(typeOfUsage ? { typeOfUsage } : {}),
      ...(disableTelemetry ? { disabled: true } : {}),
    }),
    [typeOfUsage, disableTelemetry],
  );

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    setPrepared(null);
    setError(null);

    prepareApiDocs({
      spec,
      specUrl,
      options,
      basePath,
    })
      .then((result) => {
        if (cancelled) return;
        setPrepared(result);
        onLoaded?.();
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err);
        onLoaded?.(err);
        reportDefinitionLoadFailed(err, {
          source: spec !== undefined ? 'inline' : 'url',
          durationMs: Math.round(performance.now() - startedAt),
          telemetryConfig,
        });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, specUrl, basePath]);

  if (error) {
    return (
      <div role="alert" style={{ padding: '1em', fontFamily: 'monospace', color: '#e53e3e' }}>
        Failed to load API definition: {error.message}
      </div>
    );
  }

  if (!prepared) {
    if (children !== undefined) {
      return <>{children}</>;
    }
    return argValueToBoolean(options?.hideLoading, false) ? null : (
      <Loading color="--loading-spinner-color" />
    );
  }

  return (
    <RedoclyApiDocsStandalone
      items={prepared.items}
      store={prepared.store}
      basePath={basePath}
      options={prepared.options}
      logo={logo ?? logoFromSpec(prepared.document)}
      markdownAdapter={markdownAdapter}
      telemetryConfig={telemetryConfig}
      spec={prepared.document}
      specUrl={specUrl}
      buildTimings={prepared.timings}
    />
  );
};

export { RedocStandalone, prepareApiDocs, isTelemetryDisabled };
export type { RedocStandaloneProps };
export default RedocStandalone;
