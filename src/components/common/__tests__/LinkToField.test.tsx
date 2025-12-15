import type { Deps, OperationModel } from '../../../models/index.js';

import { generateDeepLink } from '../LinkToField.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getField } from '../../../models/index.js';
import spec from './fixtures/simpleOpenAPI.json';
import type { OpenAPIDefinition } from '../../../types/index.js';

const options = normalizeOptions({});

describe('generateDeepLink', () => {
  const parser = new OpenAPIParser(spec as unknown as OpenAPIDefinition, undefined, options);
  const deps = {
    type: 'request',
    operation: {
      id: 'paths/~1pets/post',
      pointer: '/paths/~1pets/post',
      href: '/paths/~1pets/post',
    } as OperationModel,
  } as Deps;
  const field = getField(
    parser,
    {
      name: 'name',
      required: false,
      schema: {
        type: 'string',
      },
    },
    '/properties/name',
    options,
    deps,
  );

  it('generates a deep link for a field without an operation', () => {
    const field = getField(
      parser,
      {
        name: 'name',
        required: false,
        schema: {
          type: 'string',
        },
      },
      '/properties/name',
      options,
      { ...deps, operation: {} } as Deps,
    );
    const deepLink = generateDeepLink(field);
    expect(deepLink).toBe('#t=request&path=name');
  });

  it('generates a deep link with the default deepLinkPrefix', () => {
    const deepLink = generateDeepLink(field);
    expect(deepLink).toBe('/paths/~1pets/post#paths/~1pets/post/t=request&path=name');
  });
});
