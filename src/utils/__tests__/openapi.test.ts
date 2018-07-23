import {
  detectType,
  getOperationSummary,
  getStatusCodeType,
  isOperationName,
  isPrimitiveType,
  mergeParams,
  normalizeServers,
} from '../';

import { OpenAPIParser } from '../../services';
import { OpenAPIParameter } from '../../types';

describe('Utils', () => {
  describe('openapi getStatusCode', () => {
    it('Should return info for status codes within 100 and 200', () => {
      expect(getStatusCodeType(100)).toEqual('info');
      expect(getStatusCodeType(150)).toEqual('info');
      expect(getStatusCodeType(199)).toEqual('info');
    });

    it('Should return success for status codes within 200 and 300', () => {
      expect(getStatusCodeType(200)).toEqual('success');
      expect(getStatusCodeType(250)).toEqual('success');
      expect(getStatusCodeType(299)).toEqual('success');
    });
    it('Should return redirect for status codes within 300 and 400', () => {
      expect(getStatusCodeType(300)).toEqual('redirect');
      expect(getStatusCodeType(399)).toEqual('redirect');
    });
    it('Should return error for status codes above 400', () => {
      expect(getStatusCodeType(400)).toEqual('error');
      expect(getStatusCodeType(500)).toEqual('error');
      expect(getStatusCodeType(599)).toEqual('error');
    });

    it('Should throw for incorrect HTTP code', () => {
      expect(() => getStatusCodeType(99)).toThrow('invalid HTTP code');
      expect(() => getStatusCodeType(600)).toThrow('invalid HTTP code');
    });
  });

  describe('openapi isOperationName', () => {
    it('Should return `true` for correct HTTP verbs', () => {
      expect(isOperationName('get')).toEqual(true);
      expect(isOperationName('post')).toEqual(true);
      expect(isOperationName('put')).toEqual(true);
      expect(isOperationName('head')).toEqual(true);
      expect(isOperationName('patch')).toEqual(true);
      expect(isOperationName('delete')).toEqual(true);
      expect(isOperationName('options')).toEqual(true);
    });

    it('Should return `false` for incorrect HTTP verbs', () => {
      expect(isOperationName('properties')).toEqual(false);
      expect(isOperationName('x-name')).toEqual(false);
      expect(isOperationName('fix')).toEqual(false);
    });
  });

  let sixtyLetterStr = '';
  for (let i = 0; i < 60; i++) {
    sixtyLetterStr += 'a';
  }

  describe('openapi getOperationSummary', () => {
    it('Should return operation self summary if exists', () => {
      const operation = {
        summary: 'test',
        operationId: 'fail',
        description: 'fail',
      };
      expect(getOperationSummary(operation as any)).toEqual('test');
    });

    it('Should return operationId if no summary', () => {
      const operation = {
        operationId: 'test',
        description: 'fail',
      };
      expect(getOperationSummary(operation as any)).toEqual('test');
    });

    it('Should return description if no summary and operationId', () => {
      const operation = {
        description: 'test',
      };
      expect(getOperationSummary(operation as any)).toEqual('test');
    });

    it('Should return only first 50 description letter if no summary and operationId', () => {
      const operation = {
        description: sixtyLetterStr,
      };
      expect(sixtyLetterStr.length).toBeGreaterThan(50);
      expect(getOperationSummary(operation as any).length).toBe(50);
    });

    it('Should return <no summary> if no info', () => {
      const operation = {
        description: undefined,
      };
      expect(getOperationSummary(operation as any)).toBe('<no summary>');
    });
  });

  describe('openapi detectType', () => {
    it('Should detect object.type if it is specified', () => {
      expect(
        detectType({
          type: 'object',
        }),
      ).toBe('object');

      expect(
        detectType({
          type: 'object',
          minimum: 1,
        }),
      ).toBe('object');
    });

    const tests = {
      number: ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'],

      string: ['pattern', 'minLength', 'maxLength'],

      array: ['items', 'maxItems', 'minItems', 'uniqueItems'],
      object: ['maxProperties', 'minProperties', 'required', 'additionalProperties', 'properties'],
    };

    Object.keys(tests).forEach(name => {
      it(`Should detect ${name} if ${name} properties are present`, () => {
        tests[name].forEach(propName => {
          expect(
            detectType({
              [propName]: 0,
            }),
          ).toBe(name);
        });
      });
    });
  });

  describe('openapi isPrimitiveType', () => {
    it('Should return true for empty object', () => {
      const schema = {
        type: 'object',
      };
      expect(isPrimitiveType(schema)).toEqual(true);
    });

    it('Should return false for object with props', () => {
      const schema = {
        type: 'object',
        properties: {
          a: {
            type: 'string',
          },
        },
      };
      expect(isPrimitiveType(schema)).toEqual(false);
    });

    it('Should return false for array with non-empty objects', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            a: {
              type: 'string',
            },
          },
        },
      };
      expect(isPrimitiveType(schema)).toEqual(false);
    });

    it('should return false for object with additionalProperties', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
        },
      };
      expect(isPrimitiveType(schema)).toEqual(false);
    });
  });

  describe('openapi mergeParams', () => {
    it('Should deduplicate params with same "name" and "in"', () => {
      const pathParams: OpenAPIParameter[] = [
        {
          name: 'param1',
          in: 'path',
          description: 'path',
        },
        {
          name: 'param2',
          in: 'path',
        },
      ];
      const operationParams: OpenAPIParameter[] = [
        {
          name: 'param1',
          in: 'path',
          description: 'oper',
        },
        {
          name: 'param2',
          in: 'query',
        },
      ];

      const parser = new OpenAPIParser({ openapi: '3.0' } as any);

      const res = mergeParams(parser, pathParams, operationParams) as OpenAPIParameter[];
      expect(res).toHaveLength(3);
      expect(res[0]).toEqual(pathParams[1]);
      expect(res[1]).toEqual(operationParams[0]);
      expect(res[2]).toEqual(operationParams[1]);
    });
  });

  describe('normalize servers', () => {
    it('should make url absolute and strip spec name', () => {
      const res = normalizeServers('http://base.com/spec.yaml', [
        {
          url: '/sandbox/test',
        },
      ]);
      expect(res).toEqual([{ url: 'http://base.com/sandbox/test', description: '' }]);
    });

    it('should prefer server host over spec`s one', () => {
      const res = normalizeServers('http://base.com/spec.yaml', [
        {
          url: 'https://otherbase.com/sandbox/test',
        },
      ]);
      expect(res).toEqual([{ url: 'https://otherbase.com/sandbox/test', description: '' }]);
    });

    it('should strip trailing slash', () => {
      const res = normalizeServers('', [
        {
          url: 'https://otherbase.com/sandbox/test/',
        },
      ]);
      expect(res).toEqual([{ url: 'https://otherbase.com/sandbox/test', description: '' }]);
    });

    it('should set correct protocol', () => {
      const res = normalizeServers('https://base.com', [
        {
          url: '//base.com/sandbox/test',
          description: 'test',
        },
      ]);
      expect(res).toEqual([{ url: 'https://base.com/sandbox/test', description: 'test' }]);
    });
  });
});
