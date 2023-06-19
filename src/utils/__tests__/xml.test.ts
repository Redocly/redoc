import { generateXmlExample } from '../xml';

describe('generateXmlExample', () => {
  it('should generate xml example', () => {
    const examples = generateXmlExample({
      includeReadOnly: false,
      includeWriteOnly: false,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with readOnly', () => {
    const examples = generateXmlExample({
      includeReadOnly: true,
      includeWriteOnly: false,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            readOnly: true,
          },
          bar: {
            type: 'string',
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with writeOnly', () => {
    const examples = generateXmlExample({
      includeReadOnly: false,
      includeWriteOnly: true,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
            writeOnly: true,
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with readOnly and writeOnly', () => {
    const examples = generateXmlExample({
      includeReadOnly: true,
      includeWriteOnly: true,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            readOnly: true,
          },
          bar: {
            type: 'string',
            writeOnly: true,
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with a list', () => {
    const examples = generateXmlExample({
      includeReadOnly: false,
      includeWriteOnly: false,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          bar: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with a complex list and each property has an example', () => {
    const examples = generateXmlExample({
      includeReadOnly: false,
      includeWriteOnly: false,
      schema: {
        type: 'object',
        properties: {
          foo: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  example: 'this is foo',
                },
                bar: {
                  type: 'string',
                  example: 'this is bar',
                },
              },
            },
          },
          bar: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  example: 'this is foo2',
                },
                bar: {
                  type: 'string',
                  example: 'this is bar2',
                },
              },
            },
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml example with xml attributes', () => {
    const examples = generateXmlExample({
      includeReadOnly: true,
      includeWriteOnly: true,
      schema: {
        type: 'array',
        maxItems: 999,
        items: {
          type: 'object',
          required: ['name', 'photoUrls'],
          discriminator: {
            propertyName: 'petType',
            mapping: {
              cat: '#/components/schemas/Cat',
              dog: '#/components/schemas/Dog',
              bee: '#/components/schemas/HoneyBee',
            },
          },
          properties: {
            id: {
              description: 'Pet ID',
              example: 0,
              format: 'int64',
              readOnly: true,
              type: 'integer',
            },
            category: {
              description: 'Categories this pet belongs to',
              properties: {
                id: {
                  description: 'Category ID',
                  example: 0,
                  format: 'int64',
                  readOnly: true,
                  type: 'integer',
                },
                name: {
                  description: 'Category name',
                  example: 'string',
                  minLength: 1,
                  type: 'string',
                },
                sub: {
                  description: 'Test Sub Category',
                  properties: {
                    prop1: {
                      description: 'Dumb Property',
                      example: 'string',
                      type: 'string',
                    },
                  },
                  type: 'object',
                },
              },
              type: 'object',
              xml: {
                name: 'Category',
              },
            },
            name: {
              description: 'The name given to a pet',
              example: 'Guru',
              type: 'string',
            },
            photoUrls: {
              description: 'The list of URL to a cute photos featuring pet',
              items: {
                type: 'string',
                format: 'url',
              },
              type: 'array',
              xml: {
                name: 'photoUrl',
                wrapped: true,
              },
            },
            friend: {},
            tags: {
              description: 'Tags attached to the pet',
              items: {
                type: 'object',
                properties: {
                  id: {
                    description: 'Tag ID',
                    example: 0,
                    format: 'int64',
                    readOnly: true,
                    type: 'integer',
                  },
                  name: {
                    description: 'Tag name',
                    example: 'string',
                    minLength: 1,
                    type: 'string',
                  },
                },
                xml: {
                  name: 'Tag',
                },
              },
              type: 'array',
              xml: {
                name: 'tag',
                wrapped: true,
              },
            },
            status: {
              description: 'Pet status in the store',
              enum: ['available', 'pending', 'sold'],
              example: 'available',
              type: 'string',
            },
            petType: {
              description: 'Type of a pet',
              example: 'string',
              type: 'string',
            },
          },
          xml: {
            name: 'Pet',
          },
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });

  it('should generate xml for schemas with an array of items', () => {
    const examples = generateXmlExample({
      schema: {
        type: 'object',
        properties: {
          id: {
            example: 0,
            format: 'int64',
            readOnly: true,
            type: 'integer',
          },
          pet: {
            properties: {
              id: {
                description: 'Pet ID',
                example: 0,
                format: 'int64',
                readOnly: true,
                type: 'integer',
              },
              category: {
                description: 'Categories this pet belongs to',
                properties: {
                  id: {
                    description: 'Category ID',
                    example: 0,
                    format: 'int64',
                    readOnly: true,
                    type: 'integer',
                  },
                  name: {
                    description: 'Category name',
                    example: 'string',
                    minLength: 1,
                    type: 'string',
                  },
                  sub: {
                    description: 'Test Sub Category',
                    properties: {
                      prop1: {
                        description: 'Dumb Property',
                        example: 'string',
                        type: 'string',
                      },
                    },
                    type: 'object',
                  },
                },
                type: 'object',
                xml: {
                  name: 'Category',
                },
              },
              name: {
                description: 'The name given to a pet',
                example: 'Guru',
                type: 'string',
              },
              photoUrls: {
                description: 'The list of URL to a cute photos featuring pet',
                items: {
                  type: 'string',
                  format: 'url',
                },
                type: 'array',
                xml: {
                  name: 'photoUrl',
                  wrapped: true,
                },
              },
              friend: {},
              tags: {
                description: 'Tags attached to the pet',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      description: 'Tag ID',
                      example: 0,
                      format: 'int64',
                      readOnly: true,
                      type: 'integer',
                    },
                    name: {
                      description: 'Tag name',
                      example: 'string',
                      minLength: 1,
                      type: 'string',
                    },
                  },
                  xml: {
                    name: 'Tag',
                  },
                },
                type: 'array',
                xml: {
                  name: 'tag',
                  wrapped: true,
                },
              },
              status: {
                description: 'Pet status in the store',
                enum: ['available', 'pending', 'sold'],
                example: 'available',
                type: 'string',
              },
              petType: {
                description: 'Type of a pet',
                example: 'string',
                type: 'string',
              },
            },
            type: 'object',
            xml: {
              name: 'Pet',
            },
          },
          username: {
            description: 'User supplied username',
            example: 'John78',
            minLength: 4,
            type: 'string',
          },
          firstName: {
            description: 'User first name',
            example: 'John',
            minLength: 1,
            type: 'string',
          },
          lastName: {
            description: 'User last name',
            example: 'Smith',
            minLength: 1,
            type: 'string',
          },
          email: {
            description: 'User email address',
            example: 'john.smith@example.com',
            format: 'email',
            type: 'string',
          },
          password: {
            description:
              'User password, MUST contain a mix of upper and lower case letters, as well as digits',
            example: 'drowssaP123',
            format: 'password',
            minLength: 8,
            pattern: '/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/',
            type: 'string',
          },
          phone: {
            description: 'User phone number in international format',
            example: '+1-202-555-0192',
            pattern: '/^\\+(?:[0-9]-?){6,14}[0-9]$/',
            type: 'string',
          },
          userStatus: {
            description: 'User status',
            example: 0,
            format: 'int32',
            type: 'integer',
          },
          addresses: {
            items: [
              {
                type: 'object',
                properties: {
                  city: {
                    example: 'string',
                    minLength: 0,
                    type: 'string',
                  },
                  country: {
                    example: 'string',
                    minLength: 0,
                    type: 'string',
                  },
                  street: {
                    description: 'includes build/apartment number',
                    example: 'string',
                    minLength: 0,
                    type: 'string',
                  },
                },
              },
              {
                type: 'number',
              },
            ],
            maxLength: 10,
            type: 'array',
          },
        },
        xml: {
          name: 'User',
        },
      },
    });
    examples.forEach(example => {
      expect(example.exampleValue).toMatchSnapshot(example.exampleId);
    });
  });
});
