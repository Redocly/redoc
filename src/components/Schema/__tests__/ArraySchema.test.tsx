import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models';
import type { OpenAPIDefinition } from '../../../types';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getSchema } from '../../../models';
import schemasExpansionLevel from './fixtures/schemaExpansionLevel.json';
import { Schema } from '../Schema';

const options = normalizeOptions({});

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('ArraySchema', () => {
  it("should render Schema with Array when schemasExpansionLevel is 'all'", async () => {
    jest
      .spyOn(Jotai, 'useAtomValue')
      .mockReturnValue(normalizeOptions({ schemasExpansionLevel: 'all' }));
    const parser = new OpenAPIParser(
      schemasExpansionLevel as OpenAPIDefinition,
      undefined,
      options,
    );

    const schema = getSchema({
      parser,
      schemaOrRef: schemasExpansionLevel.components.schemas.User,
      pointer: '',
      options,
      deps: {
        operation: {
          pointer: 'schemasExpansionLevel',
        } as OperationModel,
      },
    });

    const { getByText } = render(<Schema schema={schema} />, {
      wrapper: BrowserRouter,
    });

    expect(getByText('Dumb Property 3')).toBeInTheDocument();
  });

  it("should render Schema with Array when schemasExpansionLevel is '3'", async () => {
    jest
      .spyOn(Jotai, 'useAtomValue')
      .mockReturnValue(normalizeOptions({ schemasExpansionLevel: '3' }));
    const parser = new OpenAPIParser(
      schemasExpansionLevel as OpenAPIDefinition,
      undefined,
      options,
    );

    const schema = getSchema({
      parser,
      schemaOrRef: schemasExpansionLevel.components.schemas.User,
      pointer: '',
      options,
      deps: {
        operation: {
          pointer: 'schemasExpansionLevel',
        } as OperationModel,
      },
    });

    const { getByText, queryByText } = render(<Schema schema={schema} />, {
      wrapper: BrowserRouter,
    });

    expect(getByText('Dumb Property 1')).toBeInTheDocument();
    expect(queryByText('Dumb Property 2')).toBeInTheDocument();
  });

  it('should automatically expand nested array when parent element is expanded', async () => {
    jest
      .spyOn(Jotai, 'useAtomValue')
      .mockReturnValue(normalizeOptions({ schemasExpansionLevel: '4' }));
    const parser = new OpenAPIParser(
      schemasExpansionLevel as OpenAPIDefinition,
      undefined,
      options,
    );

    const schema = getSchema({
      parser,
      schemaOrRef: schemasExpansionLevel.components.schemas.User,
      pointer: '',
      options,
      deps: {
        operation: {
          pointer: 'schemasExpansionLevel',
        } as OperationModel,
      },
    });

    const { getByText } = render(<Schema schema={schema} />, {
      wrapper: BrowserRouter,
    });

    expect(getByText('Dumb Property 1 in nested array')).toBeInTheDocument();
  });

  it("should not render inner Schema with Array when schemasExpansionLevel is '0'", async () => {
    jest
      .spyOn(Jotai, 'useAtomValue')
      .mockReturnValue(normalizeOptions({ schemasExpansionLevel: '0' }));
    const parser = new OpenAPIParser(
      schemasExpansionLevel as OpenAPIDefinition,
      undefined,
      options,
    );

    const schema = getSchema({
      parser,
      schemaOrRef: schemasExpansionLevel.components.schemas.User,
      pointer: '',
      options,
      deps: {
        operation: {
          pointer: 'schemasExpansionLevel',
        } as OperationModel,
      },
    });

    const { queryByText } = render(<Schema schema={schema} />, {
      wrapper: BrowserRouter,
    });

    expect(queryByText('Dumb Property')).toBeNull();
  });
});
