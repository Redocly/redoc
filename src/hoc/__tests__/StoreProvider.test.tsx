import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import '@testing-library/jest-dom/vitest';
import { schemaKind } from '../../types/common.js';

import type { ApiStore } from '../../types/store.js';
import type { OpenAPIDefinition } from '../../types/openapi.js';

import { StoreProvider } from '../withStoreProvider.js';
import { storeAtom } from '../../jotai/store.js';

function StoreInspector() {
  const store = useAtomValue(storeAtom);
  return (
    <div>
      <span data-testid="has-schema-store">{String(!!store.schemaStore)}</span>
      <span data-testid="has-example-store">{String(!!store.exampleStore)}</span>
      <span data-testid="schema-keys">{Object.keys(store.schemaStore).join(',')}</span>
      <span data-testid="example-keys">{Object.keys(store.exampleStore).join(',')}</span>
    </div>
  );
}

const EMPTY_STORE: ApiStore = {
  schemaStore: {},
  exampleStore: {},
  securitySchemeStore: {},
};

describe('StoreProvider', () => {
  it('renders children with apiStore', () => {
    render(
      <StoreProvider apiStore={EMPTY_STORE} options={{ specType: 'openapi' }}>
        <div data-testid="child" />
      </StoreProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides apiStore to jotai context', () => {
    const apiStore: ApiStore = {
      schemaStore: {
        'components/schemas/Pet': {
          id: 'components/schemas/Pet',
          kind: schemaKind.JSON_SCHEMA,
          data: { type: 'object' },
        },
      },
      exampleStore: {
        'components/examples/PetExample': {
          id: 'components/examples/PetExample',
          value: { name: 'Fido' },
          description: 'A pet example',
        },
      },
      securitySchemeStore: {},
    };

    render(
      <StoreProvider apiStore={apiStore} options={{ specType: 'openapi' }}>
        <StoreInspector />
      </StoreProvider>,
    );

    expect(screen.getByTestId('has-schema-store')).toHaveTextContent('true');
    expect(screen.getByTestId('has-example-store')).toHaveTextContent('true');
    expect(screen.getByTestId('schema-keys')).toHaveTextContent('components/schemas/Pet');
    expect(screen.getByTestId('example-keys')).toHaveTextContent('components/examples/PetExample');
  });

  it('builds store from definition when apiStore is not provided', () => {
    const definition = {
      openapi: '3.0.0',
      info: { version: '1.0', title: 'Test', description: '' },
      paths: {},
      components: {
        schemas: {
          Cat: { type: 'object', properties: { name: { type: 'string' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    render(
      <StoreProvider definition={definition} options={{ specType: 'openapi' }}>
        <StoreInspector />
      </StoreProvider>,
    );

    expect(screen.getByTestId('has-schema-store')).toHaveTextContent('true');
    expect(screen.getByTestId('schema-keys')).toHaveTextContent('components/schemas/Cat');
  });

  it('throws when neither apiStore nor definition is provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <StoreProvider options={{ specType: 'openapi' }}>
          <div />
        </StoreProvider>,
      ),
    ).toThrow('StoreProvider requires either apiStore or definition');

    consoleSpy.mockRestore();
  });

  it('prefers apiStore over definition when both are provided', () => {
    const apiStore: ApiStore = {
      schemaStore: {
        'my-custom-key': {
          id: 'my-custom-key',
          kind: schemaKind.JSON_SCHEMA,
          data: { type: 'string' },
        },
      },
      exampleStore: {},
      securitySchemeStore: {},
    };

    const definition = {
      openapi: '3.0.0',
      info: { version: '1.0', title: 'Test', description: '' },
      paths: {},
      components: { schemas: { FromDefinition: { type: 'object' } } },
    } as unknown as OpenAPIDefinition;

    render(
      <StoreProvider apiStore={apiStore} definition={definition} options={{ specType: 'openapi' }}>
        <StoreInspector />
      </StoreProvider>,
    );

    expect(screen.getByTestId('schema-keys')).toHaveTextContent('my-custom-key');
  });

  it('renders without unstable_hooks', () => {
    render(
      <StoreProvider apiStore={EMPTY_STORE} options={{ specType: 'openapi' }}>
        <div data-testid="child" />
      </StoreProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
