import type {
  ExtendedOpenAPIOperation,
  Unstable_ExternalCodeSample,
  OpenAPIParser,
  Options,
} from '../services/index.js';
import type { OpenAPICallback, OpenAPIXCodeSample, Referenced } from '../types/index.js';
import type { MediaContentModel, OperationModel, GroupModel } from './types.js';

import { removeLeadingSlash } from '@redocly/theme/core/openapi';

import {
  extractExtensions,
  getOperationId,
  getOperationName,
  getStatusCodeType,
  getValueFromMdParsedExtension,
  isStatusCode,
  JsonPointer,
  mergeParams,
  normalizeServers,
  sortByDeprecated,
  sortByRequired,
} from '../utils/index.js';
import { getCallback } from './callback.js';
import { getField } from './field.js';
import { getRequestBody } from './request.js';
import { getSecurity } from './security.js';
import { getResponse } from './response.js';
import { getHref } from '../services/menu/operation.js';

export interface Sample {
  lang: string;
  label?: string;
}

export interface XPayloadSample extends Sample {
  lang: 'payload';
  requestBodyContent: MediaContentModel;
  source: string;
}

export interface Callback {
  isCallback: boolean;
  id?: string;
}
export function isPayloadSample(
  sample: XPayloadSample | OpenAPIXCodeSample | Unstable_ExternalCodeSample,
): sample is XPayloadSample {
  return sample.lang === 'Payload' && 'requestBodyContent' in sample;
}

export function getOperation(
  parser: OpenAPIParser,
  operationDefinition: ExtendedOpenAPIOperation,
  parent: GroupModel | undefined,
  options: Options,
  href: string,
  callback?: Callback,
): OperationModel {
  const isWebhook = operationDefinition.isWebhook;
  const operation = {
    operationDefinition,
    parent,
    pointer: operationDefinition.pointer,
    description: getValueFromMdParsedExtension(operationDefinition, 'description'),
    externalDocs: operationDefinition.externalDocs,
    deprecated: !!operationDefinition.deprecated,
    httpVerb: operationDefinition.httpVerb,
    operationId: operationDefinition.operationId,
    path: operationDefinition.pathName,
    isWebhook,
    isCallback: Boolean(callback?.isCallback),
    isEvent: callback?.isCallback || isWebhook,
    name: getOperationName(operationDefinition),
    defaultExampleName: operationDefinition.defaultSampleName,
    type: 'operation',
    callbackId: callback?.id,
    href,
    get callbacks() {
      return Object.keys(operationDefinition.callbacks || []).map((callbackEventName) => {
        return getCallback(
          parser,
          callbackEventName,
          operationDefinition.callbacks?.[callbackEventName] as Referenced<OpenAPICallback>,
          operation.pointer,
          options,
          href,
          parent,
        );
      });
    },
    get responses() {
      let hasSuccessResponses = false;
      return Object.keys(operationDefinition.responses || [])
        .filter((code) => {
          if (code === 'default') {
            return true;
          }

          if (getStatusCodeType(code) === 'success') {
            hasSuccessResponses = true;
          }

          return isStatusCode(code);
        }) // filter out other props (e.g. x-props)
        .map((code) => {
          return getResponse({
            parser,
            code,
            defaultAsError: hasSuccessResponses,
            infoOrRef: operationDefinition.responses[code],
            options,
            isEvent: operation.isEvent,
            operation,
          });
        });
    },
    get parameters() {
      return processParameters(parser, operationDefinition, operation, options);
    },
  } as unknown as OperationModel;

  if (callback?.isCallback) {
    // NOTE: Callbacks by default should not inherit the specification's global `security` definition.
    // Can be defined individually per-callback in the specification. Defaults to none.
    operation.security = getSecurity(operationDefinition.security, parser);

    // TODO: update getting pathInfo for overriding servers on path level
    operation.servers = normalizeServers(
      '',
      operationDefinition.servers || operationDefinition.pathServers || [],
    );
    // TODO: remove it when all deep links are updated with one proper handler
    operation.id = removeLeadingSlash(href); // pass operation href as id for callbacks
  } else {
    operation.id = getOperationId(operationDefinition, parent);
    operation.href = operation.href || getHref(operation);

    operation.security = getSecurity(
      operationDefinition.security || parser.definition.security,
      parser,
    );

    const servers =
      operationDefinition.servers ||
      (operationDefinition.pathServers?.length ? operationDefinition.pathServers : null) ||
      parser.definition.servers ||
      [];
    operation.servers = normalizeServers(parser.definitionUrl, servers);
  }

  if (options.showExtensions) {
    operation.extensions = extractExtensions(operationDefinition, options.showExtensions);
  }
  operation.requestBody = operationDefinition.requestBody
    ? getRequestBody({
        parser: parser,
        infoOrRef: operationDefinition.requestBody,
        options,
        operation,
        isEvent: operation.isEvent,
      })
    : undefined;

  const requestBodyContent = operation.requestBody?.content;
  operation.payload = {
    lang: 'Payload',
    source: '',
    requestBodyContent: requestBodyContent?.hasSample ? requestBodyContent : undefined,
  };
  operation.definitionSamples = operationDefinition['x-codeSamples'] || [];
  operation.badges =
    operationDefinition['x-badges']?.map(({ name, color, position }) => ({
      name,
      color: color || 'var(--color-info-base)',
      position: position || 'after',
    })) || [];

  operation.hasSamples = requestBodyContent?.hasSample || operation.definitionSamples.length > 0;

  return operation;
}

function processParameters(
  parser: OpenAPIParser,
  operationDefinition: ExtendedOpenAPIOperation,
  operation: OperationModel,
  options: Options,
) {
  let parameters = mergeParams(
    parser,
    operationDefinition.pathParameters,
    operationDefinition.parameters,
    {
      pathPointer: JsonPointer.dirName(operation.pointer),
      operationPointer: operation.pointer,
    },
  ).map(({ paramOrRef, pointer }) => {
    const param = getField(parser, paramOrRef, pointer, options, {
      operation,
      type: 'request',
    });

    return param;
  });

  if (options.sortRequiredPropsFirst) {
    parameters = sortByRequired(parameters);
  }
  return sortByDeprecated(parameters);
}
