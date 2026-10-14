import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { BrokerBindingsSection } from '../BrokerBindingsSection.js';

const mocks = vi.hoisted(() => ({
  jsonViewer: vi.fn(),
}));

vi.mock('@redocly/theme/components/JsonViewer/JsonViewer', () => ({
  JsonViewer: (props: { data: unknown; expandLevel: number; controls?: boolean }) => {
    mocks.jsonViewer(props);
    return <pre data-testid="json-viewer">{JSON.stringify(props.data)}</pre>;
  },
}));
vi.mock('../../../../common/ExternalDocumentation.js', () => ({
  ExternalDocumentation: ({ externalDocs }: any) => (
    <a data-testid="external-doc" href={externalDocs.url}>
      {externalDocs.url}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('should render schema registry URL, vendor, and binding version for kafka bindings', () => {
  const { rerender } = render(
    <BrokerBindingsSection
      broker={
        {
          url: 'kafka://broker:9092',
          bindings: { kafka: { schemaRegistryUrl: 'https://registry.example.com' } },
        } as never
      }
      panelLabel="Kafka"
    />,
  );
  expect(screen.getByTestId('external-doc')).toHaveAttribute(
    'href',
    'https://registry.example.com',
  );

  rerender(
    <BrokerBindingsSection
      broker={
        {
          url: 'kafka://broker:9092',
          bindings: {
            kafka: {
              schemaRegistryUrl: 'https://registry.example.com',
              schemaRegistryVendor: 'Confluent',
            },
          },
        } as never
      }
      panelLabel="Kafka"
    />,
  );
  expect(screen.getByTestId('schema-registry-vendor-value')).toHaveTextContent('Confluent');

  rerender(
    <BrokerBindingsSection
      broker={
        {
          url: 'kafka://broker:9092',
          bindings: {
            kafka: { schemaRegistryUrl: 'https://registry.example.com', bindingVersion: '0.4.0' },
          },
        } as never
      }
      panelLabel="Kafka"
    />,
  );
  expect(screen.getByTestId('binding-version-value')).toHaveTextContent('0.4.0');
});

it('should render a JSON viewer for non-kafka bindings and include the panel label in the header', () => {
  const { rerender } = render(
    <BrokerBindingsSection
      broker={
        {
          url: 'kafka://broker:9092',
          bindings: { amqp: { schemaRegistryUrl: null, schemaRegistryVendor: null } },
        } as never
      }
      panelLabel="AMQP"
    />,
  );
  expect(screen.getByTestId('json-viewer')).toBeInTheDocument();
  expect(mocks.jsonViewer.mock.calls[0][0].controls).toBeUndefined();

  rerender(
    <BrokerBindingsSection
      broker={{ url: 'kafka://broker:9092', bindings: { kafka: {} } } as never}
      panelLabel="Event Broker"
    />,
  );
  expect(screen.getByText('Event Broker Configuration')).toBeInTheDocument();
});
