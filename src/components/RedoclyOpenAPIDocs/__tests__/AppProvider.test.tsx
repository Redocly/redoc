import { render } from '@testing-library/react';

import type { OpenAPIDefinition } from '../../../types';

import { StoreProvider } from '../Providers';

describe('ProStoreProvider', () => {
  test('StoreProvider should run onInit hook', async () => {
    const { findByTestId } = render(
      <StoreProvider
        options={{}}
        definition={
          {
            openapi: '3.0.0',
            info: {
              version: '1.0',
              title: 'Foo',
            },
          } as unknown as OpenAPIDefinition
        }
      >
        <div data-testid="test" />
      </StoreProvider>,
    );

    expect(await findByTestId('test')).toBeInTheDocument();
  });
});
