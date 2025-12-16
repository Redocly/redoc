import { vi, type Mocked } from 'vitest';
import swagger2openapi from 'swagger2openapi';

import type { OpenAPIDefinition } from '../../types/index.js';

import { convertSwagger2OpenAPI } from '../convertSwagger2OpenAPI.js';

// Mock the swagger2openapi module
vi.mock('swagger2openapi');

const mockSwagger2OpenAPI = swagger2openapi as Mocked<typeof swagger2openapi>;

describe('convertSwagger2OpenAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should convert a valid Swagger 2.0 spec to OpenAPI 3.0', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    };

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/test': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      swaggerSpec,
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
    expect(result).toEqual(expectedOpenAPISpec);
  });

  it('should add empty paths object if paths is missing', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    };

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      { ...swaggerSpec, paths: {} },
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
  });

  it('should preserve existing paths if already present', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/existing': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    };

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/existing': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      swaggerSpec, // Should not modify the original spec
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
  });

  it('should reject with error when swagger2openapi conversion fails', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    const conversionError = new Error('Invalid Swagger specification');

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(conversionError, null);
      return undefined as never;
    });

    await expect(convertSwagger2OpenAPI(swaggerSpec)).rejects.toThrow(
      'Invalid Swagger specification',
    );

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      swaggerSpec,
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
  });

  it('should handle swagger2openapi returning null result', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, null);
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(result).toBeUndefined();
  });

  it('should handle swagger2openapi returning result without openapi property', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { someOtherProperty: 'value' });
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(result).toBeUndefined();
  });

  it('should handle complex Swagger specification with all properties', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Complex API',
        version: '2.0.0',
        description: 'A complex API with many features',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      host: 'api.example.com',
      basePath: '/v1',
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      paths: {
        '/users': {
          get: {
            tags: ['users'],
            summary: 'Get all users',
            description: 'Retrieve a list of all users',
            operationId: 'getUsers',
            parameters: [
              {
                name: 'limit',
                in: 'query',
                description: 'Number of users to return',
                required: false,
                type: 'integer',
                default: 10,
              },
            ],
            responses: {
              '200': {
                description: 'Successful response',
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/User',
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
      },
      definitions: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
          },
          required: ['id', 'name'],
        },
      },
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
        },
      },
    };

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Complex API',
        version: '2.0.0',
        description: 'A complex API with many features',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'https://api.example.com/v1',
        },
      ],
      paths: {
        '/users': {
          get: {
            tags: ['users'],
            summary: 'Get all users',
            description: 'Retrieve a list of all users',
            operationId: 'getUsers',
            parameters: [
              {
                name: 'limit',
                in: 'query',
                description: 'Number of users to return',
                required: false,
                schema: {
                  type: 'integer',
                  default: 10,
                },
              },
            ],
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'User ID',
              },
              name: {
                type: 'string',
                description: 'User name',
              },
            },
            required: ['id', 'name'],
          },
        },
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            bearerFormat: '',
            flows: {},
          },
        },
      },
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      swaggerSpec,
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
    expect(result).toEqual(expectedOpenAPISpec);
  });

  it('should handle empty specification object', async () => {
    const swaggerSpec = {};

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'API',
        version: '1.0.0',
      },
      paths: {},
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      { paths: {} },
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
    expect(result).toEqual(expectedOpenAPISpec);
  });

  it('should handle specification with null paths', async () => {
    const swaggerSpec = {
      swagger: '2.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: null,
    };

    const expectedOpenAPISpec: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    mockSwagger2OpenAPI.convertObj.mockImplementation((_spec, _options, callback) => {
      callback(null, { openapi: expectedOpenAPISpec });
      return undefined as never;
    });

    const result = await convertSwagger2OpenAPI(swaggerSpec);

    expect(mockSwagger2OpenAPI.convertObj).toHaveBeenCalledWith(
      { ...swaggerSpec, paths: {} },
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      expect.any(Function),
    );
    expect(result).toEqual(expectedOpenAPISpec);
  });
});
