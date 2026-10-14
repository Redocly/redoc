import type { ApiStore, SchemaEntry } from '../types/store.js';
import type { GraphqlStoreFieldData, GraphqlTypeData } from '../types/graphql-store.js';

import { graphqlTypeEntryId } from '../types/graphql-store.js';

export const INDENTATION = '  ';
export const CONNECTION_FIELDS: ReadonlySet<string> = new Set([
  'edges',
  'nodes',
  'node',
  'pageInfo',
]);

export type GraphqlTypeLookup = (name: string) => GraphqlTypeData | undefined;

export function createGraphqlTypeLookup(
  schemaStore: Record<string, SchemaEntry>,
): GraphqlTypeLookup {
  return (name) => schemaStore[graphqlTypeEntryId(name)]?.data as GraphqlTypeData | undefined;
}

export function getOperationFromStore(
  store: Pick<ApiStore, 'schemaStore' | 'graphqlMeta'>,
  operationType: 'query' | 'mutation' | 'subscription',
  operationName: string,
): GraphqlStoreFieldData | undefined {
  const rootTypeName = store.graphqlMeta?.rootTypes[operationType];
  if (!rootTypeName) return undefined;
  const rootType = store.schemaStore[graphqlTypeEntryId(rootTypeName)]?.data as
    | GraphqlTypeData
    | undefined;
  return rootType?.fields?.find((field) => field.name === operationName);
}

type ParsedTypeNotation =
  | { kind: 'named'; name: string }
  | { kind: 'list'; ofType: ParsedTypeNotation }
  | { kind: 'non-null'; ofType: ParsedTypeNotation };

export function parseTypeNotation(display: string): ParsedTypeNotation {
  const trimmed = display.trim();
  if (trimmed.endsWith('!')) {
    return { kind: 'non-null', ofType: parseTypeNotation(trimmed.slice(0, -1)) };
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return { kind: 'list', ofType: parseTypeNotation(trimmed.slice(1, -1)) };
  }
  return { kind: 'named', name: trimmed };
}

function indent(level: number): string {
  return INDENTATION.repeat(level);
}

export function getScalarExample(typeName: string): unknown {
  switch (typeName) {
    case 'Int':
      return 40;
    case 'Float':
      return 40.0;
    case 'String':
      return 'Example String';
    case 'Boolean':
      return true;
    case 'ID':
      return '9cfb1c81-4c79-452f-b1f5-8ee6571276b4';
    default:
      return 'Example Custom Scalar';
  }
}

export function getTypeExample(
  display: string,
  lookup: GraphqlTypeLookup,
  expandLevel: number,
  level = 0,
): unknown {
  return getParsedTypeExample(parseTypeNotation(display), lookup, expandLevel, level, new Set());
}

function getParsedTypeExample(
  parsed: ParsedTypeNotation,
  lookup: GraphqlTypeLookup,
  maxLevel: number,
  level: number,
  pathAtThisDepth: ReadonlySet<string>,
): unknown {
  if (parsed.kind === 'non-null') {
    return getParsedTypeExample(parsed.ofType, lookup, maxLevel, level, pathAtThisDepth);
  }
  if (parsed.kind === 'list') {
    return [getParsedTypeExample(parsed.ofType, lookup, maxLevel, level, pathAtThisDepth)];
  }
  return getNamedTypeExample(parsed.name, lookup, maxLevel, level, pathAtThisDepth);
}

function getNamedTypeExample(
  typeName: string,
  lookup: GraphqlTypeLookup,
  maxLevel: number,
  level: number,
  pathAtThisDepth: ReadonlySet<string>,
): unknown {
  const data = lookup(typeName);
  if (!data || data.variant === 'scalar') {
    return getScalarExample(typeName);
  }
  if (data.variant === 'object' || data.variant === 'interface') {
    return getFieldsExample(data, lookup, maxLevel, level, true, pathAtThisDepth);
  }
  if (data.variant === 'input') {
    return getFieldsExample(data, lookup, maxLevel, level, false, pathAtThisDepth);
  }
  if (data.variant === 'union') {
    const firstMember = data.possibleTypes?.[0];
    return firstMember
      ? getNamedTypeExample(firstMember, lookup, maxLevel, level, pathAtThisDepth)
      : {};
  }
  if (data.variant === 'enum') {
    return data.enumValues?.[0]?.name;
  }
  return {};
}

function getFieldsExample(
  data: GraphqlTypeData,
  lookup: GraphqlTypeLookup,
  maxLevel: number,
  level: number,
  withConnectionHeuristic: boolean,
  pathAtThisDepth: ReadonlySet<string>,
): Record<string, unknown> {
  if (level === maxLevel || pathAtThisDepth.has(data.name)) {
    return { __typename: data.name };
  }

  const pathWithType = new Set(pathAtThisDepth).add(data.name);
  const result: Record<string, unknown> = {};
  for (const field of data.fields ?? []) {
    const parsed = parseTypeNotation(field.type.display);
    result[field.name] =
      withConnectionHeuristic && CONNECTION_FIELDS.has(field.name)
        ? getParsedTypeExample(parsed, lookup, maxLevel, level, pathWithType)
        : getParsedTypeExample(parsed, lookup, maxLevel, level + 1, new Set());
  }
  return result;
}

type SampleLabels = {
  argumentsHere: string;
  fragment: string;
};

