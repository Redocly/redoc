import {
  type ConfigureRequestValues,
  type ConfigureServerRequestValues,
  configure,
} from '@redocly/theme/ext/configure';
import type { OpenAPIInfo, OpenAPIServer } from '@redocly/theme/core/types';
import type { OperationInfo } from '../../../types/openapi.js';

import { getOperationData } from '../utils/operation.js';

export type ResolveRequestValuesParams = {
  operationInfo: OperationInfo;
  info: Record<string, unknown>;
  servers: OpenAPIServer[];
  basePath: string;
  dynamicRequestValues?: ConfigureRequestValues | ConfigureServerRequestValues;
};

/**
 * Builds configure context, calls the ejected configure() function, and returns
 * merged request values: dynamicRequestValues ?? configResult.requestValues ?? {}.
 */
export function resolveRequestValues(
  params: ResolveRequestValuesParams,
): ConfigureRequestValues | ConfigureServerRequestValues {
  const { operationInfo, info, servers, basePath, dynamicRequestValues } = params;

  if (dynamicRequestValues != null && Object.keys(dynamicRequestValues).length > 0) {
    return dynamicRequestValues;
  }

  const { slug: href } = getOperationData(operationInfo, basePath);
  const operationName =
    operationInfo.summary ||
    operationInfo.operationId ||
    operationInfo.pathName ||
    'Unknown Operation';

  const context = {
    info: info as OpenAPIInfo,
    operation: {
      name: operationName,
      path: operationInfo.pathName ?? '',
      operationId: operationInfo.operationId,
      href,
      method: operationInfo.httpVerb ?? '',
    },
    servers,
  };
  const configResult = configure(context) ?? {};
  const requestValues = configResult.requestValues;

  if (requestValues != null && Object.keys(requestValues).length > 0) {
    return requestValues;
  }

  return {};
}
