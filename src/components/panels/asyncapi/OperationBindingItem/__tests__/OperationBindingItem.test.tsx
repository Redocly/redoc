import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { OperationBindingNode } from '../../../../../types/content.js';

import { panelKind } from '../../../../../types/common.js';
import { OperationBindingPanelItem } from '../OperationBindingItem.js';

const mocks = vi.hoisted(() => ({
  globalOptionsAtom: Symbol('globalOptionsAtom'),
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

vi.mock('../../../../Schema/SchemaView.js', () => ({
  SchemaView: (props: { schemaId: string; expandByDefault: boolean; level: number }) => {
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

describe('OperationBindingPanelItem', () => {
  it('renders kafka group and client id schemas', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 2 } : undefined,
    );

    const node = {
      kind: panelKind.OPERATION_BINDING,
      title: 'Operation binding',
      children: [
        {
          kind: panelKind.OPERATION_BINDING,
          bindingKey: 'kafka',
          bindingValue: {
            groupId: { type: 'string', enum: ['ride-request-producer'] },
            clientId: { type: 'string', enum: ['passenger-app'] },
            bindingVersion: '0.5.0',
          },
          groupIdSchemaId: 'schema.groupId',
          clientIdSchemaId: 'schema.clientId',
        },
      ],
    } as OperationBindingNode;

    render(<OperationBindingPanelItem node={node} />);

    expect(screen.getByText('Operation binding')).toBeInTheDocument();
    expect(screen.getAllByTestId('schema-view')).toHaveLength(2);
    expect(screen.getByText('schema.groupId')).toBeInTheDocument();
    expect(screen.getByText('schema.clientId')).toBeInTheDocument();
    expect(mocks.schemaView).toHaveBeenCalledWith({
      schemaId: 'schema.groupId',
      expandByDefault: true,
      level: 1,
    });
    expect(mocks.schemaView).toHaveBeenCalledWith({
      schemaId: 'schema.clientId',
      expandByDefault: true,
      level: 1,
    });
    expect(mocks.jsonViewer).not.toHaveBeenCalled();
  });

  it('renders only group id schema when client id schema is absent', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 2 } : undefined,
    );

    const node = {
      kind: panelKind.OPERATION_BINDING,
      title: 'Operation binding',
      children: [
        {
          kind: panelKind.OPERATION_BINDING,
          bindingKey: 'kafka',
          bindingValue: { groupId: { type: 'string' } },
          groupIdSchemaId: 'schema.groupId',
        },
      ],
    } as OperationBindingNode;

    render(<OperationBindingPanelItem node={node} />);

    expect(screen.getAllByTestId('schema-view')).toHaveLength(1);
    expect(screen.getByText('schema.groupId')).toBeInTheDocument();
    expect(mocks.jsonViewer).not.toHaveBeenCalled();
  });

  it('renders json viewer for non-kafka bindings and strips bindingVersion', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 5 } : undefined,
    );

    const node = {
      kind: panelKind.OPERATION_BINDING,
      title: 'Operation binding',
      children: [
        {
          kind: panelKind.OPERATION_BINDING,
          bindingKey: 'http',
          bindingValue: {
            method: 'POST',
            bindingVersion: '0.1.0',
          },
        },
      ],
    } as OperationBindingNode;

    render(<OperationBindingPanelItem node={node} />);

    expect(screen.getByTestId('json-viewer')).toHaveTextContent('{"method":"POST"}');
    expect(mocks.jsonViewer).toHaveBeenCalledWith(
      expect.objectContaining({ data: { method: 'POST' }, expandLevel: 5 }),
    );
    expect(mocks.jsonViewer.mock.calls[0][0].controls).toBeUndefined();
    expect(mocks.schemaView).not.toHaveBeenCalled();
  });

  it('renders json viewer for kafka bindings without schema ids', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 3 } : undefined,
    );

    const node = {
      kind: panelKind.OPERATION_BINDING,
      title: 'Operation binding',
      children: [
        {
          kind: panelKind.OPERATION_BINDING,
          bindingKey: 'kafka',
          bindingValue: {
            groupId: 'static-group',
            bindingVersion: '0.5.0',
          },
        },
      ],
    } as OperationBindingNode;

    render(<OperationBindingPanelItem node={node} />);

    expect(screen.getByTestId('json-viewer')).toHaveTextContent('{"groupId":"static-group"}');
    expect(mocks.jsonViewer).toHaveBeenCalledWith(
      expect.objectContaining({ data: { groupId: 'static-group' }, expandLevel: 3 }),
    );
    expect(mocks.jsonViewer.mock.calls[0][0].controls).toBeUndefined();
    expect(mocks.schemaView).not.toHaveBeenCalled();
  });

  it('renders an empty panel when there is no binding child item', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 1 } : undefined,
    );

    const node = {
      kind: panelKind.OPERATION_BINDING,
      title: 'Operation binding',
      children: [],
    } as unknown as OperationBindingNode;

    render(<OperationBindingPanelItem node={node} />);

    expect(screen.getByText('Operation binding')).toBeInTheDocument();
    expect(mocks.schemaView).not.toHaveBeenCalled();
    expect(mocks.jsonViewer).not.toHaveBeenCalled();
  });
});
