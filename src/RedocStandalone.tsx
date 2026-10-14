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
import {
  argValueToBoolean,
  isTelemetryDisabled,
  normalizeDownloadUrls,
} from './options/helpers.js';
import { isRecord } from './utils/is-record.js';
import { normalizePath } from './utils/url.js';
import { convertedDownloadUrl, convertedFileName, resolveSpec } from './utils/resolveSpec.js';
import { logoFromSpec } from './utils/x-logo.js';
import { apiSpecType } from './types/common.js';

type RedocStandaloneProps = {
  /** Parsed API description object, its JSON or YAML text, or a GraphQL SDL string. */
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

/**
 * Resolves the spec and builds the item model. `convertedDownload: false` keeps the default
 * download on `specUrl` for an AsyncAPI 2.x source instead of a `blob:` URL of the converted
 * document, which a server pass cannot create; the caller revokes any `blob:` download URL.
 */
async function prepareApiDocs({
  spec,
  specUrl,
  options = {},
  basePath = '/',
  convertedDownload = true,
}: Pick<RedocStandaloneProps, 'spec' | 'specUrl' | 'options' | 'basePath'> & {
  convertedDownload?: boolean;
}): Promise<PreparedApiDocs> {
  const resolveStart = performance.now();
  const resolved = await resolveSpec({
    spec,
    specUrl,
    skipBundle: argValueToBoolean(options.skipBundle, false),
  });
  const resolveSpecMs = Math.round(performance.now() - resolveStart);

  const usesDefaultDownload =
    spec === undefined &&
    specUrl !== undefined &&
    normalizeDownloadUrls(options.downloadUrls ?? [], resolved.type).length === 0;
  const convertedUrl =
    usesDefaultDownload &&
    convertedDownload &&
    resolved.convertedFrom &&
    resolved.type === apiSpecType.ASYNCAPI
      ? convertedDownloadUrl(resolved.document)
      : undefined;
  const downloadUrls =
    usesDefaultDownload && specUrl !== undefined
      ? [
          convertedUrl
            ? { url: convertedUrl, title: convertedFileName(specUrl) }
            : {
                url:
                  typeof document === 'undefined'
                    ? specUrl
                    : new URL(specUrl, document.baseURI).href,
              },
        ]
      : options.downloadUrls;

  const mergedOptions = {
    ...options,
    downloadUrls,
    specType: resolved.type,
    metadata: { ...options.metadata, type: resolved.type },
  } as RawApiDocsOptions;

  const buildStart = performance.now();
  const { items, store } = await buildItems({
    type: resolved.type,
    document: resolved.document,
    options: mergedOptions,
    basePath: normalizePath(basePath),
    markdownParser: markdocParser,
  } as Parameters<typeof buildItems>[0]);
  const buildItemsMs = Math.round(performance.now() - buildStart);

  return {
    items,
    store: { ...store, convertedFrom: resolved.convertedFrom },
    options: mergedOptions,
    specType: resolved.type,
    timings: { resolveSpecMs, buildItemsMs },
    document:
      resolved.type === apiSpecType.GRAPHQL
        ? resolved.sdl
        : (resolved.document as Record<string, unknown>),
  };
}

function blobDownloadUrls(options: RawApiDocsOptions): string[] {
  const downloadUrls = Array.isArray(options.downloadUrls) ? options.downloadUrls : [];
  return downloadUrls
    .map((entry: unknown) => (isRecord(entry) && typeof entry.url === 'string' ? entry.url : ''))
    .filter((url) => url.startsWith('blob:'));
}

function revokeAll(urls: string[]): void {
  for (const url of urls) URL.revokeObjectURL(url);
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
    let blobUrls: string[] = [];
    const startedAt = performance.now();
    setPrepared(null);
    setError(null);

    prepareApiDocs({
      spec,
      specUrl,
      // The opt-out stays live through telemetryConfig; a copy frozen in the prepared options would outlive it.
      options: { ...options, disableTelemetry: undefined },
      basePath,
    })
      .then((result) => {
        blobUrls = blobDownloadUrls(result.options);
        if (cancelled) {
          revokeAll(blobUrls);
          return;
        }
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
      revokeAll(blobUrls);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, specUrl, basePath]);

  if (error) {
    return (
      <div role="alert" style={{ padding: '1em', fontFamily: 'monospace', color: '#e53e3e' }}>
        Failed to load API description: {error.message}
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

export { RedocStandalone, prepareApiDocs };
export type { RedocStandaloneProps };
export default RedocStandalone;
