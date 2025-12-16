import { render, screen } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models/index.js';

import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { FieldDetails } from '../FieldDetails.js';
import { getField } from '../../../models/index.js';
import spec from './fixtures/fields.json';
import { TestBrowserRouter } from '../../../testProviders.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('FieldDetails', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(
    spec as unknown as ConstructorParameters<typeof OpenAPIParser>[0],
    undefined,
    options,
  );
  const deps = { operation: { pointer: 'defaultPointer' } as OperationModel };
  vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(options);

  it('should render FieldDetails with enum', async () => {
    (options as unknown as Record<string, unknown>).showAccessMode = true;
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
    render(<FieldDetails field={field} />, { wrapper: TestBrowserRouter });

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
    render(<FieldDetails field={field} />, { wrapper: TestBrowserRouter });

    expect(screen.getByText('Enum Value')).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('Description foo')).toBeInTheDocument();
    expect(screen.getByText('Description bar')).toBeInTheDocument();
  });

  it('should render FieldDetails with enum and x-enumDescription with hiding value', async () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(
      normalizeOptions({ maxDisplayedEnumValues: 1 }),
    );
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
    render(<FieldDetails field={field} />, { wrapper: TestBrowserRouter });

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

    render(<FieldDetails field={field} />, { wrapper: TestBrowserRouter });

    const descriptions = screen.queryAllByText('This is a test anyOf schema with description');
    expect(descriptions).toHaveLength(0);

    const plainTextDescriptions = screen.queryAllByText('A plain text value');
    expect(plainTextDescriptions).toHaveLength(0);

    const numberDescriptions = screen.queryAllByText('A number value');
    expect(numberDescriptions).toHaveLength(0);
  });
});
