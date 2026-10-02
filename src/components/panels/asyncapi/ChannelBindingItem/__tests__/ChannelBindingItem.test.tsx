import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ChannelBindingNode } from '../../../../../types/content.js';

import { panelKind } from '../../../../../types/common.js';
import { ChannelBindingPanelItem } from '../ChannelBindingItem.js';

const mocks = vi.hoisted(() => ({
  globalOptionsAtom: Symbol('globalOptionsAtom'),
  specTypeAtom: Symbol('specTypeAtom'),
  useAtomValue: vi.fn(),
  jsonViewer: vi.fn(),
}));

vi.mock('jotai', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useAtomValue: (...args: unknown[]) => mocks.useAtomValue(...args),
}));

vi.mock('../../../../../jotai/store.js', () => ({
  globalOptionsAtom: mocks.globalOptionsAtom,
  specTypeAtom: mocks.specTypeAtom,
}));

vi.mock('@redocly/theme/components/JsonViewer/JsonViewer', () => ({
  JsonViewer: (props: { data: unknown; expandLevel: number; controls: boolean }) => {
    mocks.jsonViewer(props);
    return <div data-testid="json-viewer">{JSON.stringify(props.data)}</div>;
  },
}));

vi.mock('../../../common/MoreDetailsButton.js', () => ({
  MoreDetailsButton: ({ expanded }: { expanded: boolean }) => (
    <button type="button" data-testid="more-details-button">
      {expanded ? 'Hide' : 'Show'}
    </button>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ChannelBindingPanelItem', () => {
  it('renders kafka binding fields and topic configuration toggle', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 2 } : undefined,
    );

    const node = {
      kind: panelKind.CHANNEL_BINDING,
      title: 'Channel binding',
      children: [
        {
          kind: panelKind.CHANNEL_BINDING,
          bindingKey: 'kafka',
          bindingValue: {
            topic: 'users.events',
            partitions: 6,
            replicas: 3,
            groupId: { type: 'string' },
            clientId: { enum: ['consumer-a', 'consumer-b'], type: 'string' },
            topicConfiguration: {
              'cleanup.policy': ['compact'],
            },
            bindingVersion: '0.5.0',
          },
        },
      ],
    } as ChannelBindingNode;

    render(<ChannelBindingPanelItem node={node} />);

    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('users.events')).toBeInTheDocument();
    expect(screen.getByText('Partitions')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Replicas')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Group ID')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Client ID')).toBeInTheDocument();
    expect(screen.getByText('consumer-a, consumer-b')).toBeInTheDocument();

    expect(screen.queryByText('Cleanup policy')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Cleanup policy')).toBeInTheDocument();
    expect(screen.getByText('compact')).toBeInTheDocument();
  });

  it('renders json viewer for non-kafka bindings and strips bindingVersion', () => {
    mocks.useAtomValue.mockImplementation((atom: unknown) =>
      atom === mocks.globalOptionsAtom ? { jsonSamplesDepth: 5 } : undefined,
    );

    const node = {
      kind: panelKind.CHANNEL_BINDING,
      title: 'Channel binding',
      children: [
        {
          kind: panelKind.CHANNEL_BINDING,
          bindingKey: 'amqp',
          bindingValue: {
            is: 'routingKey',
            bindingVersion: '0.2.0',
          },
        },
      ],
    } as ChannelBindingNode;

    render(<ChannelBindingPanelItem node={node} />);

    expect(screen.getByTestId('json-viewer')).toHaveTextContent('{"is":"routingKey"}');
    expect(mocks.jsonViewer).toHaveBeenCalledWith(
      expect.objectContaining({ data: { is: 'routingKey' }, expandLevel: 5 }),
    );
    expect(mocks.jsonViewer.mock.calls[0][0].controls).toBeUndefined();
  });
});
