/* eslint-disable @typescript-eslint/no-var-requires */
import { MenuBuilder } from '../../MenuBuilder';
import { OpenAPIParser } from '../../OpenAPIParser';

import { OperationModel } from '../../models/Operation';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('MenuBuilder', () => {
    let parser;

    test('should resolve pathItems', () => {
      const spec = require('../fixtures/3.1/pathItems.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const contentItems = MenuBuilder.buildStructure(parser, opts);
      expect(contentItems).toHaveLength(1);
      expect(contentItems[0].items).toHaveLength(2);
      expect(contentItems[0].id).toEqual('tag/pet');
      expect(contentItems[0].name).toEqual('pet');
      expect(contentItems[0].type).toEqual('tag');
    });

    test('should include OpenAPI 3.2 additionalOperations with arbitrary custom methods', () => {
      parser = new OpenAPIParser(
        {
          openapi: '3.2.0',
          info: {
            title: 'Additional operations',
            version: '1.0.0',
          },
          paths: {
            '/participants': {
              get: {
                tags: ['participants'],
                summary: 'List participants with query parameters',
                responses: {
                  '200': {
                    description: 'OK',
                  },
                },
              },
              additionalOperations: {
                LIST: {
                  tags: ['participants'],
                  summary: 'List participants with request body',
                  requestBody: {
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                        },
                      },
                    },
                  },
                  responses: {
                    '200': {
                      description: 'OK',
                    },
                  },
                },
                COPY: {
                  tags: ['participants'],
                  summary: 'Copy participants with request body',
                  requestBody: {
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                        },
                      },
                    },
                  },
                  responses: {
                    '200': {
                      description: 'OK',
                    },
                  },
                },
              },
            },
          },
        },
        undefined,
        opts,
      );

      const contentItems = MenuBuilder.buildStructure(parser, opts);
      const operations = contentItems[0].items as OperationModel[];
      expect(contentItems).toHaveLength(1);
      expect(operations).toHaveLength(3);
      expect(operations.map(item => item.httpVerb)).toEqual(['get', 'LIST', 'COPY']);
      expect(operations.map(item => item.name)).toEqual([
        'List participants with query parameters',
        'List participants with request body',
        'Copy participants with request body',
      ]);
    });
  });
});
