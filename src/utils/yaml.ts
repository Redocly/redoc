import { CORE_SCHEMA, binaryTag, load, mergeTag, omapTag, pairsTag, setTag } from 'js-yaml';

/** YAML 1.2 core types without implicit timestamps: `2024-01-01` stays a string, as in the bundler. */
const YAML_SCHEMA_WITHOUT_TIMESTAMP = CORE_SCHEMA.withTags([
  mergeTag,
  binaryTag,
  omapTag,
  pairsTag,
  setTag,
]);

/** Parses one YAML document. Throws on a syntax error or on more than one document. */
export function parseYaml(text: string): unknown {
  return load(text, { schema: YAML_SCHEMA_WITHOUT_TIMESTAMP });
}
