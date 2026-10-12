import { describe, it, expect } from 'vitest';

import type {
  AsyncApiDefinition,
  AsyncApiSecurityRequirement,
} from '../../../../types/asyncapi.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { createStoreContext } from '../../../helpers.js';
import { buildSecurityRequirements } from '../security.js';
import { markdocParser } from '../../../../components/markdoc/markdocParser.js';

const OPTIONS = { markdownParser: markdocParser } as ParseMarkdownOptions;

const document = {
  asyncapi: '3.0.0',
  info: { title: 'T', version: '1.0' },
  components: {
    securitySchemes: {
      userPass: { type: 'userPassword', description: 'Broker user name and password.' },
    },
  },
} as unknown as AsyncApiDefinition;

function storeWithUserPass() {
  const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);
  storeCtx.securitySchemeStore.userPass = {
    id: 'userPass',
    type: 'userPassword',
    description: 'Broker user name and password.',
  };
  return storeCtx;
}

function build(security: AsyncApiSecurityRequirement[]) {
  return buildSecurityRequirements(security, storeWithUserPass(), document, OPTIONS).map(
    ({ schemes }) => schemes,
  );
}

describe('buildSecurityRequirements', () => {
  it('skips entries that are not objects, and a value that is not a list', () => {
    expect(
      build(['userPass', null, { userPass: [] }] as unknown as AsyncApiSecurityRequirement[]),
    ).toEqual([
      [{ name: 'userPass', type: 'userPassword', description: 'Broker user name and password.' }],
    ]);
    expect(build('userPass' as unknown as AsyncApiSecurityRequirement[])).toEqual([]);
  });

  it('copies a $ref to a component scheme from the store, named after the component', () => {
    expect(build([{ $ref: '#/components/securitySchemes/userPass' }])).toEqual([
      [{ name: 'userPass', type: 'userPassword', description: 'Broker user name and password.' }],
    ]);
  });

  it('maps a requirement object to its component schemes with their required scopes', () => {
    expect(build([{ userPass: ['read'] }])).toEqual([
      [
        {
          name: 'userPass',
          type: 'userPassword',
          description: 'Broker user name and password.',
          scopes: ['read'],
        },
      ],
    ]);
  });

  it('maps an inline scheme, named after its type', () => {
    expect(build([{ type: 'httpApiKey', name: 'X-Api-Key', in: 'header' }])).toEqual([
      [{ name: 'httpApiKey', type: 'httpApiKey', in: 'header', paramName: 'X-Api-Key' }],
    ]);
  });

  it('skips a $ref that does not resolve to a scheme', () => {
    expect(
      build([
        { $ref: '#/components/securitySchemes/missing' },
        { $ref: '#/components/securitySchemes/userPass' },
      ]).map((schemes) => schemes.map((scheme) => scheme.name)),
    ).toEqual([['userPass']]);
  });

  it('keeps the schemes of one requirement object together, apart from other entries', () => {
    expect(
      build([
        { userPass: [], missing: [] },
        { $ref: '#/components/securitySchemes/userPass' },
        { type: 'X509' },
        { missing: [] },
      ]).map((schemes) => schemes.map((scheme) => scheme.name)),
    ).toEqual([['userPass'], ['userPass'], ['X509']]);
  });
});

