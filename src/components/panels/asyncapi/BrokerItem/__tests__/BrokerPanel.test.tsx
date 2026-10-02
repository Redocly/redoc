import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { TelemetryContext } from '../../../../../contexts/telemetry.js';
import { BrokerPanelItem } from '../BrokerPanelItem.js';
import { panelKind } from '../../../../../types/common.js';

vi.mock('@redocly/theme/core/hooks', () => ({ useModalScrollLock: vi.fn() }));
vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@redocly/theme/components/Buttons/CopyButton', () => ({ CopyButton: () => null }));
vi.mock('@redocly/theme/components/Portal/Portal', () => ({
  Portal: ({ children }: any) => <>{children}</>,
}));
vi.mock('../BrokerModal.js', () => ({
  BrokerModal: ({ broker, onClose }: any) => (
    <div data-testid="broker-modal" data-broker={broker.name}>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));
vi.mock('../../../../common/MoreDetailsButton.js', () => ({
  MoreDetailsButton: () => <button data-testid="more-details">More</button>,
}));
vi.mock('@redocly/theme/icons/DatabaseIcon/DatabaseIcon', () => ({
  DatabaseIcon: () => <span data-testid="icon-database" />,
}));
vi.mock('@redocly/theme/icons/KafkaIcon/KafkaIcon', () => ({
  KafkaIcon: () => <span data-testid="icon-kafka" />,
}));
vi.mock('@redocly/theme/icons/RabbitMQIcon/RabbitMQIcon', () => ({
  RabbitMQIcon: () => <span data-testid="icon-rabbitmq" />,
}));

afterEach(() => {
  cleanup();
});

it('should render broker name and URL', () => {
  render(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'kafka://broker:9092', name: 'Primary', protocol: 'kafka' }],
          },
        ],
      }}
    />,
  );
  expect(screen.getByText('Primary')).toBeInTheDocument();
  expect(screen.getByText('kafka://broker:9092')).toBeInTheDocument();
});

it('splits a space-separated multi-host broker string onto separate lines', () => {
  render(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [
              { url: 'broker1:9092 broker2:9092 broker3:9092', name: 'Cluster', protocol: 'kafka' },
            ],
          },
        ],
      }}
    />,
  );
  expect(screen.getByText('broker1:9092')).toBeInTheDocument();
  expect(screen.getByText('broker2:9092')).toBeInTheDocument();
  expect(screen.getByText('broker3:9092')).toBeInTheDocument();
});

it('should show kafka icon for kafka, rabbitmq icon for amqp, and database icon for unknown protocols', () => {
  const { rerender } = render(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'kafka://broker:9092', name: 'Kafka', protocol: 'kafka' }],
          },
        ],
      }}
    />,
  );
  expect(screen.getByTestId('icon-kafka')).toBeInTheDocument();

  rerender(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'amqp://rabbit:5672', name: 'Rabbit', protocol: 'amqp' }],
          },
        ],
      }}
    />,
  );
  expect(screen.getByTestId('icon-rabbitmq')).toBeInTheDocument();

  rerender(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'mqtt://broker:1883', name: 'MQTT', protocol: 'mqtt' }],
          },
        ],
      }}
    />,
  );
  expect(screen.getByTestId('icon-database')).toBeInTheDocument();
});

it('should open the broker modal when More Details is clicked and close it when onClose is called', () => {
  render(
    <BrokerPanelItem
      node={{
        title: 'Brokers',
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'kafka://broker:9092', name: 'Main', protocol: 'kafka' }],
          },
        ],
      }}
    />,
  );
  expect(screen.queryByTestId('broker-modal')).toBeNull();

  fireEvent.click(screen.getByTestId('more-details'));
  expect(screen.getByTestId('more-details')).toBeInTheDocument();
  expect(screen.getByTestId('broker-modal')).toBeInTheDocument();
  expect(screen.getByTestId('broker-modal')).toHaveAttribute('data-broker', 'Main');

  fireEvent.click(screen.getByTestId('modal-close'));
  expect(screen.queryByTestId('broker-modal')).toBeNull();
});

it('should do not render the more details button if the panel not have a title', () => {
  render(
    <BrokerPanelItem
      node={{
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: 'Brokers',
            brokers: [{ url: 'kafka://broker:9092', name: 'Main', protocol: 'kafka' }],
          },
        ],
      }}
    />,
  );
  expect(screen.queryByTestId('broker-modal')).toBeNull();
  expect(screen.queryByTestId('more-details')).toBeNull();
});

it('fires sendServerModalOpenedMessage when MoreDetails is clicked', () => {
  const telemetry = { sendServerModalOpenedMessage: vi.fn() };
  render(
    <TelemetryContext.Provider value={telemetry as never}>
      <BrokerPanelItem
        node={{
          title: 'Brokers',
          children: [
            {
              kind: panelKind.BROKERS,
              panelLabel: 'Brokers',
              brokers: [{ url: 'kafka://broker:9092', name: 'Main', protocol: 'kafka' }],
            },
          ],
        }}
      />
    </TelemetryContext.Provider>,
  );

  fireEvent.click(screen.getByTestId('more-details'));

  expect(telemetry.sendServerModalOpenedMessage).toHaveBeenCalledTimes(1);
  expect(telemetry.sendServerModalOpenedMessage.mock.calls[0][0][0]).toMatchObject({
    id: 'serverModalButton',
    object: 'button',
  });
});
