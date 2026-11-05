import type { OperationInfo, OpenAPIParameter, OpenAPIXBadges } from '../../../types/openapi.js';
import type { Referenced } from '../../../types/common.js';
import type { DefinitionCodeSample } from '../../../types/content.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { DEFAULT_TAG_SLUG } from '../../../constants/openapi.js';
import { asString, encodeBackSlashes } from '../../../utils/string.js';
import { isRecord } from '../../../utils/is-record.js';
import {
  extractSummaryText,
} from '../../utils/markdoc.js';
import { normalizePath, joinWithSeparator } from '../../../utils/url.js';
import { reportError } from '../../../telemetry/reportError.js';
import { sanitizeItemId } from './helpers.js';

type OperationData = {
  slug: string;
  label: string;
  badges?: OpenAPIXBadges[];
  deprecated: boolean;
  isAdditionalOperation?: boolean;
  httpVerb: string;
  httpPath: string;
  isWebhook: boolean;
};

/** Summary, then `operationId`, then path, each read as text. */
export function getOperationLabel(operation: OperationInfo): string {
  return (
    asString(operation.summary) ??
    asString(operation.operationId) ??
    asString(operation.pathName) ??
    'Unknown Operation'
  );
}

export function getOperationData(operation: OperationInfo, basePath: string): OperationData {
  const isUntaggedOperation = operation.tags?.length === 1 && operation.tags[0] === '';
  const rawOperationId = asString(operation.operationId);
  const resolvedOperationId = rawOperationId
    ? isUntaggedOperation
      ? joinWithSeparator(DEFAULT_TAG_SLUG, encodeBackSlashes(rawOperationId))
      : encodeBackSlashes(rawOperationId)
    : sanitizeItemId(pointerToId(operation.pointer));

  const operationId =
    resolvedOperationId || `${operation.httpVerb}${encodeBackSlashes(operation.pathName)}`;

  const slug = normalizePath(joinWithSeparator(basePath, operationId.toLowerCase()));
  const label = getOperationLabel(operation);

  const result: OperationData = {
    slug,
    label,
    deprecated: operation.deprecated ?? false,
    httpVerb: operation.httpVerb,
    httpPath: operation.pathName,
    isAdditionalOperation: operation.isAdditionalOperation ?? false,
    isWebhook: operation.isWebhook ?? false,
  };

  if (operation?.['x-badges']) {
    result.badges = operation['x-badges'];
  }

  return result;
}

export function getOperationSummary(
  operation: OperationInfo,
  markdownOptions: ParseMarkdownOptions,
): string | undefined {
  const { summary } = operation;
  const operationId = asString(operation.operationId);

  if (summary) return summary;
  if (operationId) return operationId;

  const text = extractSummaryText(operation.description, markdownOptions);

  return text;
}

type OperationColorProps = {
  deprecated?: boolean;
  isAdditionalOperation?: boolean;
  httpVerb: string;
};

export function getOperationColor({
  deprecated,
  isAdditionalOperation,
  httpVerb,
}: OperationColorProps): string {
  if (deprecated) {
    return 'http-deprecated';
  } else if (isAdditionalOperation) {
    return 'http-additional-operation';
  }
  return httpVerb;
}

function pointerToId(pointer: string | undefined): string {
  if (!pointer) return '';
  return pointer.startsWith('/') ? pointer.slice(1) : pointer;
}

function hasUrl<T>(server: T): server is T & { url: string } {
  return isRecord(server) && typeof server.url === 'string';
}

function withObjectVariables<T extends { url: string }>(server: T): T {
  const variables: unknown = 'variables' in server ? server.variables : undefined;
  if (variables === undefined) return server;
  if (!isRecord(variables)) return { ...server, variables: undefined };
  const entries = Object.entries(variables);
  const kept = entries.filter(([, variable]) => isRecord(variable));
  if (kept.length === 0) return { ...server, variables: undefined };
  return kept.length === entries.length
    ? server
    : { ...server, variables: Object.fromEntries(kept) };
}

/** The servers whose `url` is a string (an empty one is the relative URL `''`), keeping only the
 *  `variables` entries that are objects (none left: `variables` is undefined); anything else,
 *  including a non-array, yields none. */
export function serversWithUrl<T>(servers: readonly T[] | undefined): Array<T & { url: string }> {
  return Array.isArray(servers) ? servers.filter(hasUrl).map(withObjectVariables) : [];
}

/** Operation servers with a `url` win when there is at least one; otherwise the document servers
 *  with a `url` apply (an empty array falls through too — a `??` fallback would not). */
export function pickOperationServers<T>(
  operationServers: readonly T[] | undefined,
  documentServers: readonly T[] | undefined,
): Array<T & { url: string }> {
  const own = serversWithUrl(operationServers);
  return own.length > 0 ? own : serversWithUrl(documentServers);
}

/** The object entries of a `parameters` value; `undefined` when it is not an array. */
export function parameterList(parameters: unknown): Referenced<OpenAPIParameter>[] | undefined {
  return Array.isArray(parameters)
    ? parameters.filter((param): param is Referenced<OpenAPIParameter> => isRecord(param))
    : undefined;
}

/** The `x-codeSamples` entries with a string `source` and a string `lang` or `label`; an entry without `lang` takes its `label` as `lang`. `undefined` when not an array. Reports skipped entries once per list, naming `itemLabel`. */
export function definitionCodeSamples(
  samples: unknown,
  itemLabel: string,
): DefinitionCodeSample[] | undefined {
  if (!Array.isArray(samples)) return undefined;
  const valid = samples.flatMap((s): DefinitionCodeSample[] => {
    if (!isRecord(s) || typeof s.source !== 'string') return [];
    const label = typeof s.label === 'string' ? s.label : undefined;
    const lang = typeof s.lang === 'string' ? s.lang : label;
    return lang === undefined ? [] : [{ lang, label, source: s.source }];
  });
  if (valid.length < samples.length) {
    reportError(
      'invalidValue',
      new TypeError('Each x-codeSamples entry needs a string source and a string lang or label'),
      `Skipped invalid x-codeSamples entries in "${itemLabel}"`,
    );
  }
  return valid;
}
