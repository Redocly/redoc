import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { OpenAPIDefinition } from '../../../types';
import type { OperationModel } from '../../../models';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getSchema } from '../../../models';
import oneOfWithDiscriminator from './fixtures/oneOfWithDiscriminator.json';
import { Schema } from '../Schema';

const options = normalizeOptions({});
describe('SchemaView', () => {
  describe('OneOf', () => {
    it('should render oneOf with a discriminator without affecting each other', () => {
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

      const { getByText } = render(<Schema schema={schema} />, {
        wrapper: BrowserRouter,
      });
      expect(getByText('Shape')).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByText('Shape'));
      });

      expect(getByText('Discriminator')).toBeInTheDocument();
      expect(getByText('square')).toBeInTheDocument();
      expect(getByText('triangle')).toBeInTheDocument();
      expect(getByText('sideLength')).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByText('triangle'));
      });

      expect(getByText('equilateral')).toBeInTheDocument();
      expect(getByText('Whether or not the triangle is equilateral')).toBeInTheDocument();
    });
  });
});
