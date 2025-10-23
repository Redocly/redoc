import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getSchema } from '../../../models';
import { Schema } from '../../Schema';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';

const options = normalizeOptions({});

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('DiscriminatorDropdown', () => {
  jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(options);
  const parser = new OpenAPIParser(simpleDiscriminatorFixture, undefined, options);
  const schema = getSchema({
    parser,
    schemaOrRef: { $ref: '#/components/schemas/Pet' },
    pointer: '#/components/schemas/Pet',
    options,
    deps: { operation: { pointer: 'defaultPointer' } as OperationModel },
  });

  describe('discriminator', () => {
    jest.spyOn(Jotai, 'useAtomValue').mockReturnValue({
      activeOneOf: {
        '#/components/schemas/Pet': 0,
      },
    });

    it('should correctly render SchemaView', () => {
      const { getByText } = render(<Schema schema={schema} />, {
        wrapper: BrowserRouter,
      });

      expect(getByText('type')).toBeInTheDocument();
      expect(getByText('C̵a̵t̵ (deprecated)')).toBeInTheDocument();
    });
  });
});
