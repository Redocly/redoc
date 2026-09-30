import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { BrokerModal } from '../BrokerModal.js';

vi.mock('@redocly/theme/core/hooks', () => ({
  useOutsideClick: vi.fn(),
  useFocusTrap: vi.fn(),
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({ onClick, 'data-testid': testId, children, icon }: any) => (
    <button data-testid={testId} onClick={onClick}>
      {icon}
      {children}
    </button>
  ),
}));
vi.mock('@redocly/theme/components/Typography/Typography', () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
}));
vi.mock('@redocly/theme/components/Segmented/Segmented', () => ({
  Segmented: ({ options, value, onChange }: any) => (
    <div>
      {options.map((opt: any) => (
        <button
          key={opt.value}
          data-testid={`segment-${opt.label.toLowerCase()}`}
          data-active={value === opt.value}
          onClick={() => onChange({ value: opt.value })}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));
vi.mock('../BrokerOverviewSection.js', () => ({
  BrokerOverviewSection: () => <div data-testid="broker-overview" />,
}));
vi.mock('../BrokerBindingsSection.js', () => ({
  BrokerBindingsSection: () => <div data-testid="broker-bindings" />,
}));
vi.mock('@redocly/theme/icons/CloseIcon/CloseIcon', () => ({ CloseIcon: () => null }));
vi.mock('@redocly/theme/icons/DatabaseIcon/DatabaseIcon', () => ({ DatabaseIcon: () => null }));
vi.mock('@redocly/theme/icons/KafkaIcon/KafkaIcon', () => ({ KafkaIcon: () => null }));
vi.mock('@redocly/theme/icons/RabbitMQIcon/RabbitMQIcon', () => ({ RabbitMQIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render the broker name and show the overview section by default', () => {
  render(
    <BrokerModal
      broker={{ url: 'kafka://broker:9092', name: 'Events Broker', protocol: 'kafka' }}
      panelLabel="Brokers"
      onClose={vi.fn()}
    />,
  );
  expect(screen.getByText(/Events Broker/)).toBeInTheDocument();
  expect(screen.getByTestId('broker-overview')).toBeInTheDocument();
  expect(screen.queryByTestId('broker-bindings')).toBeNull();
});

it('should show Configuration tab only when bindings are present and switch sections on click', () => {
  const { rerender } = render(
    <BrokerModal
      broker={{ url: 'kafka://broker:9092', name: 'Main Broker', protocol: 'kafka' }}
      panelLabel="Brokers"
      onClose={vi.fn()}
    />,
  );
  expect(screen.queryByTestId('segment-configuration')).toBeNull();

  rerender(
    <BrokerModal
      broker={{
        url: 'kafka://broker:9092',
        name: 'Main Broker',
        protocol: 'kafka',
        bindings: { kafka: {} } as never,
      }}
      panelLabel="Brokers"
      onClose={vi.fn()}
    />,
  );
  expect(screen.getByTestId('segment-configuration')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('segment-configuration'));
  expect(screen.getByTestId('broker-bindings')).toBeInTheDocument();
  expect(screen.queryByTestId('broker-overview')).toBeNull();
});

it('should call onClose when the close button is clicked', () => {
  const onClose = vi.fn();
  render(
    <BrokerModal
      broker={{ url: 'kafka://broker:9092', name: 'Main Broker', protocol: 'kafka' }}
      panelLabel="Brokers"
      onClose={onClose}
    />,
  );
  fireEvent.click(screen.getByTestId('close'));
  expect(onClose).toHaveBeenCalledTimes(1);
});
