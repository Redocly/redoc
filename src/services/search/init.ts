import type { SearchDocument, OperationParameter } from './types.js';
import type { OperationModel, SchemaModel, GroupModel } from '../../models/types.js';
import type { IMenuItem } from '../types.js';
import type { OpenAPIParser } from '../index.js';

import { normalizeOptions } from '../config-options/normalizeOptions.js';
import { stripFormatting } from '../../utils/stripFormatting.js';
import { removeMarkdownLinks } from '../../utils/removeMarkdownLinks.js';
import { generateDeepLink } from '../../components/common/LinkToField.js';
import { getOperation } from '../../models/index.js';
import { SearchEngine } from './engine.js';
import { extractExtensions } from '../../utils/openapi.js';

export const initializeSearch = async (flatItems: any[], parser: OpenAPIParser) => {
  const { searchDocuments, telemetryData } = resolveSearchDocuments(flatItems, parser);
  const searchEngine = new SearchEngine();
  const rootExtensions = Object.keys(extractExtensions(parser.definition, true));

  // Process documents asynchronously to avoid blocking
  for (const document of searchDocuments) {
    if (document) {
      searchEngine.addDocument(document);
    }
    // Yield control back to browser occasionally
    if (searchDocuments.indexOf(document) % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return {
    engine: {
      search: (query: string) => {
        return searchEngine.search(query);
      },
    },
    telemetryData: {
      ...telemetryData,
      extensions: [...rootExtensions, ...telemetryData.extensions],
    },
  };
};

const resolveSearchDocuments = (
  flatItems: any[],
  parser: OpenAPIParser,
): {
  searchDocuments: SearchDocument[];
  telemetryData: {
    operationsCount: number;
    requestBodies: string[];
    extensions: string[];
  };
} => {
  let operationsCount = 0;
  const requestBodies = new Set<string>();
  const operationExtensions = new Set<string>();
  const searchDocuments = flatItems
    .map((item) => {
      try {
        switch (item.type) {
          case 'tag':
          case 'section':
            return addItem(item);
          case 'operation':
            operationsCount++;
            const operation = getOperation(
              parser,
              item.operationDefinition,
              item.parent,
              normalizeOptions({}),
              item.href,
            );
            operation.requestBody?.content?.mediaTypes.forEach(({ name }) => {
              requestBodies.add(name);
            });
            Object.keys(extractExtensions(item.operationDefinition, true)).forEach((extension) => {
              operationExtensions.add(extension);
            });
            return addOperation(operation);
        }
      } catch (e) {
        console.error('Cannot add item to search indexer', e.message);
      }
    })
    .filter((item) => !!item);
  // TODO: add extensions from other places
  return {
    searchDocuments,
    telemetryData: {
      operationsCount,
      requestBodies: Array.from(requestBodies),
      extensions: Array.from(operationExtensions),
    },
  };
};

const addItem = (item: IMenuItem | GroupModel): SearchDocument => {
  const info = (item as GroupModel).infoDefinition;
  return {
    id: item.href,
    url: item.href,
    title: stripFormatting(info ? `${info.title} (${info.version})` : item.name),
    text: stripFormatting(removeMarkdownLinks((info ? info.description : item.description) || '')),
  };
};

const addOperation = (operation: OperationModel): SearchDocument => {
  let parameters: Record<string, OperationParameter> = {};

  // collect parameters:
  for (let parameter of operation.parameters) {
    const example = parameter.schema?.example || parameter.example;
    const param = {
      name: parameter.name,
      description: stripFormatting(removeMarkdownLinks(parameter.description)),
      place: parameter.in + ' parameters',
      mediaType: undefined,
      type: parameter.schema?.type.toString() || 'unknown',
      deepLink: generateDeepLink(parameter),
      required: parameter.required,
      example: example ? JSON.stringify(example) : undefined,
      enum: parameter.schema?.enum?.length ? parameter.schema.enum : undefined,
    };

    parameters[getParameterId(param)] = param;
  }

  // collect request fields:
  addSchema(
    parameters,
    operation.requestBody?.content?.mediaTypes[0]?.schema, //FIXME: get correct schema after rid of operation
    operation.requestBody?.content?.mediaTypes[0]?.name,
    'request fields',
    false,
  );

  // collect response fields:
  for (let response of operation.responses) {
    addSchema(
      parameters,
      response.content?.mediaTypes[0]?.schema, //FIXME: get correct schema after rid of operation
      response.content?.mediaTypes[0]?.name,
      `response ${response.code} fields`,
      true,
    );
  }

  // add operation into result array:
  const openapiOperation = {
    id: operation.href,
    url: operation.href,
    title: stripFormatting(operation.name),
    text: stripFormatting(removeMarkdownLinks(operation.description || '')),
    httpMethod: operation.httpVerb,
    httpPath: operation.path,
    isAdditionalOperation: operation.isAdditionalOperation,
    deprecated: operation.deprecated,
    security: operation.security
      .map((s) => s.schemes.map((scheme) => scheme.id))
      .flat()
      .filter(Boolean) as string[],
    parameters: Object.values(parameters),
    badges: operation.badges.length ? operation.badges : undefined,
  };

  return openapiOperation;
};

const getParameterId = (param: OperationParameter) => {
  return param.name.toString() + param.description + param.place;
};

const addSchema = (
  parameters: Record<string, OperationParameter>,
  schema: SchemaModel | undefined,
  mediaType: string | undefined,
  place: string,
  isResponse: boolean,
  path: string[] = [],
) => {
  if (!schema || schema.isCircular) return;

  if (schema?.fields) {
    for (let field of schema.fields) {
      const newPath = path.concat([field.name]);

      if (
        field.kind === 'additionalProperties' ||
        (field.schema?.readOnly && !isResponse) ||
        (field.schema?.writeOnly && isResponse)
      ) {
        continue;
      }
      const example = field.schema?.example || field.example;
      const enumList = field.schema?.enum;
      const param = {
        name: field.name,
        description: stripFormatting(field.description),
        place,
        mediaType,
        path: newPath.slice(0, -1),
        deepLink: generateDeepLink(field),
        type: field.schema?.type.toString() || 'unknown',
        required: field.required || schema.schema.required?.includes(field.name) || false,
        example: example ? JSON.stringify(example) : undefined,
        enum: enumList?.length ? enumList : undefined,
      };
      const paramId = getParameterId(param);

      // If param is already processed, then we're in a circular reference
      if (parameters[paramId] != null) {
        continue;
      }

      parameters[paramId] = param;

      addSchema(parameters, field.schema, mediaType, place, isResponse, newPath);
    }
  }

  if (schema?.items) {
    addSchema(parameters, schema.items, mediaType, place, isResponse, path);
  }
};
