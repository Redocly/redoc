import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { OpenAPIDefinition } from '../../../types';
import type { OperationModel } from '../../../models';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getSchema } from '../../../models';
import oneOfWithDiscriminator from './fixtures/oneOfWithDiscriminator.json';
import { Schema } from '../Schema';

const options = normalizeOptions({});
describe('OneOfSchema', () => {
  it('should render correct oneOf and discriminator based on deep link', () => {
    const parser = new OpenAPIParser(
      oneOfWithDiscriminator as OpenAPIDefinition,
      undefined,
      options,
    );

    const schema = getSchema({
      parser,
      schemaOrRef: { $ref: '#/components/schemas/OneOfSchema' },
      pointer: '',
      options,
      deps: {
        operation: {
          pointer: '/paths/schema',
        } as OperationModel,
      },
      absolutePointer: '/paths/schema',
    });

    history.pushState(
      {},
      '',
      'user/createuser#user/createuser/t=request&path=pet&oneof=1&d=1&oneof=0',
    );

    const { getByText } = render(<Schema schema={schema} />, {
      wrapper: BrowserRouter,
    });

    expect(getByText('Type of the shape - Shape')).toBeInTheDocument();
    expect(getByText('Whether or not the triangle is equilateral')).toBeInTheDocument();
    expect(getByText('Perimeter of the Equilateral')).toBeInTheDocument();
  });
});
