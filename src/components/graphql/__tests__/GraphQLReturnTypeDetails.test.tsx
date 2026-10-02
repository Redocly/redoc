import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';

import type * as Jotai from 'jotai';
import type { GraphqlTypeRef } from '../../../types/graphql-store.js';

import { GraphQLReturnTypeDetails } from '../GraphQLReturnTypeDetails.js';

const mocks = vi.hoisted(() => ({
  graphqlTypeSlugMapAtom: Symbol('graphqlTypeSlugMapAtom'),
  useAtomValue: vi.fn(),
  normalizeUrl: vi.fn((value: string) => `/n${value}`),
}));

vi.mock('jotai', async (importOriginal) => {
  const jotai = (await importOriginal()) as typeof Jotai;
  return {
    ...jotai,
    useAtomValue: (...args: unknown[]) => mocks.useAtomValue(...args),
  };
});

vi.mock('../../../jotai/graphql.js', () => ({
  graphqlTypeSlugMapAtom: mocks.graphqlTypeSlugMapAtom,
}));

vi.mock('../../../hooks/useNormalizeUrl.js', () => ({
  useNavigationUrlNormalizer: () => mocks.normalizeUrl,
}));

vi.mock('../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (_key: string, defaultValue: string) => defaultValue,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function typeRef(name: string): GraphqlTypeRef {
  return { display: name, name, isList: false, isNonNull: false, isListNonNull: false };
}

describe('GraphQLReturnTypeDetails', () => {
  it('renders a link when the type has a slug', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlTypeSlugMapAtom) return { User: '/types/user' };
      return undefined;
    });

    render(
      <MemoryRouter>
        <GraphQLReturnTypeDetails typeRef={typeRef('User')} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'User' })).toHaveAttribute('href', '/n/types/user');
  });

  it('renders plain text without a link when the type has no slug (hidden built-in scalar)', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlTypeSlugMapAtom) return {};
      return undefined;
    });

    render(
      <MemoryRouter>
        <GraphQLReturnTypeDetails typeRef={typeRef('String')} />
      </MemoryRouter>,
    );

    expect(screen.getByText('String')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
