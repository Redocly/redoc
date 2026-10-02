import { describe, it, expect } from 'vitest';
import { schemaKind } from '../../../types/common.js';

import type { OpenAPIDefinition, OpenAPISecurityScheme } from '../../../types/openapi.js';

type SecuritySchemeData = Partial<OpenAPISecurityScheme> & { type: OpenAPISecurityScheme['type'] };

import { populateOpenApiStore } from '../store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { createStoreContext, resetStoreCounters, toRecord } from '../../helpers.js';

const defaultOptions = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    basePath: '/api',
  }),
  markdownParser: markdocParser,
};

function makeDoc(overrides: Partial<OpenAPIDefinition> = {}): OpenAPIDefinition {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0' },
    paths: {},
    ...overrides,
  };
}

function populate(doc: OpenAPIDefinition, options = defaultOptions) {
  const storeCtx = createStoreContext(toRecord(doc));
  return populateOpenApiStore(doc, storeCtx, options);
}

function securitySchemes(schemes: Record<string, SecuritySchemeData>) {
  return schemes as OpenAPIDefinition['components'] extends infer C
    ? C extends { securitySchemes?: infer S }
      ? S
      : never
    : never;
}

describe('populateOpenApiStore', () => {
  beforeEach(() => {
    resetStoreCounters();
  });

  it('returns empty stores when document has no components', () => {
    const result = populate(makeDoc());

    expect(Object.keys(result.schemaStore)).toHaveLength(0);
    expect(Object.keys(result.exampleStore)).toHaveLength(0);
    expect(Object.keys(result.securitySchemeStore)).toHaveLength(0);
  });

  it('returns empty stores when components exist but have no schemas, examples, or securitySchemes', () => {
    const result = populate(makeDoc({ components: {} }));

    expect(Object.keys(result.schemaStore)).toHaveLength(0);
    expect(Object.keys(result.exampleStore)).toHaveLength(0);
    expect(Object.keys(result.securitySchemeStore)).toHaveLength(0);
  });

  it('registers schemas with correct id, kind, title, and data', () => {
    const doc = makeDoc({
      components: {
        schemas: {
          Pet: { type: 'object', title: 'Pet', properties: { name: { type: 'string' } } },
          Tag: { type: 'string' },
        },
      },
    });

    const result = populate(doc);

    const pet = result.schemaStore['components/schemas/Pet'];
    expect(pet).toBeDefined();
    expect(pet.kind).toBe(schemaKind.JSON_SCHEMA);
    expect(pet.title).toBe('Pet');
    expect(pet.data).toEqual(expect.objectContaining({ type: 'object' }));

    const tag = result.schemaStore['components/schemas/Tag'];
    expect(tag).toBeDefined();
    expect(tag.title).toBe('Tag');
  });

  it('uses the schema key as title when schema has no title', () => {
    const doc = makeDoc({
      components: {
        schemas: {
          Address: { type: 'object', properties: { street: { type: 'string' } } },
        },
      },
    });

    const result = populate(doc);

    expect(result.schemaStore['components/schemas/Address'].title).toBe('Address');
  });

  it('resolves $ref schemas from the document', () => {
    const doc = makeDoc({
      components: {
        schemas: {
          Pet: { $ref: '#/components/schemas/_Pet' } as unknown as { type: string },
          _Pet: { type: 'object', title: 'Resolved Pet' },
        },
      },
    });

    const result = populate(doc);
    const pet = result.schemaStore['components/schemas/Pet'];

    expect(pet).toBeDefined();
    expect(pet.title).toBe('Resolved Pet');
  });

  it('registers examples with value, summary, description, and externalValue', () => {
    const doc = makeDoc({
      components: {
        examples: {
          PetExample: {
            value: { name: 'Fido' },
            summary: 'A pet example',
            description: 'Example of a pet object',
            externalValue: 'https://example.com/pet.json',
          },
        },
      },
    });

    const result = populate(doc);
    const example = result.exampleStore['components/examples/PetExample'];

    expect(example).toBeDefined();
    expect(example.value).toEqual({ name: 'Fido' });
    expect(example.summary).toBe('A pet example');
    expect(example.description).toBe('Example of a pet object');
    expect(example.externalValue).toBe('https://example.com/pet.json');
  });

  it('sets summary and description to undefined when they are not strings', () => {
    const doc = makeDoc({
      components: {
        examples: {
          Weird: {
            value: 42,
            summary: 123 as unknown as string,
            description: true as unknown as string,
          },
        },
      },
    });

    const result = populate(doc);
    const example = result.exampleStore['components/examples/Weird'];

    expect(example.summary).toBeUndefined();
    expect(example.description).toBeUndefined();
  });

  it('resolves $ref examples from the document', () => {
    const doc = makeDoc({
      components: {
        examples: {
          Pet: { $ref: '#/components/examples/_Pet' } as unknown as { value: unknown },
          _Pet: { value: { name: 'Resolved' }, summary: 'Resolved example' },
        },
      },
    });

    const result = populate(doc);
    const pet = result.exampleStore['components/examples/Pet'];

    expect(pet).toBeDefined();
    expect(pet.value).toEqual({ name: 'Resolved' });
    expect(pet.summary).toBe('Resolved example');
  });

  it('applies OpenAPI 3.2 precedence (dataValue > serializedValue > value) to components.examples', () => {
    const doc = makeDoc({
      components: {
        examples: {
          DataWins: {
            dataValue: { name: 'FromDataValue' },
            serializedValue: 'name=FromSerialized',
            value: { name: 'FromValue' },
          } as unknown as { value: unknown },
          SerializedWins: {
            serializedValue: 'name=FromSerialized',
            value: { name: 'FromValue' },
          } as unknown as { value: unknown },
        },
      },
    });

    const result = populate(doc);

    expect(result.exampleStore['components/examples/DataWins'].value).toEqual({
      name: 'FromDataValue',
    });
    expect(result.exampleStore['components/examples/SerializedWins'].value).toBe(
      'name=FromSerialized',
    );
  });

  it('registers security schemes with all standard fields', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          apiKey: {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['apiKey'];

    expect(scheme).toBeDefined();
    expect(scheme.id).toBe('apiKey');
    expect(scheme.type).toBe('apiKey');
    expect(scheme.paramName).toBe('X-API-Key');
    expect(scheme.in).toBe('header');
  });

  it('registers http bearer security scheme', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['bearerAuth'];

    expect(scheme.type).toBe('http');
    expect(scheme.scheme).toBe('bearer');
    expect(scheme.bearerFormat).toBe('JWT');
  });

  it('registers oauth2 security scheme with flows', () => {
    const flows = {
      authorizationCode: {
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        scopes: { 'read:pets': 'Read pets', 'write:pets': 'Write pets' },
      },
    };

    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          oauth2: {
            type: 'oauth2',
            flows,
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['oauth2'];

    expect(scheme.type).toBe('oauth2');
    expect(scheme.flows).toEqual(flows);
  });

  it('copies oauth2MetadataUrl and deprecated=true through to the security scheme entry', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          oauth2: {
            type: 'oauth2',
            deprecated: true,
            oauth2MetadataUrl: 'https://auth.example.com/.well-known/oauth-authorization-server',
            flows: {},
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['oauth2'];

    expect(scheme.deprecated).toBe(true);
    expect(scheme.oauth2MetadataUrl).toBe(
      'https://auth.example.com/.well-known/oauth-authorization-server',
    );
  });

  it('passes through OAuth flow deviceAuthorizationUrl', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          oauth2: {
            type: 'oauth2',
            flows: {
              deviceAuthorization: {
                deviceAuthorizationUrl: 'https://auth.example.com/device',
                tokenUrl: 'https://auth.example.com/token',
                scopes: {},
              },
            },
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['oauth2'];

    expect(scheme.flows?.deviceAuthorization?.deviceAuthorizationUrl).toBe(
      'https://auth.example.com/device',
    );
  });

  it('registers openIdConnect security scheme', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          oidc: {
            type: 'openIdConnect',
            openIdConnectUrl: 'https://auth.example.com/.well-known/openid-configuration',
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['oidc'];

    expect(scheme.type).toBe('openIdConnect');
    expect(scheme.openIdConnectUrl).toBe(
      'https://auth.example.com/.well-known/openid-configuration',
    );
  });

  it('includes x-defaultClientId when present on security scheme', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          oauth2: {
            type: 'oauth2',
            'x-defaultClientId': 'my-client-id',
            flows: {},
          },
        }),
      },
    });

    const result = populate(doc);

    expect(result.securitySchemeStore['oauth2']['x-defaultClientId']).toBe('my-client-id');
  });

  it('omits x-defaultClientId when not present on security scheme', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          apiKey: { type: 'apiKey', name: 'key', in: 'query' },
        }),
      },
    });

    const result = populate(doc);

    expect(result.securitySchemeStore['apiKey']).not.toHaveProperty('x-defaultClientId');
  });

  it('parses markdown description for security schemes', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          apiKey: {
            type: 'apiKey',
            name: 'key',
            in: 'header',
            description: 'Use **bold** key',
          },
        }),
      },
    });

    const result = populate(doc);
    const scheme = result.securitySchemeStore['apiKey'];

    expect(scheme.description).toBeDefined();
    expect(typeof scheme.description).not.toBe('string');
  });

  it('keeps description undefined when security scheme has no description', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          apiKey: { type: 'apiKey', name: 'key', in: 'header' },
        }),
      },
    });

    const result = populate(doc);

    expect(result.securitySchemeStore['apiKey'].description).toBeUndefined();
  });

  it('skips non-object security scheme entries', () => {
    const doc = makeDoc({
      components: {
        securitySchemes: securitySchemes({
          bad: null as unknown as SecuritySchemeData,
          alsobad: 'string' as unknown as SecuritySchemeData,
          good: { type: 'apiKey', name: 'key', in: 'header' },
        }),
      },
    });

    const result = populate(doc);

    expect(Object.keys(result.securitySchemeStore)).toEqual(['good']);
  });

  it('populates all three stores simultaneously', () => {
    const doc = makeDoc({
      components: {
        schemas: {
          Pet: { type: 'object', title: 'Pet' },
        },
        examples: {
          PetExample: { value: { name: 'Fido' } },
        },
        securitySchemes: securitySchemes({
          apiKey: { type: 'apiKey', name: 'key', in: 'header' },
        }),
      },
    });

    const result = populate(doc);

    expect(Object.keys(result.schemaStore)).toHaveLength(1);
    expect(Object.keys(result.exampleStore)).toHaveLength(1);
    expect(Object.keys(result.securitySchemeStore)).toHaveLength(1);
  });

  it('respects ignoreNamedSchemas option for schemas', () => {
    const doc = makeDoc({
      components: {
        schemas: {
          Pet: {
            type: 'object',
            title: 'Pet',
            properties: { tag: { $ref: '#/components/schemas/Tag' } },
          },
          Tag: { type: 'string', title: 'Tag' },
        },
      },
    });

    const opts = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        basePath: '/api',
        ignoreNamedSchemas: ['Tag'],
      }),
      markdownParser: markdocParser,
    };

    const result = populate(doc, opts);

    const pet = result.schemaStore['components/schemas/Pet'];
    expect(pet).toBeDefined();
    const tagProp = (pet.data.properties as Record<string, Record<string, unknown>>)?.tag;
    expect(tagProp?.type).toBe('object');
    expect(tagProp?.title).toBe('Tag');
  });
});

