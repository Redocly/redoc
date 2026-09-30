import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';

import type { ReferencesNode } from '../../../types/content.js';
import type * as Jotai from 'jotai';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { panelKind } from '../../../types/common.js';
import { ReferencesPanelItem } from '../ReferencesPanelItem.js';

const mocks = vi.hoisted(() => ({
  graphqlReferenceMapAtom: Symbol('graphqlReferenceMapAtom'),
  graphqlTypeSlugMapAtom: Symbol('graphqlTypeSlugMapAtom'),
  graphqlTypeLookupAtom: Symbol('graphqlTypeLookupAtom'),
  typeLookup: vi.fn((name: string) => (name === 'User' ? { variant: 'object' } : undefined)),
  useAtomValue: vi.fn(),
  normalizeUrl: vi.fn((value: string) => `/n${value}`),
}));

vi.mock('jotai', async (importOriginal) => {
  const jotai = (await importOriginal()) as typeof Jotai;
  return {
    ...jotai,
    useAtomValue: (...args: unknown[]) =>
      args[0] === mocks.graphqlTypeLookupAtom ? mocks.typeLookup : mocks.useAtomValue(...args),
  };
});

vi.mock('../../../jotai/graphql.js', () => ({
  graphqlReferenceMapAtom: mocks.graphqlReferenceMapAtom,
  graphqlTypeSlugMapAtom: mocks.graphqlTypeSlugMapAtom,
  graphqlTypeLookupAtom: mocks.graphqlTypeLookupAtom,
}));

vi.mock('../../../hooks/useNormalizeUrl.js', () => ({
  useNavigationUrlNormalizer: () => mocks.normalizeUrl,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ReferencesPanelItem', () => {
  it('renders references from node payload', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlReferenceMapAtom) return {};
      if (atom === mocks.graphqlTypeSlugMapAtom) return { User: '/types/user' };
      return undefined;
    });

    const node = {
      kind: panelKind.REFERENCES,
      title: 'References',
      children: [
        {
          kind: panelKind.REFERENCES,
          references: [{ name: 'User', pointer: '#/types/User', field: 'email' }],
        },
      ],
    } as ReferencesNode;

    render(
      <MemoryRouter>
        <ReferencesPanelItem node={node} />
      </MemoryRouter>,
    );

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'User' })).toHaveAttribute('href', '/n/types/user');
    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      '/n/types/user#User-email',
    );
  });

  it('uses graphql reference map for graphql type name', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlReferenceMapAtom) {
        return { User: [{ name: 'Query', field: 'user' }] };
      }
      if (atom === mocks.graphqlTypeSlugMapAtom) return { Query: '/types/query' };
      return undefined;
    });

    const node = {
      kind: panelKind.REFERENCES,
      title: 'References',
      children: [
        {
          kind: panelKind.REFERENCES,
          graphqlTypeName: 'User',
          references: [],
        },
      ],
    } as ReferencesNode;

    render(
      <MemoryRouter>
        <ReferencesPanelItem node={node} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Query' })).toHaveAttribute('href', '/n/types/query');
    expect(screen.getByRole('link', { name: 'user' })).toHaveAttribute(
      'href',
      '/n/types/query#Query-user',
    );
  });

  it('skips references whose type has no slug but keeps the panel heading', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlReferenceMapAtom) return {};
      if (atom === mocks.graphqlTypeSlugMapAtom) return { User: '/types/user' };
      return undefined;
    });

    const node = {
      kind: panelKind.REFERENCES,
      title: 'References',
      children: [
        {
          kind: panelKind.REFERENCES,
          references: [
            { name: 'User', pointer: '#/types/User', field: 'email' },
            { name: 'HiddenType', pointer: '#/types/HiddenType', field: 'id' },
          ],
        },
      ],
    } as ReferencesNode;

    render(
      <MemoryRouter>
        <ReferencesPanelItem node={node} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'User' })).toBeInTheDocument();
    expect(screen.queryByText('HiddenType')).not.toBeInTheDocument();

    cleanup();

    const hiddenOnlyNode = {
      kind: panelKind.REFERENCES,
      title: 'References',
      children: [
        {
          kind: panelKind.REFERENCES,
          references: [{ name: 'HiddenType', pointer: '#/types/HiddenType', field: 'id' }],
        },
      ],
    } as ReferencesNode;

    render(
      <MemoryRouter>
        <ReferencesPanelItem node={hiddenOnlyNode} />
      </MemoryRouter>,
    );

    // Parity with legacy graphql-docs: the panel heading stays even when
    // every reference row is skipped.
    expect(screen.getByText('References')).toBeInTheDocument();
    expect(screen.queryByText('HiddenType')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('fires sendReferencedInClickedMessage on type-link click', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.graphqlReferenceMapAtom) return {};
      if (atom === mocks.graphqlTypeSlugMapAtom) return { User: '/types/user' };
      return undefined;
    });
    const telemetry = { sendReferencedInClickedMessage: vi.fn() };
    const node = {
      kind: panelKind.REFERENCES,
      title: 'References',
      children: [
        {
          kind: panelKind.REFERENCES,
          references: [{ name: 'User', pointer: '#/types/User', field: 'email' }],
        },
      ],
    } as ReferencesNode;

    render(
      <MemoryRouter>
        <TelemetryContext.Provider value={telemetry as never}>
          <ReferencesPanelItem node={node} />
        </TelemetryContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'User' }));

    expect(telemetry.sendReferencedInClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendReferencedInClickedMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'graphqlDocsReferencedInLink',
      object: 'link',
      fromKind: 'other',
      toKind: 'object',
    });
    expect(telemetry.sendReferencedInClickedMessage.mock.calls[0][0][0]).not.toHaveProperty(
      'referencedIn',
    );
  });
});
