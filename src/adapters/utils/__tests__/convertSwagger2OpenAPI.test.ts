import { describe, it, expect } from 'vitest';

import { convertSwagger2OpenAPI } from '../convertSwagger2OpenAPI.js';

type GenericObject = Record<string, unknown>;

describe('convertSwagger2OpenAPI', () => {
  it('preserves OAS2 body x-examples on the generated requestBody', async () => {
    const oas2: GenericObject = {
      swagger: '2.0',
      info: { title: 't', version: '1.0' },
      paths: {
        '/pets': {
          post: {
            consumes: ['application/json'],
            parameters: [
              {
                in: 'body',
                name: 'pet',
                schema: { type: 'object', properties: { name: { type: 'string' } } },
                'x-examples': {
                  'application/json': {
                    sample: { value: { name: 'Rex' } },
                  },
                },
              },
            ],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };

    const converted = await convertSwagger2OpenAPI(oas2);
    const requestBody = (
      converted as unknown as {
        paths: Record<string, Record<string, { requestBody?: Record<string, unknown> }>>;
      }
    ).paths['/pets']?.post?.requestBody;

    expect(requestBody?.content).toBeDefined();
    expect(requestBody?.['x-examples']).toEqual({
      'application/json': { sample: { value: { name: 'Rex' } } },
    });
  });
  it('folds the OAS2 host, basePath and schemes into a single server', async () => {
    const oas2: GenericObject = {
      swagger: '2.0',
      info: { title: 'Converted from Swagger 2', version: '2.0.0' },
      host: 'legacy.example.test',
      basePath: '/v2',
      schemes: ['https'],
      paths: {
        '/legacy': {
          get: { operationId: 'legacy', responses: { '200': { description: 'OK.' } } },
        },
      },
    };

    const converted = (await convertSwagger2OpenAPI(oas2)) as unknown as GenericObject;

    expect(converted.openapi).toMatch(/^3\./);
    expect(converted).not.toHaveProperty('swagger');
    expect(converted.servers).toEqual([{ url: 'https://legacy.example.test/v2' }]);
  });
});
