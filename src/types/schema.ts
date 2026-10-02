import type { Node } from '@markdoc/markdoc';
import type { AsyncApiDefinition } from './asyncapi';
import type { ObjectValues } from './common';
import type { OpenAPIDefinition } from './openapi';

export type DiscriminatorObject = {
  propertyName?: string;
  mapping?: Record<string, string>;
  defaultMapping?: string;
  'x-explicitMappingOnly'?: boolean;
};

export type SchemaNode = {
  type?: string | string[];
  format?: string;
  title?: string;
  description?: string | Node | Node[];
  pattern?: string;
  default?: unknown;
  example?: unknown;
  const?: unknown;
  enum?: string[];
  deprecated?: boolean;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;

  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;

  minLength?: number;
  maxLength?: number;
  contentEncoding?: string;
  contentMediaType?: string;

  properties?: Record<string, SchemaNode>;
  additionalProperties?: SchemaNode | boolean;
  unevaluatedProperties?: SchemaNode | boolean;
  patternProperties?: Record<string, SchemaNode>;
  required?: string[];
  minProperties?: number;
  maxProperties?: number;

  items?: SchemaNode | SchemaNode[] | boolean;
  prefixItems?: SchemaNode[];
  additionalItems?: SchemaNode | boolean;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  oneOf?: SchemaNode[];
  anyOf?: SchemaNode[];
  allOf?: SchemaNode[];
  if?: SchemaNode;
  then?: SchemaNode;
  else?: SchemaNode;
  discriminator?: DiscriminatorObject;

  $ref?: string;

  externalDocs?: { url?: string; description?: string };

  'x-circular-ref'?: boolean;
  'x-allof-cycle'?: boolean;
  'x-complex'?: boolean;
  'x-nullable'?: boolean;
  'x-original-ref'?: string;
  'x-badges'?: BadgeType[];
  'x-enumDescriptions'?: Record<string, string | Node | Node[]>;
  'x-additionalPropertiesName'?: string;
  'x-discriminator'?: DiscriminatorObject;
  'x-displayName'?: string;
  'x-parentRefs'?: string[];
  'x-refsStack'?: string[];

  [key: string]: unknown;
};

export type AccessMode = 'read-only' | 'write-only' | undefined;

export type Document = OpenAPIDefinition | AsyncApiDefinition;

export function isSchemaNode(value: unknown): value is SchemaNode {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isStructuredExample(example: unknown): example is object {
  return typeof example === 'object' && example !== null;
}

export type PropertyType = {
  type: string;
  title?: string;
  schemaName?: string;
  isAdditionalProperty?: boolean;
  isAdditionalItems?: boolean;
  isTupleItem?: boolean;
  isPatternProperty?: boolean;
  isCircular?: boolean;
  isComplex?: boolean;
  isExpandable?: boolean;
  isRequired?: boolean;
  isDeprecated?: boolean;
  description?: string | Node | Node[];
  pattern?: string;
  example?: string | object;
  badges?: BadgeType[];
  default?: string;
  accessMode?: AccessMode;
  enum?: Record<string, string | Node | Node[]> | string[];
  examples?: Record<string, ExampleType>;
  extensions?: Record<string, string>;
  externalDocs?: ExternalDocsType;
  const?: string;
  properties?: Record<string, PropertyType>;
  items?: PropertyType[];
  switcher?: SwitcherType;
};

export type BadgeType = {
  name: string;
  position: 'before' | 'after';
  color: string;
};

export type ExampleType = {
  summary?: string;
  description?: string;
  value?: string;
};

export type ExternalDocsType = {
  description: string;
  url: string;
};

export const switcherLabel = {
  DISCRIMINATOR: 'Discriminator',
  ONE_OF: 'One of:',
  ANY_OF: 'Any of:',
} as const;

export type SwitcherLabel = ObjectValues<typeof switcherLabel>;

export type SwitcherType = {
  type: 'discriminator' | 'oneOf';
  label: SwitcherLabel;
  propertyName?: string;
  jsonPointer?: string;
  options: Record<string, SwitcherOptionType>;
};

export type SwitcherOptionType = {
  isDeprecated: boolean;
  isDefaultMapping: boolean;
  isCircular?: boolean;
  description?: string | Node | Node[];
  constraints?: string[];
  properties?: Record<string, PropertyType>;
  items?: PropertyType[];
  switcher?: SwitcherType;
  typeLabel?: string;
  title?: string;
  schemaName?: string;
  accessMode?: AccessMode;
  enum?: Record<string, string | Node | Node[]> | string[];
};

export type SchemaProcessorDialect = {
  readonly id: string;
  process(schema: SchemaNode, document: Document, options?: SchemaProcessorOptions): PropertyType;
};

export type SchemaProcessorOptions = {
  dialectId?: string;
  rootJsonPointer?: string;
  exampleSerializer?: (value: unknown) => string;
  sortRequiredPropsFirst?: boolean;
};