const DEFAULT_SAMPLE_LABELS: SampleLabels = {
  argumentsHere: 'Arguments Here',
  fragment: 'Fragment',
};

export function getVariablesDeclaration(args: GraphqlStoreFieldData[], multiline: boolean): string {
  if (args.length === 0) return '';
  if (multiline) {
    const items = args.map((arg) => `${indent(1)}$${arg.name}: ${arg.type.display}`).join('\n');
    return `(\n${items}\n)`;
  }
  return `(${args.map((arg) => `$${arg.name}: ${arg.type.display}`).join(', ')})`;
}

function getArgumentsStr(
  args: GraphqlStoreFieldData[],
  multiline: boolean,
  indentLevel: number,
  level: number,
  labels: SampleLabels,
): string {
  if (args.length === 0) return '';
  if (level > 0) {
    const child = indent(indentLevel + 1);
    const own = indent(indentLevel);
    return `(\n${child}# ${labels.argumentsHere}\n${own})`;
  }
  if (multiline) {
    const own = indent(indentLevel);
    const child = indent(indentLevel + 1);
    const items = args.map((arg) => `${child}${arg.name}: $${arg.name}`).join('\n');
    return `(\n${items}\n${own})`;
  }
  return `(${args.map((arg) => `${arg.name}: $${arg.name}`).join(', ')})`;
}

function getSelectionSetExample(
  typeName: string,
  lookup: GraphqlTypeLookup,
  multiline: boolean,
  indentLevel: number,
  maxLevel: number,
  level: number,
  labels: SampleLabels,
  pathAtThisDepth: ReadonlySet<string>,
): string {
  const data = lookup(typeName);
  if (!data) return '';
  if (data.variant === 'object' || data.variant === 'interface') {
    return getObjectSelectionSet(
      data,
      lookup,
      multiline,
      indentLevel,
      maxLevel,
      level,
      labels,
      pathAtThisDepth,
    );
  }
  if (data.variant === 'union') {
    const firstMember = data.possibleTypes?.[0];
    if (!firstMember) return '';
    return getSelectionSetExample(
      firstMember,
      lookup,
      multiline,
      indentLevel,
      maxLevel,
      level,
      labels,
      pathAtThisDepth,
    );
  }
  return '';
}

function getObjectSelectionSet(
  data: GraphqlTypeData,
  lookup: GraphqlTypeLookup,
  multiline: boolean,
  indentLevel: number,
  maxLevel: number,
  level: number,
  labels: SampleLabels,
  pathAtThisDepth: ReadonlySet<string>,
): string {
  const own = indent(indentLevel);

  if (level === maxLevel || pathAtThisDepth.has(data.name)) {
    const child = indent(indentLevel + 1);
    return `{\n${child}__typename\n${child}# ...${data.name}${labels.fragment}\n${own}}`;
  }

  const pathWithType = new Set(pathAtThisDepth).add(data.name);
  const fieldExamples = (data.fields ?? [])
    .map((field) => {
      const isConnectionField = CONNECTION_FIELDS.has(field.name);
      return getFieldExample(
        field,
        lookup,
        multiline,
        indentLevel + 1,
        maxLevel,
        isConnectionField ? level : level + 1,
        labels,
        isConnectionField ? pathWithType : new Set(),
      );
    })
    .join('\n');

  return `{\n${fieldExamples}\n${own}}`;
}

function getFieldExample(
  field: GraphqlStoreFieldData,
  lookup: GraphqlTypeLookup,
  multiline: boolean,
  indentLevel: number,
  maxLevel: number,
  level: number,
  labels: SampleLabels,
  pathAtThisDepth: ReadonlySet<string>,
): string {
  const argsStr = getArgumentsStr(field.args ?? [], multiline, indentLevel, level, labels);
  const selectionSet = getSelectionSetExample(
    field.type.name,
    lookup,
    multiline,
    indentLevel,
    maxLevel,
    level,
    labels,
    pathAtThisDepth,
  );
  const sep = selectionSet ? ' ' : '';
  return `${indent(indentLevel)}${field.name}${argsStr}${sep}${selectionSet}`;
}

export function generateOperationExample(
  operationType: 'query' | 'mutation' | 'subscription',
  operation: GraphqlStoreFieldData,
  lookup: GraphqlTypeLookup,
  expandLevel: number,
  multilineArguments?: boolean,
  labels: Partial<SampleLabels> = {},
): string {
  const args = operation.args ?? [];
  const multiline = multilineArguments ?? args.length > 4;
  const variables = getVariablesDeclaration(args, multiline);
  const mergedLabels = { ...DEFAULT_SAMPLE_LABELS, ...labels };
  const fieldStr = getFieldExample(
    operation,
    lookup,
    multiline,
    1,
    expandLevel,
    0,
    mergedLabels,
    new Set(),
  );
  return `${operationType} ${operation.name}${variables} {\n${fieldStr}\n}`;
}

export function generateOperationVariablesExample(
  args: GraphqlStoreFieldData[],
  lookup: GraphqlTypeLookup,
  expandLevel: number,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const arg of args) {
    result[arg.name] = getTypeExample(arg.type.display, lookup, expandLevel);
  }
  return result;
}

export function generateOperationResponseExample(
  typeDisplay: string,
  lookup: GraphqlTypeLookup,
  expandLevel: number,
): object {
  return { data: getTypeExample(typeDisplay, lookup, expandLevel) };
}
