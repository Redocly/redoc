import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models';
import type { OpenAPIDefinition } from '../../../types';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getSchema } from '../../../models';
import schemasExpansionLevel from './fixtures/schemaExpansionLevel.json';
import requiredField from './fixtures/requiredField.json';
import { Schema } from '../Schema';

const options = normalizeOptions({});

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('ObjectSchema', () => {
  it("should render Schema when schemasExpansionLevel is 'all'", async () => {
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
      schemaOrRef: schemasExpansionLevel.components.schemas.Pet,
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

    expect(getByText('Dumb Property 6')).toBeInTheDocument();
  });

  it("should render Schema when schemasExpansionLevel is '3'", async () => {
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
      schemaOrRef: schemasExpansionLevel.components.schemas.Pet,
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

    expect(getByText('Dumb Property 3')).toBeInTheDocument();
    expect(queryByText('Dumb Property 4')).toBeNull();
  });

  it("should not render inner Schema when schemasExpansionLevel is '0'", async () => {
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
      schemaOrRef: schemasExpansionLevel.components.schemas.Pet,
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

    expect(queryByText('Test Sub Category')).toBeNull();
  });

  it("should render Schema when required is 'category' -> 'sub'", async () => {
    jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(normalizeOptions({}));
    const parser = new OpenAPIParser(requiredField as OpenAPIDefinition, undefined, options);

    const schema = getSchema({
      parser,
      schemaOrRef: requiredField.components.schemas.Pet,
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

    expect(getByText('Dumb Property 2')).toBeInTheDocument();
    expect(queryByText('Dumb Property 3')).toBeNull();
  });

  it("should render Schema when required is 'tags' -> 'sub' at Array schema", async () => {
    jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(normalizeOptions({}));
    const parser = new OpenAPIParser(requiredField as OpenAPIDefinition, undefined, options);

    const schema = getSchema({
      parser,
      schemaOrRef: requiredField.components.schemas.User,
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
    expect(queryByText('Dumb Property 2')).toBeNull();
  });
});
