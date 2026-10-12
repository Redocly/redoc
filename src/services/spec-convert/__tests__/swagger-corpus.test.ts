import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as yaml from 'js-yaml';

import { isRecord } from '../../../utils/is-record.js';
import { convertSwaggerToOpenApi } from '../swagger.js';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/swagger');

const loadYaml = (file: string): Record<string, unknown> => {
  const doc = yaml.load(readFileSync(file, 'utf8'), { schema: yaml.CORE_SCHEMA });
  if (!isRecord(doc)) throw new Error(`${file} is not a YAML mapping`);
  return doc;
};

const CASES = readdirSync(FIXTURES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

describe('convertSwaggerToOpenApi — golden corpus', () => {
  it.each(CASES)('%s', (name) => {
    const input = loadYaml(join(FIXTURES, name, 'swagger.yaml'));
    const expected = loadYaml(join(FIXTURES, name, 'openapi.yaml'));
    expect(JSON.parse(JSON.stringify(convertSwaggerToOpenApi(input)))).toEqual(expected);
  });
});
