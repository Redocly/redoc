import type { ApiItem } from '../../../../types/store.js';
import type {
  AsyncApiDefinition,
  AsyncApiOperation,
  ProtocolVariant,
} from '../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { combineUrls } from '@redocly/theme/core/openapi';

import { asString } from '../../../../utils/string.js';
import { itemLabelsByProtocol } from '../../utils/get-protocol-labels.js';
import { readRbacScope, rbacProp } from '../../../rbac.js';
import { resolveItemSeo } from '../../../utils/seo.js';
import { extractSeoDescriptionText } from '../../../utils/markdoc.js';
import { buildOperationContent } from './content.js';

export function buildOperationItem({
  operationId,
  operation,
  linkParts,
  channelBindings,
  document,
  options,
  protocol,
  groupHeaderLabel,
  processContent = true,
  showDivider,
}: {
  operationId: string;
  operation: AsyncApiOperation;
  linkParts: string[];
  channelBindings?: Record<string, unknown>;
  document: AsyncApiDefinition;
  options: ApiDocsOptions;
  protocol?: ProtocolVariant | null;
  groupHeaderLabel?: string;
  processContent?: boolean;
  showDivider?: boolean;
}): ApiItem {
  const labels = itemLabelsByProtocol(protocol ?? null, channelBindings);
  const [firstPart, ...restParts] = linkParts;
  let operationLink = firstPart ?? '';
  for (const part of restParts) {
    operationLink = combineUrls(operationLink, part);
  }
  operationLink = operationLink.toLowerCase();
  const label = asString(operation.title) ?? asString(operation.summary) ?? operationId;
  const description =
    extractSeoDescriptionText(operation.description, options) ?? asString(operation.summary);
  const seo = resolveItemSeo(operation, { title: label, description });

  return {
    label,
    type: 'link',
    link: operationLink,
    routeSlug: operationLink,
    httpVerb: labels[operation.action] || '',
    badges: operation?.['x-badges'] || [],
    metadata: { seo },
    ...rbacProp(readRbacScope(operation)),
    content: processContent
      ? buildOperationContent(
          operationId,
          operation,
          document,
          operationLink,
          options,
          protocol,
          groupHeaderLabel,
          showDivider,
        )
      : null,
  };
}
