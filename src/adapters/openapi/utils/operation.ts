import type { OperationInfo, OpenAPIXBadges } from '../../../types/openapi.js';
import type { SeoData } from '../../../types/common.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { DEFAULT_TAG_SLUG } from '../../../constants/openapi.js';
import { asString, encodeBackSlashes } from '../../../utils/string.js';
import { extractSeoDescriptionText, extractSummaryText } from '../../utils/markdoc.js';
import { normalizePath, joinWithSeparator } from '../../../utils/url.js';
import { resolveItemSeo } from '../../utils/seo.js';
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
  seo?: SeoData;
};

export function getOperationData(operation: OperationInfo, basePath: string): OperationData {
  const isUntaggedOperation = operation.tags?.length === 1 && operation.tags[0] === '';
  const resolvedOperationId = operation.operationId
    ? isUntaggedOperation
      ? joinWithSeparator(DEFAULT_TAG_SLUG, encodeBackSlashes(operation.operationId))
      : encodeBackSlashes(operation.operationId)
    : sanitizeItemId(pointerToId(operation.pointer));

  const operationId =
    resolvedOperationId || `${operation.httpVerb}${encodeBackSlashes(operation.pathName)}`;

  const slug = normalizePath(joinWithSeparator(basePath, operationId.toLowerCase()));
  const label =
    asString(operation.summary) ??
    asString(operation.operationId) ??
    asString(operation.pathName) ??
    'Unknown Operation';

  const seo = resolveItemSeo(operation, {
    title: label,
    description: extractSeoDescriptionText(operation.description) ?? asString(operation.summary),
  });

  const result: OperationData = {
    slug,
    label,
    deprecated: operation.deprecated ?? false,
    httpVerb: operation.httpVerb,
    httpPath: operation.pathName,
    isAdditionalOperation: operation.isAdditionalOperation ?? false,
    isWebhook: operation.isWebhook ?? false,
    seo,
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
  const { operationId, summary } = operation;

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
