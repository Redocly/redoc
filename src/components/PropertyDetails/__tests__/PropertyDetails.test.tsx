import { render, fireEvent, screen, act } from '@testing-library/react';
import * as Jotai from 'jotai';
import { BrowserRouter } from 'react-router-dom';

import type { OperationModel } from '../../../models';

import { PropertyDetails } from '../PropertyDetails';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getField } from '../../../models';
import spec from './fixtures/fields.json';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('Components', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(spec, undefined, options);
  const deps = { operation: { pointer: 'defaultPointer' } as OperationModel };
  jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(options);

  it('should render FieldDetails without duplicate content', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/schemas/primitiveSchema',
      },
      '',
      options,
      deps,
    );
    render(<PropertyDetails field={field} />, {
      wrapper: BrowserRouter,
    });
    const occurrences = screen.getAllByText('any');

    expect(occurrences.length).toBe(1);
  });

  it('should render FieldDetails with object schema', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/objectSchema',
      },
      '',
      options,
      deps,
    );

    const { getAllByText, getByRole, queryByText, getByText } = render(
      <PropertyDetails field={field} />,
      {
        wrapper: BrowserRouter,
      },
    );

    expect(queryByText('Show 2 properties')).not.toBeNull();
    act(() => {
      queryByText('Show 2 properties').click();
    });
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(getAllByText('string').length).toBe(2);

    act(() => {
      fireEvent.click(getByRole('button'));
    });

    expect(getAllByText('Show 2 properties').length).toBe(1);
  });

  it('should render FieldDetails with Array of string schema', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/arraySchema',
        name: 'test',
      },
      '',
      options,
      deps,
    );

    const { getByText } = render(<PropertyDetails field={field} />, {
      wrapper: BrowserRouter,
    });
    expect(getByText('Array of strings')).toBeInTheDocument();
  });

  it('should render FieldDetails with Array of object schema', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/arrayOfObjectsSchema',
        name: 'test',
      },
      '',
      options,
      deps,
    );

    const { getByText, getByRole, container } = render(
      <PropertyDetails field={field} level={2} />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(getByText('Array of objects')).toBeInTheDocument();
    expect(getByText('Show 2 array properties')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('button'));
    });
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(container.textContent.includes('test[].\u200Bname')).toBe(true);
    expect(container.textContent.includes('test[].\u200Bstatus')).toBe(true);
  });

  it('should render FieldDetails with oneOf schema with object schema', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/oneOfSchemaWithObjectSchema',
        name: 'test',
      },
      '',
      options,
      deps,
    );

    const { getByText, getByRole, container } = render(
      <PropertyDetails field={field} level={2} />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(getByText('Show 2 properties')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('button'));
    });
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(container.textContent.includes('test.\u200Bname')).toBe(true);
    expect(container.textContent.includes('test.\u200Bstatus')).toBe(true);
  });

  it('should render FieldDetails with a oneOf schema at the first level without nesting', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/oneOfSchemaWithObjectSchema',
        name: 'test',
      },
      '',
      options,
      deps,
    );

    const { getByText, getByRole, container } = render(
      <PropertyDetails field={field} level={2} />,
      {
        wrapper: BrowserRouter,
      },
    );
    expect(getByText('Show 2 properties')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('button'));
    });
    expect(getByText('status')).toBeInTheDocument();
    expect(getByText('name')).toBeInTheDocument();
    expect(container.textContent.includes('test.\u200Bname')).toBe(true);
    expect(container.textContent.includes('test.\u200Bstatus')).toBe(true);
  });

  it('the read-only field should be displayed', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/testProperties/readOnlyInSchema',
      },
      '',
      options,
      deps,
    );
    const { container } = render(<PropertyDetails field={field} />, {
      wrapper: BrowserRouter,
    });
    expect(container).toHaveTextContent(/read-only/);
  });
  it('the write-only field should be displayed', () => {
    const field = getField(
      parser,
      {
        $ref: '#/components/testProperties/writeOnlyInSchema',
      },
      '',
      options,
      deps,
    );
    const { container } = render(<PropertyDetails field={field} />, {
      wrapper: BrowserRouter,
    });

    expect(container).toHaveTextContent(/write-only/);
  });

  describe('PropertyDetails', () => {
    it('PropertyDetails with read-only should renders correctly', () => {
      options.showAccessMode = true;
      const field = getField(
        parser,
        {
          $ref: '#/components/testProperties/readOnlyInSchema',
        },
        '',
        options,
        deps,
      );
      const { container } = render(<PropertyDetails field={field} />, {
        wrapper: BrowserRouter,
      });
      expect(container).toHaveTextContent(/read-only/);
    });

    it('Field with write-only should renders correctly', () => {
      options.showAccessMode = true;
      const field = getField(
        parser,
        {
          $ref: '#/components/testProperties/writeOnlyInSchema',
        },
        '',
        options,
        deps,
      );
      const { container } = render(<PropertyDetails field={field} />, {
        wrapper: BrowserRouter,
      });

      expect(container).toHaveTextContent(/write-only/);
    });

    it('Fields with read-only and write-only in content should renders correctly', async () => {
      options.showAccessMode = true;
      const field = getField(
        parser,
        {
          name: 'test',
          in: 'path',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/testProperties/readOnlyInContent',
              },
            },
          },
        },
        '',
        options,
        deps,
      );
      const { container } = render(<PropertyDetails field={field} />, {
        wrapper: BrowserRouter,
      });
      fireEvent.click(await screen.findByRole('button'));
      expect(container).toHaveTextContent(/read-only/);
    });
  });
});
