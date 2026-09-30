import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { BrokerOverviewSection } from '../BrokerOverviewSection.js';

vi.mock('@redocly/theme/components/Tag/Tag', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  Tag: ({ children }: any) => <span data-testid="tag">{children}</span>,
}));
vi.mock('../../../common/ExternalDocumentation.js', () => ({
  ExternalDocumentation: ({ externalDocs }: any) => (
    <a href={externalDocs.url}>{externalDocs.url}</a>
  ),
}));

afterEach(() => {
  cleanup();
});

it('should render the broker host URL and protocol', () => {
  const { rerender } = render(
    <BrokerOverviewSection broker={{ url: 'amqp://rabbit:5672', protocol: 'kafka' } as never} />,
  );
  expect(screen.getByText('amqp://rabbit:5672')).toBeInTheDocument();

  rerender(
    <BrokerOverviewSection broker={{ url: 'kafka://broker:9092', protocol: 'amqp' } as never} />,
  );
  expect(screen.getByText('amqp')).toBeInTheDocument();
});

it('should render protocol with version label when protocolVersion is provided', () => {
  render(
    <BrokerOverviewSection
      broker={{ url: 'kafka://broker:9092', protocol: 'kafka', protocolVersion: '2.6' } as never}
    />,
  );
  expect(screen.getByText(/kafka.*2\.6/)).toBeInTheDocument();
  expect(screen.getByText(/Protocol.*and version/)).toBeInTheDocument();
});

it('should render title, summary and description when provided', () => {
  render(
    <BrokerOverviewSection
      broker={
        {
          url: 'kafka://broker:9092',
          protocol: 'kafka',
          title: 'Prod Broker',
          summary: 'Main broker',
          description: 'Used in production',
        } as never
      }
    />,
  );
  expect(screen.getByText('Prod Broker')).toBeInTheDocument();
  expect(screen.getByText('Main broker')).toBeInTheDocument();
  expect(screen.getByText('Used in production')).toBeInTheDocument();
});

it('should show the variables section when variables are present and hide it when absent', () => {
  const { rerender } = render(
    <BrokerOverviewSection
      broker={
        {
          url: 'kafka://broker:9092',
          protocol: 'kafka',
          variables: { region: { default: 'us-east' } },
        } as never
      }
    />,
  );
  expect(screen.getByText('Variables')).toBeInTheDocument();
  expect(screen.getByText('region')).toBeInTheDocument();
  expect(screen.getByText('us-east')).toBeInTheDocument();

  rerender(
    <BrokerOverviewSection broker={{ url: 'kafka://broker:9092', protocol: 'kafka' } as never} />,
  );
  expect(screen.queryByText('Variables')).toBeNull();
});

it('should show the tags section when tags are present and hide it when absent', () => {
  const { rerender } = render(
    <BrokerOverviewSection
      broker={
        {
          url: 'kafka://broker:9092',
          protocol: 'kafka',
          tags: [{ name: 'messaging' }, { name: 'events' }],
        } as any
      }
    />,
  );
  expect(screen.getByText('Tags')).toBeInTheDocument();
  expect(screen.getByText('messaging')).toBeInTheDocument();
  expect(screen.getByText('events')).toBeInTheDocument();

  rerender(
    <BrokerOverviewSection
      broker={{ url: 'kafka://broker:9092', protocol: 'kafka', tags: [] } as any}
    />,
  );
  expect(screen.queryByText('Tags')).toBeNull();
});
