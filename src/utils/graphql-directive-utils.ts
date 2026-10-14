import { Kind } from 'graphql';

import type {
  GraphQLNamedType,
  DirectiveNode,
  ValueNode,
  StringValueNode,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLArgument,
  GraphQLInputField,
  GraphQLSchema,
} from 'graphql';
import type { GraphQLInfo } from '../types/graphql.js';
import type { RequiresScopesDirective } from './graphql-scopes.js';

export type DirectiveTarget =
  | GraphQLNamedType
  | GraphQLEnumValue
  | GraphQLField<any, any>
  | GraphQLArgument
  | GraphQLInputField;

export function getRequiresScopesDirective(type: DirectiveTarget): RequiresScopesDirective | null {
  if (!type.astNode?.directives) {
    return null;
  }

  const requiresScopesDirective = type.astNode.directives.find(
    (directive) => directive.name.value === 'requiresScopes',
  );

  if (!requiresScopesDirective) {
    return null;
  }

  const scopes = extractScopesFromDirective(requiresScopesDirective);

  if (!scopes || scopes.length === 0) {
    return null;
  }

  return { scopes };
}

function extractScopesFromDirective(directive: DirectiveNode): string[][] | null {
  const scopesArgument = directive.arguments?.find((arg) => arg.name.value === 'scopes');

  if (!scopesArgument || !scopesArgument.value) {
    return null;
  }

  return extractStringArrayFromValue(scopesArgument.value);
}

function extractStringArrayFromValue(value: ValueNode): string[][] | null {
  if (value.kind !== Kind.LIST) {
    return null;
  }

  const scopes: string[][] = [];

  for (const item of value.values) {
    if (item.kind === Kind.LIST) {
      scopes.push((item.values as StringValueNode[]).map((v: StringValueNode) => v.value));
    }
  }

  return scopes.length > 0 ? scopes : null;
}

export function extractInfoFromDirectives(schema: GraphQLSchema): GraphQLInfo | undefined {
  const schemaNode = schema.astNode;
  if (!schemaNode) return undefined;

  const find = (name: string): DirectiveNode | undefined =>
    schemaNode.directives?.find((directive) => directive.name.value === name);

  const infoDirective = find('redocly_info');
  const contactDirective = find('redocly_contact');
  const licenseDirective = find('redocly_license');
  const docstring = parseSchemaDocstring(schemaNode.description?.value);

  if (!infoDirective && !contactDirective && !licenseDirective && !docstring) {
    return undefined;
  }

  const info: GraphQLInfo = {};

  if (docstring?.title) info.title = docstring.title;
  if (docstring?.description) info.description = docstring.description;

  if (infoDirective) {
    const args = getDirectiveStringArgs(infoDirective);
    if (args.title) info.title = args.title;
    if (args.version) info.version = args.version;
    if (args.description) info.description = args.description;
    if (args.termsOfService) info.termsOfService = args.termsOfService;
  }

  if (contactDirective) {
    const { name, url, email } = getDirectiveStringArgs(contactDirective);
    info.contact = { name, url, email };
  }

  if (licenseDirective) {
    const { name, url, identifier } = getDirectiveStringArgs(licenseDirective);
    info.license = { name, url, identifier };
  }

  return info;
}

function getDirectiveStringArgs(directive: DirectiveNode): Record<string, string> {
  const args: Record<string, string> = {};
  directive.arguments?.forEach((arg) => {
    if (arg.value.kind === Kind.STRING) {
      args[arg.name.value] = arg.value.value;
    }
  });
  return args;
}

function parseSchemaDocstring(
  docstring: string | undefined,
): { title?: string; description?: string } | null {
  const trimmed = docstring?.trim();
  if (!trimmed) return null;

  const [firstLine, ...rest] = trimmed.split('\n');
  if (firstLine.trim().startsWith('# ')) {
    return {
      title: firstLine.trim().slice(2).trim() || undefined,
      description: rest.join('\n').trim() || undefined,
    };
  }

  return { description: trimmed };
}
