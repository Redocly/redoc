import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { MessageBindingNode } from '../../../../../types/content.js';

import { panelKind } from '../../../../../types/common.js';
import { ItemIdContext } from '../../../../../hooks/useDeepLinkSection.js';
import { MessageBindingPanelItem } from '../MessageBindingItem.js';

const mocks = vi.hoisted(() => ({
  globalOptionsAtom: Symbol('globalOptionsAtom'),
  activeMessageKeyAtom: Symbol('activeMessageKeyAtom'),
  useAtomValue: vi.fn(),
  schemaView: vi.fn(),
  jsonViewer: vi.fn(),
}));

vi.mock('jotai', () => ({
  useAtomValue: (...args: unknown[]) => mocks.useAtomValue(...args),
}));

vi.mock('../../../../../jotai/store.js', () => ({
  globalOptionsAtom: mocks.globalOptionsAtom,
}));

vi.mock('../../../../../jotai/itemStore.js', () => ({
  itemStoreFieldAtom: vi.fn(() => mocks.activeMessageKeyAtom),
}));

vi.mock('../../../../Schema/SchemaView.js', () => ({
  SchemaView: (props: { schemaId: string }) => {
    mocks.schemaView(props);
    return <div data-testid="schema-view">{props.schemaId}</div>;
  },
}));

vi.mock('@redocly/theme/components/JsonViewer/JsonViewer', () => ({
  JsonViewer: (props: { data: unknown; expandLevel: number; controls: boolean }) => {
    mocks.jsonViewer(props);
    return <div data-testid="json-viewer">{JSON.stringify(props.data)}</div>;
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderWithContext(node: MessageBindingNode): void {
  render(
    <ItemIdContext.Provider value="item-1">
      <MessageBindingPanelItem node={node} />
    </ItemIdContext.Provider>,
  );
}

describe('MessageBindingPanelItem', () => {
  it('renders kafka-specific binding details and key schema', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.globalOptionsAtom) {
        return { jsonSamplesDepth: 2 };
      }
      if (atom === mocks.activeMessageKeyAtom) {
        return 'non-existing-key';
      }
      return undefined;
    });

    const node = {
      kind: panelKind.MESSAGE_BINDING,
      title: 'Message bindings',
      children: [
        {
          kind: panelKind.MESSAGE_BINDING,
          bindingsByMessageKey: {
            created: {
              bindingKey: 'kafka',
              keySchemaId: 'schema.messageKey',
              bindingValue: {
                schemaIdLocation: 'header',
                schemaIdPayloadEncoding: 'base64',
                schemaLookupStrategy: 'TopicIdStrategy',
                bindingVersion: '0.5.0',
              },
            },
          },
        },
      ],
    } as MessageBindingNode;

    renderWithContext(node);

    expect(screen.getByTestId('panel-message-bindings')).toBeInTheDocument();
    expect(screen.getByText('Schema ID Location')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('Schema ID payload encoding')).toBeInTheDocument();
    expect(screen.getByText('base64')).toBeInTheDocument();
    expect(screen.getByText('Schema lookup strategy')).toBeInTheDocument();
    expect(screen.getByText('TopicIdStrategy')).toBeInTheDocument();
    expect(screen.getByTestId('schema-view')).toHaveTextContent('schema.messageKey');
  });

  it('renders JSON binding and omits bindingVersion', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.globalOptionsAtom) {
        return { jsonSamplesDepth: 4 };
      }
      if (atom === mocks.activeMessageKeyAtom) {
        return 'created';
      }
      return undefined;
    });

    const node = {
      kind: panelKind.MESSAGE_BINDING,
      title: 'Message bindings',
      children: [
        {
          kind: panelKind.MESSAGE_BINDING,
          bindingsByMessageKey: {
            created: {
              bindingKey: 'amqp',
              bindingValue: {
                contentEncoding: 'gzip',
                bindingVersion: '0.2.0',
              },
            },
          },
        },
      ],
    } as MessageBindingNode;

    renderWithContext(node);

    expect(screen.getByTestId('panel-message-bindings')).toBeInTheDocument();
    expect(screen.getByTestId('json-viewer')).toHaveTextContent('{"contentEncoding":"gzip"}');
    expect(mocks.jsonViewer).toHaveBeenCalledWith(
      expect.objectContaining({ data: { contentEncoding: 'gzip' }, expandLevel: 4 }),
    );
    expect(mocks.jsonViewer.mock.calls[0][0].controls).toBeUndefined();
  });

  it('renders an empty panel when there is no binding child item', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.globalOptionsAtom) {
        return { jsonSamplesDepth: 1 };
      }
      if (atom === mocks.activeMessageKeyAtom) {
        return undefined;
      }
      return undefined;
    });

    const node = {
      kind: panelKind.MESSAGE_BINDING,
      title: 'Message bindings',
      children: [],
    } as unknown as MessageBindingNode;

    renderWithContext(node);

    expect(screen.getByTestId('panel-message-bindings')).toBeInTheDocument();
    expect(mocks.schemaView).not.toHaveBeenCalled();
    expect(mocks.jsonViewer).not.toHaveBeenCalled();
  });

  it('renders nothing when no active binding can be resolved', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) => {
      if (atom === mocks.globalOptionsAtom) {
        return { jsonSamplesDepth: 1 };
      }
      if (atom === mocks.activeMessageKeyAtom) {
        return undefined;
      }
      return undefined;
    });

    const node = {
      kind: panelKind.MESSAGE_BINDING,
      title: 'Message bindings',
      children: [
        {
          kind: panelKind.MESSAGE_BINDING,
          bindingsByMessageKey: {},
        },
      ],
    } as MessageBindingNode;

    const { container } = render(
      <ItemIdContext.Provider value="item-1">
        <MessageBindingPanelItem node={node} />
      </ItemIdContext.Provider>,
    );

    expect(container.firstChild).toBeNull();
  });
});
