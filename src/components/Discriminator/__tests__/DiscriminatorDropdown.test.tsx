import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models/index.js';

import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getSchema } from '../../../models/index.js';
import { Schema } from '../../Schema/index.js';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';
import * as discriminatorWithDefaultFixture from '../../../models/__tests__/fixtures/discriminator-with-default-mapping.json';
import { TestBrowserRouter } from '../../../testProviders.js';

const options = normalizeOptions({});

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('DiscriminatorDropdown', () => {
  vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(options);
  const parser = new OpenAPIParser(simpleDiscriminatorFixture, undefined, options);
  const schema = getSchema({
    parser,
    schemaOrRef: { $ref: '#/components/schemas/Pet' },
    pointer: '#/components/schemas/Pet',
    options,
    deps: { operation: { pointer: 'defaultPointer' } as OperationModel },
  });

  describe('discriminator', () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue({
      activeOneOf: {
        '#/components/schemas/Pet': 0,
      },
    });

    it('should correctly render SchemaView', () => {
      const { getByText } = render(<Schema schema={schema} />, {
        wrapper: TestBrowserRouter,
      });

      expect(getByText('type')).toBeInTheDocument();
      expect(getByText('C̵a̵t̵ (deprecated)')).toBeInTheDocument();
    });
  });

  describe('discriminator with defaultMapping', () => {
    const parserWithDefault = new OpenAPIParser(
      discriminatorWithDefaultFixture,
      undefined,
      options,
    );
    const schemaWithDefault = getSchema({
      parser: parserWithDefault,
      schemaOrRef: { $ref: '#/components/schemas/Pet' },
      pointer: '#/components/schemas/Pet',
      options,
      deps: { operation: { pointer: 'defaultPointer' } as OperationModel },
    });

    it('schema has correct oneOf structure with defaultMapping', () => {
      expect(schemaWithDefault.oneOf).toHaveLength(3);
      expect(schemaWithDefault.oneOf?.[0].title).toBe('cat');
      expect(schemaWithDefault.oneOf?.[0].isDefaultMapping).toBe(false);
      expect(schemaWithDefault.oneOf?.[1].title).toBe('dog');
      expect(schemaWithDefault.oneOf?.[1].isDefaultMapping).toBe(false);
      expect(schemaWithDefault.oneOf?.[2].title).toBe('Default mapping');
      expect(schemaWithDefault.oneOf?.[2].isDefaultMapping).toBe(true);
    });

    it('finds correct defaultMappingIdx', () => {
      const defaultMappingIdx = schemaWithDefault.oneOf?.findIndex(
        (subSchema) => subSchema.isDefaultMapping,
      );
      expect(defaultMappingIdx).toBe(2);
    });
  });
});
