import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Markdoc from '@markdoc/markdoc';

import { BrokerOverviewSection } from '../BrokerOverviewSection.js';

vi.mock('@redocly/theme/components/Tag/Tag', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  Tag: ({ children, textTransform }: any) => (
    <span data-testid="tag" data-text-transform={textTransform}>
      {children}
    </span>
  ),
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

it('should render the pathname and external docs when provided and hide them when absent', () => {
  const { rerender } = render(
    <BrokerOverviewSection
      broker={
        {
          url: 'broker.cafe.test:8883',
          protocol: 'mqtt',
          pathname: '/gateway-v1',
          externalDocs: { url: 'https://docs.cafe.test/broker', description: 'Broker setup guide' },
        } as never
      }
    />,
  );
  expect(screen.getByText('Pathname:')).toBeInTheDocument();
  expect(screen.getByText('/gateway-v1')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Broker setup guide' })).toHaveAttribute(
    'href',
    'https://docs.cafe.test/broker',
  );

  rerender(
    <BrokerOverviewSection broker={{ url: 'broker.cafe.test:8883', protocol: 'mqtt' } as never} />,
  );
  expect(screen.queryByText('Pathname:')).toBeNull();
  expect(screen.queryByRole('link')).toBeNull();
});

it('shows an external docs description given as parsed Markdown as plain text', () => {
  const description = Markdoc.parse('See the **setup** guide.').children;
  render(
    <BrokerOverviewSection
      broker={{
        url: 'broker.cafe.test',
        externalDocs: { url: 'https://docs.cafe.test/broker', description },
      }}
    />,
  );

  expect(screen.getByRole('link', { name: 'See the setup guide.' })).toHaveAttribute(
    'href',
    'https://docs.cafe.test/broker',
  );
});

it('shows variable default and enum values as written', () => {
  render(
    <BrokerOverviewSection
      broker={
        {
          url: '{region}.broker.cafe.test:8883',
          protocol: 'mqtt',
          variables: { region: { default: 'us-east', enum: ['us-east', 'eu-central'] } },
        } as never
      }
    />,
  );
  const tags = screen.getAllByTestId('tag');
  expect(tags.map((tag) => tag.textContent)).toEqual(['us-east', 'us-east', 'eu-central']);
  for (const tag of tags) expect(tag).toHaveAttribute('data-text-transform', 'none');
});

it('should show the security section when the server has security and hide it otherwise', () => {
  const { rerender } = render(
    <BrokerOverviewSection
      broker={
        {
          url: 'broker.cafe.test:8883',
          protocol: 'mqtt',
          security: [
            {
              schemes: [
                {
                  name: 'userPass',
                  type: 'userPassword',
                  description: 'Broker user name and password.',
                },
              ],
            },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByText('Security')).toBeInTheDocument();
  expect(screen.getByText('userPass')).toBeInTheDocument();
  expect(screen.getByText('Broker user name and password.')).toBeInTheDocument();
  expect(screen.getByText('userPassword')).toBeInTheDocument();

  rerender(
    <BrokerOverviewSection broker={{ url: 'broker.cafe.test:8883', protocol: 'mqtt' } as never} />,
  );
  expect(screen.queryByText('Security')).toBeNull();
});

it('should separate schemes required together with "and" and alternatives with "or"', () => {
  render(
    <BrokerOverviewSection
      broker={
        {
          url: 'broker.cafe.test:8883',
          protocol: 'mqtt',
          security: [
            {
              schemes: [
                { name: 'userPass', type: 'userPassword' },
                { name: 'certs', type: 'X509' },
              ],
            },
            { schemes: [{ name: 'apiKey', type: 'httpApiKey' }] },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByText('and')).toBeInTheDocument();
  expect(screen.getByText('or')).toBeInTheDocument();
});
