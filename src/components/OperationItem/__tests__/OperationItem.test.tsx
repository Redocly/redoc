import { render } from '@testing-library/react';

import type { OperationMenuItem } from '../../../models/index.js';

import { OperationItem } from '../OperationItem.js';
import { normalizeOptions } from '../../../services/index.js';
import spec from './fixtures/petstore.json';
import definition from './fixtures/operationDefinition.json';
import { globalStoreAtom } from '../../../jotai/store.js';
import { MockIntersectionObserver } from './__mocks__/mock-intersection-observer.js';
import { TestBrowserRouter } from '../../../testProviders.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn((a) => {
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
  useAtom: vi.fn(() => {
    return [
      {
        activeOneOf: { '/paths/~1pet/post': 0 },
        requestValues: {},
        request: { expandedFields: {} },
        response: { expandedFields: {} },
        activeLanguage: 'curl',
      },
      vi.fn(),
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
        wrapper: TestBrowserRouter,
      },
    );

    const parentElement = getByTestId('operation-item-header');
    const childNodes = parentElement.childNodes;

    expect(childNodes[1].textContent).toBe('Alpha');
    expect(childNodes[3].textContent).toBe('Beta');
    expect(childNodes[4].textContent).toBe('Gamma');
  });
});
