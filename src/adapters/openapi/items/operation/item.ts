import type { ApiItem } from '../../../../types/store.js';
import type { OperationInfo } from '../../../../types/openapi.js';

import { WEBHOOKS_GROUP_TITLE } from '../../../../constants/openapi.js';
import { buildItemContent } from './content.js';
import { getOperationData } from '../../utils/operation.js';
import { openApiContext } from '../../buildContext.js';
import { readRbacScope, rbacProp, type RbacScope } from '../../../rbac.js';

export function addOperationItems({
  operations,
  result,
  basePath: basePathOverride,
  parentRbac,
}: {
  operations: OperationInfo[];
  result: ApiItem[];
  basePath?: string;
  parentRbac?: RbacScope;
}): void {
  const { basePath } = openApiContext.get();
  const effectiveBasePath = basePathOverride ?? basePath;
  const { regular, regularDeprecated, webhooks, webhooksDeprecated } =
    categorizeOperations(operations);

  for (const operation of [...regular, ...regularDeprecated]) {
    addOperationItem(operation, effectiveBasePath, result, parentRbac);
  }

  const hasWebhooks = webhooks.length > 0 || webhooksDeprecated.length > 0;
  const hasRegular = regular.length > 0 || regularDeprecated.length > 0;

  if (hasWebhooks && hasRegular) {
    result.push({
      type: 'separator',
      label: WEBHOOKS_GROUP_TITLE,
      variant: 'secondary',
      content: null,
    });
  }

  for (const operation of [...webhooks, ...webhooksDeprecated]) {
    addOperationItem(operation, effectiveBasePath, result, parentRbac);
  }
}

function categorizeOperations(operations: OperationInfo[]): {
  regular: OperationInfo[];
  regularDeprecated: OperationInfo[];
  webhooks: OperationInfo[];
  webhooksDeprecated: OperationInfo[];
} {
  const regular: OperationInfo[] = [];
  const regularDeprecated: OperationInfo[] = [];
  const webhooks: OperationInfo[] = [];
  const webhooksDeprecated: OperationInfo[] = [];

  for (const operation of operations) {
    if (operation.isWebhook) {
      (operation.deprecated ? webhooksDeprecated : webhooks).push(operation);
    } else {
      (operation.deprecated ? regularDeprecated : regular).push(operation);
    }
  }

  return { regular, regularDeprecated, webhooks, webhooksDeprecated };
}

function addOperationItem(
  operation: OperationInfo,
  basePath: string,
  result: ApiItem[],
  parentRbac?: RbacScope,
): void {
  const {
    processContent,
  } = openApiContext.get();

  const {
    slug,
    badges,
    httpPath,
    ...rest
  } = getOperationData(operation, basePath);

  const item: ApiItem = {
    ...rest,
    type: 'link',
    link: slug,
    routeSlug: slug,
    ...rbacProp(readRbacScope(operation) ?? parentRbac),
    content: processContent ? buildItemContent(operation, slug) : null,
  };

  if (badges) {
    Object.assign(item, { badges });
  }
  if (httpPath) {
    Object.assign(item, { httpPath });
  }

  result.push(item);
}
