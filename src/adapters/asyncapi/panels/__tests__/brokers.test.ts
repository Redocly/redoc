import { describe, it, expect } from 'vitest';

import type {
  AsyncApiBuildContext,
  AsyncApiDefinition,
  AsyncApiServer,
} from '../../../../types/asyncapi.js';
import type { MarkdownSanitizeOptions } from '../../../utils/markdoc.js';

import { buildBrokersPanelContent } from '../brokers.js';
import { createStoreContext } from '../../../helpers.js';
import { asyncApiContext } from '../../buildContext.js';
import { normalizeAsyncApiDefinition } from '../../../../services/spec-convert/index.js';

const SANITIZE = {} as MarkdownSanitizeOptions;
const DOCUMENT = { asyncapi: '3.0.0', info: { title: 'T', version: '1.0' } } as AsyncApiDefinition;

describe('buildBrokersPanelContent — server url', () => {
  it('maps host for AsyncAPI 3.x servers', () => {
    const servers = {
      prod: { host: 'broker.example.com', protocol: 'kafka' },
    } as unknown as Record<string, AsyncApiServer>;

    const brokers = buildBrokersPanelContent(servers, 'kafka', SANITIZE, DOCUMENT).children[0]
      .brokers;

    expect(brokers[0].url).toBe('broker.example.com');
  });

  it('keeps the pathname separate from the host', () => {
    const servers = {
      local: { host: 'localhost:{port}', pathname: '/v1', protocol: 'amqp' },
    } as unknown as Record<string, AsyncApiServer>;

    const brokers = buildBrokersPanelContent(servers, 'amqp', SANITIZE, DOCUMENT).children[0]
      .brokers;

    expect(brokers[0]).toMatchObject({ url: 'localhost:{port}', pathname: '/v1' });
  });

  it('resolves server variable refs', () => {
    const servers = {
      local: {
        host: '{env}.example.com',
        protocol: 'amqp',
        variables: { env: { $ref: '#/components/serverVariables/env' } },
      },
    } as unknown as Record<string, AsyncApiServer>;
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'T', version: '1.0' },
      servers,
      components: { serverVariables: { env: { default: 'prod', enum: ['prod', 'dev'] } } },
    } as unknown as AsyncApiDefinition;

    const brokers = buildBrokersPanelContent(servers, 'amqp', SANITIZE, document).children[0]
      .brokers;

    expect(brokers[0].variables).toEqual({ env: { default: 'prod', enum: ['prod', 'dev'] } });
  });
});

describe('buildBrokersPanelContent — server refs', () => {
  it('resolves a root server that references components.servers', () => {
    const document = normalizeAsyncApiDefinition({
      asyncapi: '2.6.0',
      info: { title: 'T', version: '1.0' },
      servers: { production: { $ref: '#/components/servers/broker' } },
      channels: {},
      components: {
        servers: {
          broker: {
            url: 'mqtt://broker.example.com:1883/v1',
            protocol: 'mqtt',
            description: 'Broker',
          },
        },
      },
    });

    const servers = document.servers;
    if (!servers) throw new Error('expected normalized document to contain servers');

    const brokers = buildBrokersPanelContent(servers, 'mqtt', SANITIZE, document).children[0]
      .brokers;

    expect(brokers[0]).toMatchObject({
      name: 'production',
      url: 'broker.example.com:1883',
      pathname: '/v1',
      protocol: 'mqtt',
    });
    expect(brokers[0].description).not.toEqual([]);
  });
});

describe('buildBrokersPanelContent — security', () => {
  it('maps server security to scheme details from the store', () => {
    const servers = {
      production: {
        host: 'broker.cafe.test:8883',
        protocol: 'mqtt',
        security: [{ $ref: '#/components/securitySchemes/userPass' }],
      },
      staging: { host: 'staging.cafe.test:8883', protocol: 'mqtt' },
    } as unknown as Record<string, AsyncApiServer>;
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'T', version: '1.0' },
      servers,
    } as unknown as AsyncApiDefinition;
    const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);
    storeCtx.securitySchemeStore.userPass = { id: 'userPass', type: 'userPassword' };

    const brokers = asyncApiContext.run({ storeCtx } as AsyncApiBuildContext, () =>
      buildBrokersPanelContent(servers, 'mqtt', SANITIZE, document),
    ).children[0].brokers;

    expect(brokers[0].security).toEqual([
      { schemes: [{ name: 'userPass', type: 'userPassword' }] },
    ]);
    expect(brokers[1].security).toBeUndefined();
  });

  it('keeps the schemes of one 2.x requirement together and separate requirements apart', () => {
    const document = normalizeAsyncApiDefinition({
      asyncapi: '2.6.0',
      info: { title: 'Security requirement AND vs OR', version: '1.0.0' },
      servers: {
        needsBoth: {
          url: 'secure.example.com:8883',
          protocol: 'secure-mqtt',
          security: [{ userPass: [], certs: [] }],
        },
        eitherOne: {
          url: 'broker.example.com:8883',
          protocol: 'secure-mqtt',
          security: [{ userPass: [] }, { certs: [] }],
        },
      },
      channels: {},
      components: {
        securitySchemes: { userPass: { type: 'userPassword' }, certs: { type: 'X509' } },
      },
    });
    const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);
    storeCtx.securitySchemeStore.userPass = { id: 'userPass', type: 'userPassword' };
    storeCtx.securitySchemeStore.certs = { id: 'certs', type: 'X509' };

    const brokers = asyncApiContext.run({ storeCtx } as AsyncApiBuildContext, () =>
      buildBrokersPanelContent(document.servers ?? {}, 'secure-mqtt', SANITIZE, document),
    ).children[0].brokers;
    const schemeNames = (name: string) =>
      brokers
        .find((broker) => broker.name === name)
        ?.security?.map(({ schemes }) => schemes.map((scheme) => scheme.name));

    expect(schemeNames('needsBoth')).toEqual([['userPass', 'certs']]);
    expect(schemeNames('eitherOne')).toEqual([['userPass'], ['certs']]);
  });
});

