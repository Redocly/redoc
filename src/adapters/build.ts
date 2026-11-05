import type { DocumentNode } from 'graphql';
import type { ApiDocAdapterProps, ApiItem, ApiStore } from '../types/store.js';
import type { OpenAPIDefinition } from '../types/openapi.js';
import type { AsyncApiDefinition } from '../types/asyncapi.js';
import type { ApiSpecType } from '../types/common.js';
import type { ApiDocsOptions, RawApiDocsOptions } from '../types/options.js';

import { contentType } from '../types/common.js';
import { normalizeOptions } from '../options/normalizeOptions.js';
import { asString } from '../utils/string.js';
import { isRecord } from '../utils/is-record.js';
import {
  collectReportedErrors,
  reportError,
  type ReportedError,
} from '../telemetry/reportError.js';

import type { MarkdownParser } from './utils/parseMarkdown.js';

type ApiDocProps = Omit<ApiDocAdapterProps, 'options'> & {
  options: RawApiDocsOptions;
  markdownParser: MarkdownParser;
};

type BuildItemsResult = {
  items: ApiItem[];
  store: ApiStore;
  specType: ApiSpecType;
};

// The error collector is one module-level batch, so builds in one process run one at a time:
// a description's build errors never land in another description's store.
let buildQueue: Promise<unknown> = Promise.resolve();

/** The most entries a store keeps in `buildErrors`; every report is still logged. */
export const MAX_BUILD_ERRORS = 50;

function queued<T>(build: () => Promise<T>): Promise<T> {
  const run = buildQueue.then(build);
  buildQueue = run.catch(() => undefined);
  return run;
}

export function buildItems(props: ApiDocProps): Promise<BuildItemsResult> {
  return queued(() => buildItemsNow(props));
}

async function buildItemsNow(props: ApiDocProps): Promise<BuildItemsResult> {
  const specType = props.type;
  const stopCollecting = collectReportedErrors();
  let result: Awaited<ReturnType<typeof processDocument>>;
  let reported: ReportedError[];
  try {
    result = await processDocument(props);
  } finally {
    reported = stopCollecting();
  }
  const { items, store } = result ?? {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
  };
  const buildErrors = uniqueBuildErrors(reported);

  return {
    items,
    store: { ...store, specType, ...(buildErrors.length > 0 && { buildErrors }) },
    specType,
  };
}

/** Distinct by id, name and message, in first-report order, at most `MAX_BUILD_ERRORS`. */
function uniqueBuildErrors(reported: ReportedError[]): NonNullable<ApiStore['buildErrors']> {
  const seen = new Set<string>();
  const buildErrors: NonNullable<ApiStore['buildErrors']> = [];
  for (const { id, error } of reported) {
    if (buildErrors.length === MAX_BUILD_ERRORS) break;
    const key = JSON.stringify([id, error.name, error.message]);
    if (seen.has(key)) continue;
    seen.add(key);
    buildErrors.push({ id, name: error.name, message: error.message });
  }
  return buildErrors;
}

/** Overview-only item for a description that failed to build: it keeps its route and nav entry. */
function fallbackOverviewItem(
  { basePath = '/', type }: ApiDocProps,
  title: string | undefined,
  processContent: boolean,
): ApiItem {
  return {
    type: 'link',
    label: title ?? 'Overview',
    labelTranslationKey: title ? undefined : `${type}.info.title`,
    link: basePath,
    routeSlug: basePath,
    content: processContent ? { contentType: contentType.OVERVIEW, children: [] } : null,
  };
}

/** Runs the adapter; a throw outside an item is reported and yields the overview item alone. */
async function processDocument(
  props: ApiDocProps,
  processContent = true,
): Promise<{ items: ApiItem[]; store: ApiStore } | undefined> {
  const options: ApiDocsOptions = {
    ...normalizeOptions(props.options),
    markdownParser: props.markdownParser,
  };
  try {
    if (isOpenApiDefinition(props)) {
      const { processOpenApiDocument } = await import('./openapi/index.js');
      return await processOpenApiDocument({ ...props, options, processContent });
    }
    if (isAsyncApiDefinition(props)) {
      const { processAsyncApiDocument } = await import('./asyncapi/index.js');
      return processAsyncApiDocument({ ...props, options, processContent });
    }
    if (isGraphqlDefinition(props)) {
      const { processGraphqlDocument } = await import('./graphql/index.js');
      return processGraphqlDocument({ ...props, options, processContent });
    }
    return undefined;
  } catch (error) {
    const title = documentTitle(props.document);
    reportError(
      'buildDocument',
      error,
      `Could not build the API description${title ? ` "${title}"` : ''}`,
    );
    return {
      items: [fallbackOverviewItem(props, title, processContent)],
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    };
  }
}

function documentTitle(document: unknown): string | undefined {
  return isRecord(document) && isRecord(document.info) ? asString(document.info.title) : undefined;
}

function isOpenApiDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'openapi'; document: OpenAPIDefinition } {
  return def.type === 'openapi';
}

function isAsyncApiDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'asyncapi'; document: AsyncApiDefinition } {
  return def.type === 'asyncapi';
}

function isGraphqlDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'graphql'; document: DocumentNode } {
  return def.type === 'graphql';
}
