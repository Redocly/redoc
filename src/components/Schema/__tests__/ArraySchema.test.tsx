import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models/index.js';
import type { OpenAPIDefinition } from '../../../types/index.js';

import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getSchema } from '../../../models/index.js';
import schemasExpansionLevel from './fixtures/schemaExpansionLevel.json';
import { Schema } from '../Schema.js';
import { TestBrowserRouter } from '../../../testProviders.js';

const options = normalizeOptions({});

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('ArraySchema', () => {
  it("should render Schema with Array when schemasExpansionLevel is 'all'", async () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
      normalizeOptions({ schemasExpansionLevel: 'all' }),
    );
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
      wrapper: TestBrowserRouter,
    });

    expect(getByText('Dumb Property 3')).toBeInTheDocument();
  });

  it("should render Schema with Array when schemasExpansionLevel is '3'", async () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
      normalizeOptions({ schemasExpansionLevel: '3' }),
    );
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
      wrapper: TestBrowserRouter,
    });

    expect(getByText('Dumb Property 1')).toBeInTheDocument();
    expect(queryByText('Dumb Property 2')).toBeInTheDocument();
  });

  it('should automatically expand nested array when parent element is expanded', async () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
      normalizeOptions({ schemasExpansionLevel: '4' }),
    );
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
      wrapper: TestBrowserRouter,
    });

    expect(getByText('Dumb Property 1 in nested array')).toBeInTheDocument();
  });

  it("should not render inner Schema with Array when schemasExpansionLevel is '0'", async () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
      normalizeOptions({ schemasExpansionLevel: '0' }),
    );
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
      wrapper: TestBrowserRouter,
    });

    expect(queryByText('Dumb Property')).toBeNull();
  });
});
