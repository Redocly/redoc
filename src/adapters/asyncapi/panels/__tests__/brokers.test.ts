import { describe, it, expect } from 'vitest';

import type { AsyncApiServer } from '../../../../types/asyncapi.js';
import type { MarkdownSanitizeOptions } from '../../../utils/markdoc.js';

import { buildBrokersPanelContent } from '../brokers.js';

const SANITIZE = {} as MarkdownSanitizeOptions;

describe('buildBrokersPanelContent — server url', () => {
  it('maps host for AsyncAPI 3.x servers', () => {
    const servers = {
      prod: { host: 'broker.example.com', protocol: 'kafka' },
    } as unknown as Record<string, AsyncApiServer>;

    const brokers = buildBrokersPanelContent(servers, 'kafka', SANITIZE).children[0].brokers;

    expect(brokers[0].url).toBe('broker.example.com');
  });

  it('falls back to url for AsyncAPI 2.x servers (no host field)', () => {
    const servers = {
      local: { url: 'localhost:{port}', protocol: 'amqp' },
    } as unknown as Record<string, AsyncApiServer>;

    const brokers = buildBrokersPanelContent(servers, 'amqp', SANITIZE).children[0].brokers;

    expect(brokers[0].url).toBe('localhost:{port}');
  });
});

