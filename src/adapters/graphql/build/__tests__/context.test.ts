import { describe, it, expect } from 'vitest';
import { parse } from 'graphql';

import { createBuildContext } from '../context.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';

const DIRECTIVE_DEFS = `
  directive @redocly_contact(name: String, url: String, email: String) on SCHEMA
  directive @redocly_license(name: String, url: String, identifier: String) on SCHEMA
`;

describe('createBuildContext — schema/config info merge', () => {
  it('deep-merges contact & license so partial config keeps directive sibling fields', () => {
    const document = parse(
      DIRECTIVE_DEFS +
        `
      schema
        @redocly_contact(name: "API Team", email: "api@ex.com")
        @redocly_license(name: "MIT", url: "https://opensource.org/licenses/MIT") {
        query: Query
      }
      type Query { book: String }
    `,
    );

    const options = normalizeOptions({
      specType: 'graphql',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      info: { contact: { name: 'Config Name' }, license: { identifier: 'MIT-0' } },
    });

    const ctx = createBuildContext({ document, basePath: '', options });

    expect(ctx.options.info?.contact).toMatchObject({ name: 'Config Name', email: 'api@ex.com' });
    expect(ctx.options.info?.license).toMatchObject({
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
      identifier: 'MIT-0',
    });
  });
});
