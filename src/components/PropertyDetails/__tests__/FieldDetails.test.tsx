import { render, screen } from '@testing-library/react';
import * as Jotai from 'jotai';
import { BrowserRouter } from 'react-router-dom';

import type { OperationModel } from '../../../models';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { FieldDetails } from '../FieldDetails';
import { getField } from '../../../models';
import spec from './fixtures/fields.json';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('FieldDetails', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(spec, undefined, options);
  const deps = { operation: { pointer: 'defaultPointer' } as OperationModel };
  jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(options);

  it('should render FieldDetails with enum', async () => {
    options.showAccessMode = true;
    const field = getField(
      parser,
      {
        name: 'test',
        in: 'path',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/testProperties/fieldWithEnum',
            },
          },
        },
      },
      '',
      options,
      deps,
    );
    render(<FieldDetails field={field} />, { wrapper: BrowserRouter });

    expect(screen.getByText('Enum')).toBeInTheDocument();
    expect(screen.getByText('"foo"')).toBeInTheDocument();
    expect(screen.getByText('"bar"')).toBeInTheDocument();
  });

  it('should render FieldDetails with enum and x-enumDescriptions', async () => {
    const field = getField(
      parser,
      {
        name: 'test',
        in: 'path',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/testProperties/fieldWithEnumDescription',
            },
          },
        },
      },
      '',
      options,
      deps,
    );
    render(<FieldDetails field={field} />, { wrapper: BrowserRouter });

    expect(screen.getByText('Enum Value')).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('Description foo')).toBeInTheDocument();
    expect(screen.getByText('Description bar')).toBeInTheDocument();
  });

  it('should render FieldDetails with enum and x-enumDescription with hiding value', async () => {
    jest
      .spyOn(Jotai, 'useAtomValue')
      .mockReturnValue(normalizeOptions({ maxDisplayedEnumValues: 1 }));
    const field = getField(
      parser,
      {
        name: 'test',
        in: 'path',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/testProperties/fieldWithEnumDescription',
            },
          },
        },
      },
      '',
      options,
      deps,
    );
    render(<FieldDetails field={field} />, { wrapper: BrowserRouter });

    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('Description foo')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('should not render duplicate descriptions for anyOf schemas', async () => {
    const field = getField(
      parser,
      {
        name: 'testAnyOf',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/anyOfSchemaWithDescription',
            },
          },
        },
      },
      '',
      options,
      deps,
    );

    render(<FieldDetails field={field} />, { wrapper: BrowserRouter });

    const descriptions = screen.queryAllByText('This is a test anyOf schema with description');
    expect(descriptions).toHaveLength(0);

    const plainTextDescriptions = screen.queryAllByText('A plain text value');
    expect(plainTextDescriptions).toHaveLength(0);

    const numberDescriptions = screen.queryAllByText('A number value');
    expect(numberDescriptions).toHaveLength(0);
  });
});
