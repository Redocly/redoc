import { generateCsvExample } from '../csv';
import { OpenAPIParser, RedocNormalizedOptions } from '../../services';
import { OpenAPIExample } from '../../types';

const opts = new RedocNormalizedOptions({});
const samplerOptions = {};

describe('generateCsvExample', () => {
  const spec = require('./fixtures/csv-compatible-schema.json');
  let parser;

  it('generates a csv example for an array of items using allOf', () => {
    parser = new OpenAPIParser(spec, undefined, opts);
    const sample = [
      {
        Competitor: 'google.com',
        '2023-02-02': 0.356263,
        '2023-02-03': 0.1251661,
      },
      {
        Competitor: 'facebook.com',
        '2023-02-02': 0.74324,
        '2023-02-03': 0.73542,
      },
    ] as unknown as OpenAPIExample;

    const examples = generateCsvExample({
      parser,
      schema: spec.components.schemas.test,
      sample,
      samplerOptions,
    });

    expect(examples).toMatchSnapshot();
  });

  it('generates a csv example for an array of items using oneOf', () => {
    parser = new OpenAPIParser(spec, undefined, opts);
    const sample = [
      {
        Competitor: 'facebook.com',
        '2023-02-02': 0.74324,
        '2023-02-03': 0.73542,
      },
    ] as unknown as OpenAPIExample;

    const examples = generateCsvExample({
      parser,
      schema: spec.components.schemas.test2,
      sample,
      samplerOptions,
    });

    expect(examples).toMatchSnapshot();
  });

  it('generates a csv example for an array of items using $ref', () => {
    parser = new OpenAPIParser(spec, undefined, opts);
    const sample = [
      {
        Competitor: 'google.com',
        '2023-02-02': 0.356263,
        '2023-02-03': 0.1251661,
      },
    ] as unknown as OpenAPIExample;

    const examples = generateCsvExample({
      parser,
      schema: spec.components.schemas.test3,
      sample,
      samplerOptions,
    });

    expect(examples).toMatchSnapshot();
  });

  it.each([
    {
      prop: [],
    },
    {
      prop2: {},
    },
    {
      prop3: null,
    },
    {
      prop4: undefined,
    },
  ] as unknown[] as OpenAPIExample[])(
    'should not generate a csv example',
    (sample: OpenAPIExample) => {
      parser = new OpenAPIParser(spec, undefined, opts);
      const examples = generateCsvExample({
        parser,
        schema: spec.components.schemas.test,
        sample,
        samplerOptions,
      });

      expect(examples.length).toEqual(0);
    },
  );
});
