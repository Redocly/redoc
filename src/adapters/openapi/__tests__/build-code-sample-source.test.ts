import { describe, it, expect } from 'vitest';

import type { ApiDocsOptions } from '../../../types/options.js';
import type { OperationInfo } from '../../../types/openapi.js';

import { buildCodeSampleSource } from '../build-code-sample-source.js';
import { createStoreContext } from '../../helpers.js';

const spec: Record<string, unknown> = {
  openapi: '3.1.0',
  info: { title: 'Test', version: '1.0' },
};

function makeOperation(overrides: Partial<OperationInfo> = {}): OperationInfo {
  return {
    pointer: '/paths/~1test/get',
    pathName: '/test',
    httpVerb: 'get',
    summary: 'Test operation',
    tags: ['Test'],
    isWebhook: false,
    isAdditionalOperation: false,
    ...overrides,
  } as OperationInfo;
}

const options = {} as ApiDocsOptions;

describe('buildCodeSampleSource', () => {
  describe('servers', () => {
    it('prefers operation-level servers over document servers', () => {
      const storeCtx = createStoreContext({
        ...spec,
        servers: [{ url: 'https://doc.example.com' }],
      });
      const operationInfo = makeOperation({
        servers: [{ url: 'https://op.example.com' }],
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.servers).toEqual([{ url: 'https://op.example.com', name: undefined }]);
    });

    it('falls back to a single root server when there are none at all', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation();

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.servers).toEqual([{ url: '/' }]);
    });
  });

  describe('parameters', () => {
    it('buckets parameters by location and resolves example precedence', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation({
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'from-schema' },
          },
          { name: 'x-trace', in: 'header', schema: { type: 'string' } },
        ],
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.parameters.path).toHaveLength(1);
      expect(source.parameters.path[0]).toMatchObject({
        name: 'id',
        in: 'path',
        example: 'from-schema',
      });
      expect(source.parameters.header).toHaveLength(1);
      expect(source.parameters.query).toEqual([]);
    });

  });

  describe('security', () => {
    it('resolves scheme details from the security scheme store and collects scopes', () => {
      const storeCtx = createStoreContext(spec);
      storeCtx.securitySchemeStore.oauth2 = {
        id: 'oauth2',
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://auth.example.com/token', scopes: {} } },
      };
      const operationInfo = makeOperation({
        security: [{ oauth2: ['read', 'write'] }],
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.security).toHaveLength(1);
      expect(source.security[0]).toMatchObject({ scopes: ['read', 'write'] });
      expect(source.security[0]?.schemes[0]).toMatchObject({ id: 'oauth2', type: 'oauth2' });
    });

    it('omits a security requirement whose scheme is not in the store', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation({
        security: [{ missingScheme: [] }],
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.security).toEqual([]);
    });
  });

  describe('request body', () => {
    it('registers a schema and example per media type, sharing pointer-derived ids', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation({
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { name: 'Bare' },
            },
          },
        },
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      const base = 'paths/~1test/get/requestBody/content/application~1json';
      expect(source.requestBody?.['application/json']?.schemaId).toBeDefined();
      expect(source.requestBody?.['application/json']?.exampleIds).toEqual([`${base}/example`]);
      expect(storeCtx.exampleStore[`${base}/example`]?.value).toEqual({ name: 'Bare' });
    });

    it('carries the form encoding of a media type with its part header samples', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation({
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: { type: 'object' },
              encoding: {
                to: { style: 'form', explode: true },
                file: { contentType: 'image/png', headers: { 'X-Custom': { schema: {} } } },
              },
            },
            'application/json': {
              schema: { type: 'object' },
              encoding: { to: { style: 'form' } },
            },
          },
        },
      } as Partial<OperationInfo>);

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.requestBody?.['multipart/form-data']?.encoding).toEqual({
        to: { style: 'form', explode: true },
        file: { contentType: 'image/png', headers: { 'X-Custom': 'string' } },
      });
      expect(source.requestBody?.['application/json']?.encoding).toBeUndefined();
    });

    it('omits requestBody entirely when the operation has none', () => {
      const storeCtx = createStoreContext(spec);
      const operationInfo = makeOperation();

      const source = buildCodeSampleSource(operationInfo, storeCtx, options);

      expect(source.requestBody).toBeUndefined();
    });
  });

});