describe('implicit discriminator normalization', () => {
  const petFamily = {
    Pet: {
      type: 'object',
      discriminator: { propertyName: 'petType' },
      properties: { petType: { type: 'string' }, name: { type: 'string' } },
    },
    Cat: {
      allOf: [
        { $ref: '#/components/schemas/Pet' },
        { type: 'object', properties: { huntingSkill: { type: 'string' } } },
      ],
    },
    Dog: {
      allOf: [
        { $ref: '#/components/schemas/Pet' },
        { type: 'object', properties: { packSize: { type: 'integer' } } },
      ],
    },
  };

  it('synthesizes discriminator.mapping from allOf back-references, in declaration order', () => {
    const result = populate(makeDoc({ components: { schemas: { ...petFamily } } }));

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
      mapping: {
        Cat: '#/components/schemas/Cat',
        Dog: '#/components/schemas/Dog',
      },
    });
  });

  it('normalizes the document itself, so later registrations hash-dedupe to the same entry', () => {
    const doc = makeDoc({ components: { schemas: { ...petFamily } } });

    populate(doc);

    expect(
      (doc.components?.schemas?.Pet as Record<string, unknown> | undefined)?.discriminator,
    ).toEqual({
      propertyName: 'petType',
      mapping: {
        Cat: '#/components/schemas/Cat',
        Dog: '#/components/schemas/Dog',
      },
    });
  });

  it('uses x-discriminator-value as the mapping key when the child declares one', () => {
    const result = populate(
      makeDoc({
        components: {
          schemas: {
            Pet: { ...petFamily.Pet },
            Cat: { ...petFamily.Cat, 'x-discriminator-value': 'kitty' },
          },
        },
      }),
    );

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
      mapping: { kitty: '#/components/schemas/Cat' },
    });
  });

  it('leaves an explicit mapping untouched', () => {
    const result = populate(
      makeDoc({
        components: {
          schemas: {
            ...petFamily,
            Pet: {
              ...petFamily.Pet,
              discriminator: {
                propertyName: 'petType',
                mapping: { c: '#/components/schemas/Cat' },
              },
            },
          },
        },
      }),
    );

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
      mapping: { c: '#/components/schemas/Cat' },
    });
  });

  it('does not synthesize when the discriminator has an explicit oneOf variant list', () => {
    const result = populate(
      makeDoc({
        components: {
          schemas: {
            ...petFamily,
            Pet: {
              ...petFamily.Pet,
              oneOf: [{ $ref: '#/components/schemas/Cat' }],
            },
          },
        },
      }),
    );

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
    });
  });

  it('does not synthesize under x-explicitMappingOnly', () => {
    const result = populate(
      makeDoc({
        components: {
          schemas: {
            ...petFamily,
            Pet: {
              ...petFamily.Pet,
              discriminator: { propertyName: 'petType', 'x-explicitMappingOnly': true },
            },
          },
        },
      }),
    );

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
      'x-explicitMappingOnly': true,
    });
  });

  it('does not synthesize when no schema references the host', () => {
    const result = populate(makeDoc({ components: { schemas: { Pet: { ...petFamily.Pet } } } }));

    expect(result.schemaStore['components/schemas/Pet'].data.discriminator).toEqual({
      propertyName: 'petType',
    });
  });
});
