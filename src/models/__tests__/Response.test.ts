import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';

import type { OpenAPIDefinition } from '../../types';
import type { OperationModel } from '../types';

import { getResponse } from '../response';
import { normalizeOptions, OpenAPIParser } from '../../services';

const opts = normalizeOptions({});
describe('Models', () => {
  describe('ResponseModel', () => {
    let parser, props;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as OpenAPIDefinition, undefined, opts);
      props = {
        parser,
        defaultAsError: false,
        infoOrRef: {},
        options: opts,
        isEvent: false,
        code: 'default',
      };
    });

    test('should calculate response type based on code', () => {
      let resp = getResponse({ ...props, code: '200' });
      expect(resp.type).toEqual('success');
      resp = getResponse({ ...props, code: '120' });
      expect(resp.type).toEqual('info');
      resp = getResponse({ ...props, code: '301' });
      expect(resp.type).toEqual('redirect');
      resp = getResponse({ ...props, code: '400' });
      expect(resp.type).toEqual('error');
    });

    test('default should be successful by default', () => {
      const resp = getResponse({ ...props, code: 'default' });
      expect(resp.type).toEqual('success');
    });

    test('default should be error if defaultAsError is true', () => {
      const resp = getResponse({ ...props, code: 'default', defaultAsError: true });
      expect(resp.type).toEqual('error');
    });

    test('should use x-summary for summary and description for description', () => {
      const resp = getResponse({
        ...props,
        infoOrRef: {
          'x-summary': 'test summary',
          description: 'test description',
        },
      });
      expect(resp.summary).toEqual('test summary');
      expect(resp.description).toEqual('test description');
    });

    test('should have empty summary and description if not provided', () => {
      const resp = getResponse({
        ...props,
        infoOrRef: {},
      });
      expect(resp.summary).toEqual('');
      expect(resp.description).toEqual('');
    });

    test('should parse headers', () => {
      const resp = getResponse({
        ...props,
        operation: { pointer: '#/paths/~1test/get' } as OperationModel,
        infoOrRef: {
          headers: {
            'X-Rate-Limit': {
              description: 'Calls per hour allowed by the user',
              schema: {
                type: 'integer',
                format: 'int32',
              },
            },
          },
        },
      });
      expect(resp.headers).toHaveLength(1);
      expect(resp.headers[0].name).toEqual('X-Rate-Limit');
      expect(resp.headers[0].description).toEqual('Calls per hour allowed by the user');
    });

    test('should parse content', () => {
      const resp = getResponse({
        ...props,
        operation: { pointer: '#/paths/~1test/get' } as OperationModel,
        infoOrRef: {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      });
      expect(resp.content).toBeDefined();
      expect(resp.content?.mediaTypes).toHaveLength(1);
      expect(resp.content?.mediaTypes[0].name).toEqual('application/json');
    });

    test('should set isRequestType when isEvent is true', () => {
      const resp = getResponse({
        ...props,
        isEvent: true,
        operation: { pointer: '#/paths/~1test/get' } as OperationModel,
        infoOrRef: {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      });
      expect(resp.content).toBeDefined();
      expect(resp.content?.isRequestType).toBe(true);
    });

    test('should get correct sibling in responses for openapi 3.1', () => {
      const spec = parseYaml(outdent`
        openapi: 3.1.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  description: Overridden description
                  $ref: "#/components/responses/Successful"
        components:
          responses:
            Successful:
              description: successful operation
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      successful:
                        type: boolean
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const code = '200';
      const responseModel = getResponse({
        parser: parser,
        code: code,
        defaultAsError: false,
        infoOrRef: spec.paths['/test'].get.responses[code],
        options: opts,
        operation: {} as OperationModel,
      });

      expect(responseModel.summary).toBe('Overridden description');
    });

    test('should not override description in responses for openapi 3.0', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  description: Overridden description
                  $ref: "#/components/responses/Successful"
        components:
          responses:
            Successful:
              description: successful operation
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      successful:
                        type: boolean
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const code = '200';
      const responseModel = getResponse({
        parser: parser,
        code: code,
        defaultAsError: false,
        infoOrRef: spec.paths['/test'].get.responses[code],
        options: opts,
        operation: {} as OperationModel,
      });

      expect(responseModel.summary).toBe('successful operation');
    });
  });
});
