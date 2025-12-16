import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OperationModel } from '../../../models/index.js';

import { ResponseDetails } from '../ResponseDetails.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getField, getMediaContent } from '../../../models/index.js';
import { globalOptionsAtom, globalStoreAtom } from '../../../jotai/store.js';
import { activeMimeNameAtom } from '../../../jotai/app.js';
import { TestMemoryRouter } from '../../../testProviders.js';

const info = {
  'application/json': {
    schema: {
      additionalProperties: {
        format: 'int32',
      },
    },
    examples: {
      bee: {
        mime: 'application/json',
        value: {
          category: {
            id: 0,
            name: 'string',
          },
          honeyPerDay: 3.14,
          id: 0,
          petType: 'bee',
          status: 'available',
        },
      },
      cat: {
        mime: 'application/json',
        value: {
          category: {
            id: 0,
            name: 'string',
          },
          huntingSkill: 'adventurous',
          id: 0,
          petType: 'cat',
          status: 'available',
        },
      },
    },
  },
  'application/xml': {
    schema: {
      additionalProperties: {
        format: 'int32',
      },
    },
  },
};
const options = normalizeOptions({});
const parser = new OpenAPIParser(
  { openapi: '3.0', info: { title: 'test', version: '0' }, paths: {} },
  undefined,
  options,
);

const response = {
  expanded: false,
  code: '200',
  summary: `summary`,
  description: `***\n**su*mm*ary**\n[link](/link)`,
  type: 'GET',
  headers: [
    getField(
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
      { operation: {} as OperationModel },
    ),
  ],
  toggle: vi.fn(),
  expand: vi.fn(),
  content: getMediaContent({
    parser,
    info,
    isRequestType: true,
    options,
    data: { operation: {} as OperationModel },
  }),
};

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('ResponseDetails component', () => {
  vi.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
    if (atom === globalOptionsAtom) {
      return options;
    }

    if (atom === globalStoreAtom) return { options, parser };
    if (atom === activeMimeNameAtom) return ['application/json', vi.fn()];
    return {};
  });

  it('should renders correctly', () => {
    const { container } = render(
      <TestMemoryRouter>
        <ResponseDetails response={response} operationId=" " />
      </TestMemoryRouter>,
    );
    expect(container.childNodes.length).toEqual(5);
  });

  it('should render description as markdown', () => {
    const expectedTags = ['p'];
    const { container } = render(
      <TestMemoryRouter>
        <ResponseDetails response={{ ...response, headers: [] }} operationId="" />
      </TestMemoryRouter>,
    );
    const markdownContainer = container.querySelector('.redoc-markdown');

    expect(markdownContainer?.querySelectorAll(expectedTags.join(','))).toHaveLength(
      expectedTags.length,
    );
  });
});
