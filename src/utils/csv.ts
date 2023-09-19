import * as Sampler from 'openapi-sampler';
import { OpenAPIExample, OpenAPISchema } from '../types';
import { Example } from '../types/example';
import { MergedOpenAPISchema, OpenAPIParser } from '../services';

const MAX_ITEM_DEPTH = 1;

interface CsvExampleProps {
  parser: OpenAPIParser;
  schema: OpenAPISchema;
  sample: OpenAPIExample;
  samplerOptions: object;
}

const hasSameHeaders = (headers: string, sample: OpenAPIExample) =>
  Object.keys(sample).every(key => headers.includes(key));

const getCsvRows = (sample: OpenAPIExample): string => {
  const headers = Object.keys(sample?.[0] ?? sample).join(',');
  // Ensure the schema has deterministic headers
  const hasValidHeaders = (Array.isArray(sample) ? sample : [sample]).every(row =>
    hasSameHeaders(headers, row),
  );
  if (!hasValidHeaders) return '';

  let values: string;

  if (Array.isArray(sample)) {
    values = sample.map(Object.values).join('\n');
  } else {
    values = Object.values(sample).join(',');
  }
  return headers + '\n' + values;
};

const cleanUpExamples = (examples: Example[]): Example[] =>
  examples.filter(({ exampleValue }) => exampleValue);

export const generateCsvExample = ({
  parser,
  schema,
  sample,
  samplerOptions,
}: CsvExampleProps): Example[] => {
  let examples: Example[] = [];
  let depthCount = 0;
  let exampleCount = 1;
  const isValidSample = (Array.isArray(sample) ? sample : [sample]).every(sampleItem =>
    Object.values(sampleItem).every(
      value => typeof value !== 'object' && typeof value !== 'undefined',
    ),
  );

  const processSamplesWithSchema = (subSchema: OpenAPISchema) => {
    if (!subSchema) {
      return;
    }

    const subItems = subSchema.items as OpenAPISchema;
    if (subSchema.type === 'array' && subItems && depthCount < MAX_ITEM_DEPTH) {
      depthCount++;
      processSamplesWithSchema(subItems);
    }
    const metadata = {
      exampleDescription: subSchema.description || schema.description || '',
      exampleSummary: subSchema.title || schema.title || 'Example CSV',
    };
    if (subSchema.allOf) {
      const resolved: OpenAPISchema = {
        ...schema,
        items: parser.deref(subSchema.allOf as MergedOpenAPISchema).resolved,
      };
      const sampleData = Sampler.sample(
        resolved as any,
        samplerOptions,
        parser.spec,
      ) as OpenAPIExample;

      const csvRows = getCsvRows(sampleData);
      examples.push({
        exampleId: `Example ${exampleCount++}`,
        exampleValue: csvRows,
        ...metadata,
      });
    } else if (subSchema.oneOf) {
      const oneOfExamples = subSchema.oneOf.map(oneOfSchema => {
        const { resolved } = parser.deref(oneOfSchema as MergedOpenAPISchema);
        const sampleData = Sampler.sample(
          resolved as any,
          samplerOptions,
          parser.spec,
        ) as OpenAPIExample;
        const csvRows = getCsvRows(sampleData);
        const currentMetadata = {
          exampleDescription: oneOfSchema.description || metadata.exampleDescription,
          exampleSummary: oneOfSchema.title || metadata.exampleSummary,
        };

        return {
          exampleId: `Example ${exampleCount++}`,
          exampleValue: csvRows,
          ...currentMetadata,
        };
      });
      examples = [...examples, ...oneOfExamples];
    } else if (subSchema.$ref) {
      const csvRows = getCsvRows(sample);
      examples.push({
        exampleId: `Example ${exampleCount++}`,
        exampleValue: csvRows,
        ...metadata,
      });
    }
  };

  if (isValidSample) {
    processSamplesWithSchema(schema);
  }

  return cleanUpExamples(examples);
};
