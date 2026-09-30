import { describe, it, expect } from 'vitest';
import { buildASTSchema, parse } from 'graphql';

import { extractInfoFromDirectives } from '../graphql-directive-utils.js';

const DIRECTIVE_DEFS = `
  directive @redocly_info(title: String, version: String, description: String, termsOfService: String) on SCHEMA
  directive @redocly_contact(name: String, url: String, email: String) on SCHEMA
  directive @redocly_license(name: String, url: String, identifier: String) on SCHEMA
`;

function schemaFrom(sdl: string) {
  return buildASTSchema(parse(DIRECTIVE_DEFS + sdl));
}

describe('extractInfoFromDirectives', () => {
  it('extracts info/contact/license directives and the schema docstring', () => {
    const schema = schemaFrom(`
      """
      # Bookstore API
      Manage books and authors.
      """
      schema
        @redocly_info(version: "2.1.0", termsOfService: "https://ex.com/terms")
        @redocly_contact(name: "API Team", email: "api@ex.com")
        @redocly_license(name: "MIT", url: "https://opensource.org/licenses/MIT") {
        query: Query
      }
      type Query { book: String }
    `);

    const info = extractInfoFromDirectives(schema);
    expect(info?.title).toBe('Bookstore API');
    expect(info?.description).toBe('Manage books and authors.');
    expect(info?.version).toBe('2.1.0');
    expect(info?.termsOfService).toBe('https://ex.com/terms');
    expect(info?.contact).toEqual({ name: 'API Team', url: undefined, email: 'api@ex.com' });
    expect(info?.license).toEqual({
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
      identifier: undefined,
    });
  });

  it('lets a directive title override the docstring title', () => {
    const schema = schemaFrom(`
      "# Docstring Title"
      schema @redocly_info(title: "Directive Title") {
        query: Query
      }
      type Query { book: String }
    `);
    expect(extractInfoFromDirectives(schema)?.title).toBe('Directive Title');
  });

  it('returns undefined when the schema has no directives or docstring', () => {
    const schema = schemaFrom(`schema { query: Query } type Query { book: String }`);
    expect(extractInfoFromDirectives(schema)).toBeUndefined();
  });
});
