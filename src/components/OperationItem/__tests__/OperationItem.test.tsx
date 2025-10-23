import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { OperationMenuItem } from '../../../models';

import { OperationItem } from '../OperationItem';
import { normalizeOptions } from '../../../services';
import spec from './fixtures/petstore.json';
import definition from './fixtures/operationDefinition.json';
import { globalStoreAtom } from '../../../jotai/store';
import { MockIntersectionObserver } from './__mocks__/mock-intersection-observer';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn((a) => {
    if (a === globalStoreAtom) {
      return {
        parser: {
          definition: spec,
        },
        options: normalizeOptions({
          codeSamples: {
            languages: [{ lang: 'curl', label: 'curl' }],
          },
        }),
      };
    }
    return {};
  }),
  useAtom: jest.fn(() => {
    return [
      {
        activeOneOf: { '/paths/~1pet/post': 0 },
        requestValues: {},
        request: { expandedFields: {} },
        response: { expandedFields: {} },
        activeLanguage: 'curl',
      },
      jest.fn(),
    ];
  }),
}));

describe('OperationItem', () => {
  beforeAll(() => {
    window.IntersectionObserver = MockIntersectionObserver;
  });

  it('should render badges with correct position', () => {
    const { getByTestId } = render(
      <OperationItem
        item={
          {
            operationDefinition: definition,
            parent: undefined,
            href: 'test',
          } as OperationMenuItem
        }
      />,
      {
        wrapper: BrowserRouter,
      },
    );

    const parentElement = getByTestId('operation-item-header');
    const childNodes = parentElement.childNodes;

    expect(childNodes[1].textContent).toBe('Alpha');
    expect(childNodes[3].textContent).toBe('Beta');
    expect(childNodes[4].textContent).toBe('Gamma');
  });
});
